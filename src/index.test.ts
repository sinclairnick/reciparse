import { parseFromUrl } from "."

const urls = [
	["Epicurious", "https://www.epicurious.com/recipes/food/views/hasselback-butternut-squash-with-bay-leaves"],
	["AllRcipes", "https://www.allrecipes.com/recipe/230103/buttery-garlic-green-beans/"],
	["BBC", "https://www.bbcgoodfood.com/recipes/chilli-con-carne-recipe"]
]

describe("Tests", () => {
	it.each(urls)("Should parse a websites content and extract hrecipe data (%s)", async (name, url) => {
		const res = await parseFromUrl(url)

		const [first] = res
		expect(first?.["@type"]).toBe("Recipe")
		expect(first?.recipeIngredient).toBeDefined()
		expect(first?.recipeIngredient?.length).toBeGreaterThan(0)
	})
})