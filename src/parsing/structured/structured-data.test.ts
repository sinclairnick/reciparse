import { extractFromStructuredData } from "./structured-data";
import axios from "axios";

const structuredRecipes = [
  [
    "Epicurious",
    "https://www.epicurious.com/recipes/food/views/hasselback-butternut-squash-with-bay-leaves",
  ],
  [
    "AllRcipes",
    "https://www.allrecipes.com/recipe/230103/buttery-garlic-green-beans/",
  ],
  ["BBC", "https://www.bbcgoodfood.com/recipes/chilli-con-carne-recipe"],
  [
    "BBC 2",
    "https://www.bbcgoodfood.com/recipes/chicken-kale-mushroom-pot-pie",
  ],
  ["BBC 3", "https://www.bbcgoodfood.com/recipes/3-veg-mac-n-cheese"],
  ["Cafe delites", "https://cafedelites.com/butter-chicken/"],
  ["Natashas kitchen", "https://natashaskitchen.com/perfect-burger-recipe/"],
  [
    "Jamie Oliver",
    "https://www.jamieoliver.com/recipes/chicken-recipes/chicken-tikka-masala/",
  ],
  [
    "Delish",
    "https://www.delish.com/cooking/recipe-ideas/a28848480/beef-ragu-recipe/",
  ],
  [
    "Spruce eats",
    "https://www.thespruceeats.com/braised-pork-belly-recipe-1135629",
  ],
  [
    "Ethan Chlebowski",
    "https://www.ethanchlebowski.com/cooking-techniques-recipes/fiery-carbonara",
  ],
];

/** Just using these to smoke test, they are imperfectly represented in structured form on their side */
// const problematicRecipes: [string, string][] = []

describe("Structured data", () => {
  it.each(structuredRecipes)(
    "Parses and transforms recipes with structured data (%s)",
    async (name, url) => {
      const res = await axios.get(url);
      const html = res.data;
      const [first] = extractFromStructuredData(html);

      expect(first.title).toBeDefined();
      expect(first.ingredients.length).toBeGreaterThan(0);
      expect(first.ingredients.some((x) => /\<.*\>/.test(x.name ?? ""))).toBe(
        false
      );
      expect(first.steps.length).toBeGreaterThan(0);
    }
  );

  // it.each(problematicRecipes)("Does not error for problematic recipes (%s)", async (name, url) => {
  // 	const res = await axios.get(url)
  // 	const html = res.data
  // 	const [first] = extractFromStructuredData(html)

  // 	console.log(first)
  // })
});
