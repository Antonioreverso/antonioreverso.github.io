import type { GiscusWidget } from 'giscus'

export type GiscusConfig = Pick<
	GiscusWidget,
	| 'repo'
	| 'repoId'
	| 'category'
	| 'categoryId'
	| 'mapping'
	| 'term'
	| 'strict'
	| 'reactionsEnabled'
	| 'emitMetadata'
	| 'inputPosition'
	| 'theme'
	| 'lang'
	| 'loading'
>

export interface ThemeConfig {
	site: {
		title: string
		description: string
		locale: `${string}-${string}`
		url?: string
	}
	author: {
		name: string
		email: string
		signature: string
		avatar: {
			url: string
			alt: string
		}
	}
	links?: {
		github?: string
		bilibili?: string
	}
	pages?: {
		aboutMe?: string
	}
	comment?: {
		giscus?: GiscusConfig
	}
}
