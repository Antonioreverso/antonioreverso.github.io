import type { ThemeConfig } from './utils/config'
//@ts-ignore
import _config from 'virtual:theme-config'

const config = _config as ThemeConfig

export default config

export const onlyHasRss = Object.keys(config.links ?? {}).length === 0
