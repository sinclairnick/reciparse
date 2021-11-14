import * as HTMLParser from "node-html-parser"
import { isNotNull } from "../../common/constants";
import { extractIngredientInfo, extractYieldInfo } from "../../common/extractors";
import { Recipe } from "../../common/types";
import { SchemaOrgRecipe } from "./structured.types";

const isStructuredRecipe = (val: any): val is SchemaOrgRecipe => "@type" in val && val["@type"] === "Recipe"

const extractAuthors = (authors: SchemaOrgRecipe["author"]): Recipe["authors"] => {
	if (authors == null) {
		return []
	}
	if (Array.isArray(authors)) {
		return authors.map(a => ({ name: a.name }))
	}
	return [{ name: authors.name }]
}

const extractIngredients = (ingredients: SchemaOrgRecipe["recipeIngredient"]): Recipe["ingredients"] => {
	return ingredients?.map(ing => extractIngredientInfo(ing)) ?? []
}

const extractSteps = (steps: SchemaOrgRecipe["recipeInstructions"]): Recipe["steps"] => {
	return steps?.map(step => ({ text: step.text })) ?? []
}

const transformSchemaOrgRecipe = (data: SchemaOrgRecipe): Recipe => {
	const authors = extractAuthors(data.author)
	const ingredients = extractIngredients(data.recipeIngredient)
	const steps = extractSteps(data.recipeInstructions)
	const yieldResult = extractYieldInfo(data.recipeYield)

	return {
		title: data.name,
		steps,
		authors,
		ingredients,
		yield: yieldResult.amount,
		yieldMetric: yieldResult.metric,
	}
}

export const extractFromStructuredData = (html: string): Recipe[] => {
	const document = HTMLParser.parse(html)
	const appScripts = document.querySelectorAll("script[type=application/ld+json]")
	const htmls = appScripts
		.map((el) => el.innerHTML)
		.filter(isNotNull);

	const candidates: SchemaOrgRecipe[] = []

	for (const html of htmls) {
		const data = JSON.parse(html)
		if (Array.isArray(data)) {
			const hrecipe = data.find(isStructuredRecipe)
			if (hrecipe != null) {
				candidates.push(hrecipe)
			}
			continue
		}
		if (isStructuredRecipe(data)) {
			candidates.push(data)
		}
	}

	const recipes: Recipe[] = candidates.map(transformSchemaOrgRecipe)
	return recipes
}