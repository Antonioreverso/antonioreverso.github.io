import { cloneDeep, isPlainObject } from 'lodash-es'
import en from './lang/en.json'
import zh from './lang/zh.json'
import { getValueFromJsonByPath } from './utils'

function getLangPack(locale: string) {
	switch (locale) {
		case 'zh':
			return zh
		default:
			return en
	}
}

export function translate({ locale, text }: { locale: string; text: string }) {
	const pack = getLangPack(locale)
	const res = getValueFromJsonByPath(text.split('.'), pack)
	if (typeof res === 'string') {
		return res
	}
	return text
}

function DFS<T extends Function>(cb: T) {
	function dfs(obj: any, prefix: string[] = []) {
		for (const [key, value] of Object.entries(obj)) {
			if (typeof value === 'string') obj[key] = cb([...prefix, key])
			else if (isPlainObject(value)) dfs(value, [...prefix, key])
		}
	}
	return dfs
}

function ReplaceWithStringPath() {
	return DFS((prefix: string[]) => prefix.join('.'))
}

type DeepKeyToPath<T, P extends string = ''> = {
	[K in keyof T]: T[K] extends object
		? DeepKeyToPath<T[K], `${P}${Extract<K, string>}.`>
		: `${P}${Extract<K, string>}`
}

export function useI18nSource() {
	const source = Object.assign({}, cloneDeep(en), cloneDeep(zh))
	ReplaceWithStringPath()(source)
	return source as unknown as DeepKeyToPath<typeof source>
}

export const t = useI18nSource()
