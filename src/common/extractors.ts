import parseIngredient from "parse-ingredient"

export const extractYieldInfo = (servings?: string) => {
	if (servings == null) {
		return { amount: undefined, metric: undefined }
	}
	const amountRes = /\d+(\/d+)?/.exec(servings)
	const _amount = amountRes?.[0]

	const metricRes = /[a-zA-Z]+/.exec(servings)
	const metric = metricRes?.[0]

	if (_amount == null) {
		return { amount: undefined, metric }
	}

	const nums = _amount.split("/").map(Number)

	const amount = nums.length === 2
		? (nums[0] / nums[1])
		: nums[0]

	return { amount, metric }
}

export const extractIngredientInfo = (ingredient: string) => {
	const sanitisedIngredient = ingredient.replace(" of ", " ")

	try {
		const [ing] = parseIngredient(sanitisedIngredient, { normalizeUOM: true })
		return {
			amount: ing.quantity ?? undefined,
			measure: ing.unitOfMeasure ?? undefined,
			name: ing.description ?? undefined
		}
	} catch (e) {
		throw new Error(`Failed to parse ingredient info (${ingredient})`)
	}
}