import { parseFromUrl } from "."

const urls = [
	["Epicurious", "https://www.epicurious.com/recipes/food/views/hasselback-butternut-squash-with-bay-leaves"],
	["AllRcipes", "https://www.allrecipes.com/recipe/230103/buttery-garlic-green-beans/"]
]

describe("Tests", () => {
	it.each(urls)("Should parse a websites content and extract hrecipe data (%s)", async (name, url) => {
		const res = await parseFromUrl(url)

		expect(res?.["@type"]).toBe("Recipe")
		expect(res?.recipeIngredient).toBeDefined()
		expect(res?.recipeIngredient?.length).toBeGreaterThan(0)
	})
})