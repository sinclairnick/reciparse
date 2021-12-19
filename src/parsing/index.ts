import axios from "axios"
import { Recipe } from ".."
import { extractFromHRecipe } from "./hrecipe/hrecipe"
import { extractFromStructuredData } from "./structured/structured-data"
export * from "./structured"


export const parseFromUrl = async (url: string): Promise<Recipe[]> => {
	const res = await axios.get(url)
	const html = res.data
	const candidates = extractFromStructuredData(html)

	if (candidates.length > 0) {
		return candidates
	}

	const recipe = extractFromHRecipe(html)
	return recipe ? [recipe] : []
}