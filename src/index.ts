import axios from "axios"
import cheerio from "cheerio"
import { HRecipe } from "./types"

const isHRecipe = (val: any): val is HRecipe => "@type" in val && val["@type"] === "Recipe"
const isNotNull = <T = any>(val?: T | null): val is T => val != null

export const parseFromUrl = async (url: string) => {
	try {
		const res = await axios.get(url)
		const $ = cheerio.load(res.data)
		const appScripts = $("script[type*=application]")
		const htmls = appScripts
			.toArray()
			.map((el) => $(el).html())
			.filter(isNotNull);

		const candidates: HRecipe[] = []

		for (const html of htmls) {
			const data = JSON.parse(html)
			if (Array.isArray(data)) {
				const hrecipe = data.find(isHRecipe)
				if (hrecipe != null) {
					candidates.push(hrecipe)
				}
				continue
			}
			if (isHRecipe(data)) {
				candidates.push(data)
			}
		}

		return candidates
	} catch (e) {
		throw e
	}
}