export type Author = {
	name?: string
}

export type Ingredient = {
	name?: string
	amount?: number
	measure?: string
}

export type Step = {
	text?: string
}

export type Recipe = {
	authors: Author[]
	title?: string
	yield?: number
	yieldMetric?: string
	ingredients: Ingredient[]
	steps: Step[]
}