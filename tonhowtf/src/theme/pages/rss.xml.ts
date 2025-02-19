import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import config from '../consts'

export const GET: APIRoute = async function (context) {
	const posts = await getCollection('blog')
	return rss({
		title: config.site.title,
		description: config.site.description,
		site: context.site!,
		items: posts.map((post) => ({
			author: config.author.name,
			pubDate:
				post.data.pubDate || post.data.date || post.data.ctime || new Date(),
			...post.data,
			// @ts-ignore
			link: `/blog/${post.id ?? post.slug}/`,
		})),
	})
}
