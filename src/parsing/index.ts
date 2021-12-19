import axios from "axios"
import { InvalidUrlException, Recipe } from ".."
import { checkIsDomainSupported, parseWithCustom, validateForCustomDomain } from "./custom"
import { extractFromHRecipe } from "./hrecipe/hrecipe"
import { extractFromStructuredData } from "./structured/structured-data"
export * from "./structured"
import { URL } from "url"
import { checkIsValidUrl } from "../common/constants"


export const parseFromUrl = async (url: string): Promise<Recipe[]> => {
	const res = await axios.get(url)
	const html = res.data

	const isValidUrl = checkIsValidUrl(url)

	if (!isValidUrl) {
		throw new InvalidUrlException()
	}

	const urlObject = new URL(url)
	const domain = urlObject.host

	const hasCustomParser = checkIsDomainSupported(domain)
	if (hasCustomParser) {
		const recipe = await parseWithCustom(html, domain)
		return recipe ? [recipe] : []
	}

	const candidates = extractFromStructuredData(html)

	if (candidates.length > 0) {
		return candidates
	}

	const recipe = extractFromHRecipe(html)
	return recipe ? [recipe] : []
}