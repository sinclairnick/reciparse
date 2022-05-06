import * as HTMLParser from "node-html-parser";
import { isNotNull } from "../../common/constants";
import {
  extractIngredientInfo,
  extractIngredientsFromRaw,
  extractYieldInfo,
} from "../../common/extractors";
import { Ingredient, Recipe, Step } from "../../common/types";
import { SchemaOrgRecipe } from "./structured.types";

const isStructuredRecipe = (val: any): val is SchemaOrgRecipe => {
  const hasAtType = "@type" in val;
  if (!hasAtType) return false;
  const typeValue = val["@type"];

  if (typeof typeValue === "string") {
    return typeValue.toLowerCase() === "recipe";
  }

  if (Array.isArray(typeValue)) {
    return typeValue.includes("Recipe");
  }
  return false;
};

const extractAuthors = (
  authors: SchemaOrgRecipe["author"]
): Recipe["authors"] => {
  if (authors == null) {
    return [];
  }
  if (Array.isArray(authors)) {
    return authors.map((a) => ({ name: a.name }));
  }
  return [{ name: authors.name }];
};

const extractIngredients = (
  ingredients: SchemaOrgRecipe["recipeIngredient"]
): Ingredient[] => {
  if (!Array.isArray(ingredients)) return [];
  return extractIngredientsFromRaw(ingredients);
};

const extractStep = (
  step: NonNullable<SchemaOrgRecipe["recipeInstructions"]>[number]
): Step[] => {
  if (step["@type"] === "HowToStep") {
    return [{ text: step.text }];
  }
  return step.itemListElement.map((item) => ({
    group: step.name,
    text: item.text,
  }));
};

const extractSteps = (steps: SchemaOrgRecipe["recipeInstructions"]): Step[] => {
  if (Array.isArray(steps)) {
    return steps?.reduce((arr: Step[], step) => {
      return [...arr, ...extractStep(step)];
    }, []);
  }
  // When HTML
  if (typeof steps === "string") {
    const html = HTMLParser.parse(steps);
    const parent = html.childNodes.length > 1 ? html : html.childNodes[0];
    return parent?.childNodes.map((x) => ({ text: x.innerText }));
  }
  return [];
};

export const extractTime = (time?: string) => {
  if (time === undefined) {
    return;
  }
  const withoutAlpha = time.replace(/[A-Za-z]/g, "");
  const asNumber = Number(withoutAlpha);

  return isNaN(asNumber) ? undefined : asNumber;
};

export const extractTimes = (
  data: Pick<SchemaOrgRecipe, "cookTime" | "prepTime" | "totalTime">
): Pick<Recipe, "cookingTime" | "prepTime" | "totalTime"> => {
  return {
    cookingTime: extractTime(data.cookTime),
    prepTime: extractTime(data.prepTime),
    totalTime: extractTime(data.totalTime),
  };
};

const transformSchemaOrgRecipe = (data: SchemaOrgRecipe): Recipe => {
  const authors = extractAuthors(data.author);
  const ingredients = extractIngredients(data.recipeIngredient);
  const steps = extractSteps(data.recipeInstructions);
  const yieldResult = extractYieldInfo(data.recipeYield);
  const times = extractTimes(data);

  return {
    title: data.name,
    steps,
    authors,
    ingredients,
    yield: yieldResult.amount,
    yieldMetric: yieldResult.metric,
    cookingTime: times.cookingTime,
    prepTime: times.prepTime,
    totalTime: times.totalTime,
  };
};

export const extractFromStructuredData = (html: string): Recipe[] => {
  const document = HTMLParser.parse(html);
  const appScripts = document.querySelectorAll(
    "script[type='application/ld+json']"
  );
  const htmls = appScripts.map((el) => el.innerHTML).filter(isNotNull);

  const candidates: SchemaOrgRecipe[] = [];

  for (const html of htmls) {
    const data = JSON.parse(html);
    if (Array.isArray(data)) {
      const hrecipe = data.find(isStructuredRecipe);
      if (hrecipe != null) {
        candidates.push(hrecipe);
      }
      continue;
    }
    if ("@graph" in data) {
      const maybeRecipes = data["@graph"];
      for (const maybeRecipe of maybeRecipes) {
        if (isStructuredRecipe(maybeRecipe)) {
          candidates.push(maybeRecipe);
        }
      }
    }
    if (isStructuredRecipe(data)) {
      candidates.push(data);
    }
  }

  const recipes: Recipe[] = candidates.map(transformSchemaOrgRecipe);
  return recipes;
};
