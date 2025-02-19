export function getNavigatorLocale() {
	const candidates = navigator.languages.map(
		(locale) => locale.toLowerCase().split('-')[0],
	)
	for (const locale of candidates) {
		switch (locale) {
			case 'zh':
				return 'zh'
			case 'en':
				return 'en'
		}
	}
	return 'en'
}

interface Lang {
	[k: string]: string | Lang
}

export function getValueFromJsonByPath(path: string[], obj: Lang) {
	let current: string | Lang | undefined = obj
	for (const key of path) {
		if (typeof current === 'object' && current !== null && key in current) {
			current = current[key]
		} else {
			return undefined
		}
	}
	return current
}
