export type SelectorKeys = "root" | "title" | "authors" | "ingredients" | "steps" | "yield"
export type SelectorMap = { [key in SelectorKeys]: { attr: string, value: string } }
export type CascadingSelectorMap = { [key in SelectorKeys]: { attr: string, value: string }[] }

export const HRECIPE_STANDARD: SelectorMap = {
	root: { attr: "class", value: "hrecipe" },
	title: { attr: "class", value: "fn" },
	authors: { attr: "class", value: "author" },
	ingredients: { attr: "class", value: "ingredient" },
	steps: { attr: "class", value: "instructions" },
	yield: { attr: "class", value: "yield" }
}

export const HRECIPE_ITEM_PROP: SelectorMap = {
	root: { attr: "itemtype", value: "http://schema.org/Recipe" },
	title: { attr: "itemprop", value: "fn" },
	authors: { attr: "itemprop", value: "author" },
	ingredients: { attr: "itemprop", value: "ingredient" },
	steps: { attr: "itemprop", value: "instructions" },
	yield: { attr: "itemprop", value: "yield" }
}

export const EXHAUSTIVE_ITEM_PROP: CascadingSelectorMap = {
	root: [{attr: "itemtype", value: "http://schema.org/Recipe"}],
	title: [{ attr: "itemprop", value: 'name' },],
	authors: [{ attr: "itemprop", value: "author" }],
	ingredients: [
		{ attr: "itemprop", value: "recipeIngredients" },
		{ attr: "itemprop", value: "ingredients" },
	],
	steps: [{ attr: "itemprop", value: "recipeInstructions" }],
	yield: [{ attr: "itemprop", value: "yield" },]
}
