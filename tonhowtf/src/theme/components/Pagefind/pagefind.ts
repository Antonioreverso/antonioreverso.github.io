/**
 * Represents an anchor within the search result content.
 */
interface Anchor {
	element: string
	id: string
	text: string
	location: number
}

/**
 * Represents a weighted location within the search result content.
 */
interface WeightedLocation {
	weight: number
	balanced_score: number
	location: number
}

/**
 * Represents a sub-result related to the main search result.
 */
interface SubResult {
	title: string
	url: string
	anchor: Anchor
	weighted_locations: WeightedLocation[]
	locations: number[]
	excerpt: string
}

/**
 * Represents a Pagefind search result.
 */
export interface PagefindResult {
	url: string
	content: string
	word_count: number
	filters: Record<string, unknown>
	meta: {
		title: string
		[key: string]: unknown
	}
	anchors: Anchor[]
	weighted_locations: WeightedLocation[]
	locations: number[]
	raw_content: string
	raw_url: string
	excerpt: string
	sub_results: SubResult[]
}
