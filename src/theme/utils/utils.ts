import config from '../consts'
import { osLocaleSync } from './locale'

export function getLanguageCode() {
	const reg = /^([a-z]{2,})(?:-[a-z]{2,})?$/i
	return (
		reg.exec(config.site.locale)?.[1] || reg.exec(osLocaleSync())?.[1] || 'zh'
	)
}
