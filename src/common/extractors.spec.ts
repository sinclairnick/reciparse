import { extractIngredientInfo, extractYieldInfo } from "./extractors";


describe("Extractors", () => {

	describe("Extract yield", () => {
		const tests = [
			["4 servings", [4, "servings"]],
			["3 muffins", [3, "muffins"]],
			["2 litres", [2, "litres"]]
		] as const

		it.each(tests)('Should seperate yield info (%s)', (input, [expAmount, expMetric]) => {
			const res = extractYieldInfo(input);

			expect(res.amount).toBe(expAmount);
			expect(res.metric).toBe(expMetric);
		});
	})

	describe("Extract ingredient", () => {
		const tests = [
			["4 cups white flour", [4, "cup", "white flour"]],
			["2 cloves garlic", [2, undefined, "cloves garlic"]],
			["1 kg tuna", [1, "kilogram", "tuna"]],
			["2 eggs", [2, undefined, "eggs"]],
			["2/3 cup sugar", [2/3, "cup", "sugar"]]
		] as const

		it.each(tests)("Parse ingredients (%s)", (input, [expAmount, expMeasure, expName]) => {
			const res = extractIngredientInfo(input)

			expect(res.amount?.toPrecision(3)).toBe(expAmount.toPrecision(3))
			expect(res.measure).toBe(expMeasure)
			expect(res.name).toBe(expName)
		})
	})

})