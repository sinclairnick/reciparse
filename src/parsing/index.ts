import axios from "axios"
import { extractFromStructuredData } from "./structured/structured-data"

export const parseFromUrl = async (url: string) => {
	const res = await axios.get(url)
	const html = res.data
	const candidates = extractFromStructuredData(html)

	if (candidates.length > 0) {
		return candidates
	}

}