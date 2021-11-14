import { extractFromStructuredData } from "./structured-data"
import axios from "axios"

const structuredRecipes = [
	["Epicurious", "https://www.epicurious.com/recipes/food/views/hasselback-butternut-squash-with-bay-leaves"],
	["AllRcipes", "https://www.allrecipes.com/recipe/230103/buttery-garlic-green-beans/"],
	["BBC", "https://www.bbcgoodfood.com/recipes/chilli-con-carne-recipe"],
]

describe("Structured data", () => {


	it.each(structuredRecipes)("Parses and transforms recipes with structured data (%s)", async (name, expected) => {
		const url = "https://www.epicurious.com/recipes/food/views/hasselback-butternut-squash-with-bay-leaves"
		const res = await axios.get(url)
		const html = res.data
		const [first] = extractFromStructuredData(html)

		expect(first.title).toBeDefined()
		expect(first.steps.length).toBeGreaterThan(0)
		expect(first.ingredients.length).toBeGreaterThan(0)
		expect(first.yield).toBeDefined()
		expect(first.yieldMetric).toBeDefined()
	})


})