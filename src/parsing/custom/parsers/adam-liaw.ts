import { Author, extractIngredientInfo, Ingredient, Step } from "../../..";
import { createParser } from "../parsers.type";
import * as HTMLParser from "node-html-parser"

export const AdamLiaw = createParser({
	domain: "adamliaw.com",
	parse: (html: string) => {
		const document = HTMLParser.parse(html)

		const recipeEl = document.querySelector(".post-content")

		if (recipeEl === null) {
			return
		}
		const title = document.querySelector(".post-title")?.innerText

		const authors: Author[] = [{ name: "Adam Liaw" }]

		const childrenText = recipeEl.childNodes
			.filter(x => {
				if (x instanceof HTMLParser.HTMLElement) {
					const tag = x.tagName
					// H4 tags are ingredient groups, obscuring other content
					return tag !== "H4"
				}
				return false
			})
			.map(x => x.innerText.trim())
			.filter(x => x !== "")


		const idxOfIngredients = childrenText.findIndex(x => x.toLowerCase() === "ingredients")
		const idxOfMethod = childrenText.findIndex(x => x.toLowerCase() === "method")

		const _ingredients = childrenText.slice(idxOfIngredients + 1, idxOfMethod)
		const _steps = childrenText.slice(idxOfMethod + 1)

		const ingredients: Ingredient[] = _ingredients.map(extractIngredientInfo)
		const steps: Step[] = _steps.map(s => ({ text: s }))

		return {
			ingredients,
			steps,
			title,
			authors
		}
	}
})