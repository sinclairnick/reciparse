import axios from "axios"
import { URL } from "url"
import { parseWithCustom } from "."


describe("Parsers", () => {
	const cases = [
		["https://adamliaw.com/recipe/roast-pork-banh-mi/", { nIngs: 22, nSteps: 5 }]
	] as const

	it.each(cases)("Returns the recipe", async (url, exp) => {
		const res = await axios.get(url)
		const html = res.data

		const domain = new URL(url).host

		const recipe = await parseWithCustom(html, domain as any)


		expect(recipe?.title?.length).toBeGreaterThan(0)
		expect(recipe?.authors.length).toBeGreaterThan(0)
		expect(recipe?.ingredients.length).toBe(exp.nIngs)
		expect(recipe?.steps.length).toBe(exp.nSteps)
	})
})