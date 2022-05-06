import {
  extractIngredientInfo,
  extractIngredientsFromRaw,
  extractYieldInfo,
} from "./extractors";
import { Ingredient } from "./types";

describe("Extractors", () => {
  describe("Extract yield", () => {
    const tests = [
      ["4 servings", [4, "servings"]],
      ["3 muffins", [3, "muffins"]],
      ["2 litres", [2, "litres"]],
    ] as const;

    it.each(tests)(
      "Should seperate yield info (%s)",
      (input, [expAmount, expMetric]) => {
        const res = extractYieldInfo(input);

        expect(res.amount).toBe(expAmount);
        expect(res.metric).toBe(expMetric);
      }
    );
  });

  describe("Extract ingredient", () => {
    const ingredients = [
      ["4 cups white flour", [4, "cup", "white flour"]],
      ["2 cloves garlic", [2, undefined, "cloves garlic"]],
      ["1 kg tuna", [1, "kilogram", "tuna"]],
      ["2 eggs", [2, undefined, "eggs"]],
      ["2/3 cup sugar", [2 / 3, "cup", "sugar"]],
    ] as const;

    it.each(ingredients)(
      "Parse ingredients (%s)",
      (input, [expAmount, expMeasure, expName]) => {
        const extracted = extractIngredientInfo(input);
        if (extracted.type === "group") {
          fail("Extracted type is group");
        }

        expect(extracted.value.amount?.toPrecision(3)).toBe(
          expAmount.toPrecision(3)
        );
        expect(extracted.value.measure).toBe(expMeasure);
        expect(extracted.value.name).toBe(expName);
      }
    );

    const groups = ["For braised pork:", "For sauce", "Icing:"];
    it.each(groups)("Parse group from ingredient (%s)", (input) => {
      const extracted = extractIngredientInfo(input);

      if (extracted.type === "ingredient") {
        fail("Extracted type is ingredient");
      }

      expect(extracted.value).toBe(input);
    });
  });

  describe("Extract many ingredients with groups", () => {
    const inputs: string[] = [
      "4 cups white flour",
      "For sauce",
      "Salt",
      "Milk",
    ];
    const expected: Ingredient[] = [
      { name: "white flour", amount: 4, measure: "cup", group: undefined },
      {
        name: "Salt",
        amount: undefined,
        measure: undefined,
        group: "For sauce",
      },
      {
        name: "Milk",
        amount: undefined,
        measure: undefined,
        group: "For sauce",
      },
    ];
    const ingredients = extractIngredientsFromRaw(inputs);

    expect(ingredients).toEqual(expected);
  });
});
