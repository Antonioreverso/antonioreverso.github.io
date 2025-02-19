class PagefindMask extends HTMLElement {
	connectedCallback() {
		if (this.dataset.blur?.toLowerCase() === 'true') {
			this.classList.add('backdrop-blur-sm')
		}
	}

	show() {
		this.classList.remove('hidden')
	}

	hide() {
		this.classList.add('hidden')
	}
}

customElements.define('pagefind-mask', PagefindMask)
