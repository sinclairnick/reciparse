import axios from "axios"
import cheerio from "cheerio"
import { HRecipe } from "./types"

const isHRecipe = (val: any): val is HRecipe => "@type" in val && val["@type"] === "Recipe"

export const parseFromUrl = async (url: string) => {
	try {
		const res = await axios.get(url)
		const $ = cheerio.load(res.data)
		const appScripts = $("script[type*=application]")
		const html = appScripts.html()

		if (html == null || html.length === 0) {
			return
		}

		const data = JSON.parse(html)

		if (Array.isArray(data)) {
			return data.find(isHRecipe)
		}

		if (isHRecipe(data)) {
			return data
		}

		return
	} catch (e) {
		throw e
	}
}