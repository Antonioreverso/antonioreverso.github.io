import type { PagefindResult } from './pagefind'

export class PagefindSearchResultItem extends HTMLElement {
	template = document.getElementById(
		'template-pagefind-search-result-item',
	) as HTMLTemplateElement

	constructor(public result: PagefindResult) {
		super()
		this.appendChild(this.template.content.cloneNode(true))
	}

	connectedCallback() {
		const link = this.querySelector('a')!
		link.href = this.result.url
		link.textContent = this.result.meta.title || 'Untitled'
		const excerpt = this.querySelector('.excerpt') as HTMLParagraphElement
		excerpt.innerHTML = this.result.excerpt
	}
}

customElements.define('pagefind-search-result-item', PagefindSearchResultItem)
