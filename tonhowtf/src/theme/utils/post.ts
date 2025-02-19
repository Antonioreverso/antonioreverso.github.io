import type { ImageMetadata } from 'astro'
import type { MaybePromise } from 'astro/actions/runtime/utils.js'
import { render, type AnyEntryMap, type CollectionEntry } from 'astro:content'
import { uniq } from 'lodash-es'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toString } from 'mdast-util-to-string'
import path from 'node:path'
import getReadingTime from 'reading-time'
import { remark } from 'remark'
import * as visit from 'unist-util-visit'
import { getFirstCommitTime, getLastCommitTime } from './git'
import { readMap } from './map'

export type ArticleTag = string | number

export interface IPostInfo {
	collection: string
	slug: string
	ctime: Date
	description?: string
	id: string
	isDraft: boolean
	link: string
	mtime: Date
	tags: ArticleTag[]
	title?: string
	cover?: ImageMetadata
	banner?: string
	body: string
	reading: {
		words: number
		minutes: number
		text: string
		time: number
	}
}

const infoCache = new Map<string, IPostInfo>()

type Entry = MaybePromise<CollectionEntry<keyof AnyEntryMap>>
export async function getPostInfo(entry: Entry) {
	const _entry = await entry
	// @ts-ignore
	const id = _entry.id ?? _entry.slug
	return readMap(infoCache, `${_entry.collection}+${id}`, async () => {
		const filePath = _entry.filePath!
		const ctime =
			_entry.data.date ??
			_entry.data.ctime ??
			_entry.data.pubDate ??
			(await getFirstCommitTime(filePath)) ??
			new Date()
		const mtime =
			_entry.data.mtime ??
			_entry.data.updatedDate ??
			(await getLastCommitTime(filePath)) ??
			new Date()
		const tags = uniq(
			_entry.data.tags ?? (id ? path.dirname(id).split('/') : []),
		)
		const { headings } = await render(_entry)
		const h1 = headings.find((h) => h.depth === 1)
		const fileExt = path.extname(filePath)
		const title =
			_entry.data.title ?? h1?.text ?? path.basename(filePath ?? '', fileExt)
		const readingTime = getReadingTimeFromMarkdown(_entry.body ?? '')
		const cover = _entry.data.cover ?? _entry.data.heroImage
		return {
			collection: _entry.collection,
			slug: id,
			ctime,
			description: _entry.data.description,
			id: _entry.id,
			isDraft: _entry.data.draft ?? false,
			link: `/${_entry.collection}/${id}/`,
			mtime,
			tags,
			title,
			cover,
			body: _entry.body!,
			reading: {
				words: readingTime.words,
				minutes: readingTime.minutes,
				text: readingTime.text,
				time: readingTime.time,
			},
		}
	})
}

export function extractBeforeMore(markdown: string) {
	const tree = remark().parse(markdown)
	let foundMore = false
	let offset = 0
	const moreRegex = /^<!--\s*more\s*-->$/i
	visit.visit(tree, (node) => {
		if (node.type === 'root') return
		if (node.type === 'html' && moreRegex.test(node.value.trim())) {
			foundMore = true
			offset = node.position?.start.offset ?? 0
			return visit.EXIT // Exit early since we found the <!-- more -->
		}
	})

	if (foundMore) {
		return markdown.slice(0, offset)
	}
	return ''
}

export async function getAllPostsInfo(collection: MaybePromise<Entry[]>) {
	const entries = await Promise.resolve(collection)
	return Promise.all(entries.map((e) => getPostInfo(e)))
}

export async function getSafePostsInfo(collection: MaybePromise<Entry[]>) {
	const posts = await getAllPostsInfo(collection)
	return posts.filter((p) => !p.isDraft)
}

export function getReadingTimeFromMarkdown(text: string) {
	const tree = fromMarkdown(text)
	const textOnPage = toString(tree)
	return getReadingTime(textOnPage)
}

export function aggregateByTag(posts: IPostInfo[]) {
	const res = new Map<string, IPostInfo[]>()
	posts.forEach((p) => {
		p.tags.forEach((t) => {
			if (!res.has(t.toString())) {
				res.set(t.toString(), [])
			}
			res.get(t.toString())?.push(p)
		})
	})
	return res
}

export function getTagLink(tag: ArticleTag) {
	return `/archive/tag/${encodeURIComponent(tag)}`
}
