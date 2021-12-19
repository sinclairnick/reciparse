import { parseFromUrl } from "."

describe("E2E tests", () => {
	const cases = [
		["https://adamliaw.com/recipe/roast-pork-banh-mi/", { nIngs: 22, nSteps: 5 }], // Type: custom
		["https://www.bbcgoodfood.com/recipes/3-veg-mac-n-cheese", { nIngs: 9, nSteps: 4 }]
	] as const

	it.each(cases)("Should parse recipes of all kind", async (url, exp) => {
		const [recipe] = await parseFromUrl(url)

		expect(recipe.title?.length).toBeGreaterThan(0)
		expect(recipe.authors?.length).toBeGreaterThan(0)
		expect(recipe.ingredients.length).toBe(exp.nIngs)
		expect(recipe.steps.length).toBe(exp.nSteps)
	})
})