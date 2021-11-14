import axios from "axios"
import { extractFromHRecipe } from "./hrecipe"

describe("Hrecipe", () => {
	const tests = [
		["Food lovers", "https://www.foodlovers.co.nz/recipes/raw-energy-salad.html"],
		["Dish", "https://dish.co.nz/recipes/tarragon-chicken-and-leeks/"]
	]

	it.each(tests)("Extracts hRecipe data (%s)", async (name, url) => {
		const res = await axios.get(url)

		const data = extractFromHRecipe(res.data)
		console.log(data)

	})
})