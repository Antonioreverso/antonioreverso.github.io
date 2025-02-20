// astro.config.mjs
import theme from 'astro-theme-meo'
import { defineConfig } from 'astro/config'

import vue from '@astrojs/vue';

export default defineConfig({
    site: 'https://antonioreverso.github.io',
    base: '/',
    integrations: [
    theme({
        site: {
            title: `Tonhoca`,
            description: 'Soon...',
            locale: 'en-US',
            url: 'https://antonioreverso.github.io/',
        },
        author: {
            name: 'Tonho',
            email: 'user@example.com',
            signature: 'Computadores?',
            avatar: {
                url: 'https://avatars.githubusercontent.com/u/58658417?v=4',
                alt: 'Yuki',
            },
        },
        pages: {
            aboutMe: '/about',
        },
		}), vue()],
})