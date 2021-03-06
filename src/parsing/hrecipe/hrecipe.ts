import {
  isNotNull,
  RECIPE_SCHEMA_URL,
  removeTabChars,
  replaceNewlines,
} from "../../common/constants";
import * as HTMLParser from "node-html-parser";
import {
  CascadingSelectorMap,
  EXHAUSTIVE_ITEM_PROP,
  HRECIPE_ITEM_PROP,
  HRECIPE_STANDARD,
  SelectorMap,
} from "./hrecipe.constants";
import {
  extractIngredientInfo,
  extractIngredientsFromRaw,
  extractYieldInfo,
  Recipe,
} from "../..";

const sanitiseText = (val?: string) => {
  if (val == null) {
    return;
  }
  let text = removeTabChars(val);
  text = replaceNewlines(text);
  return text.trim();
};

const valueExtractReducer = (acc: string[], x: HTMLParser.HTMLElement) => {
  const innerHtml = x.innerHTML.replace(/(\<br\>)/g, "∆"); // Change html to plain text
  const text = HTMLParser.parse(innerHtml).innerText;
  const sanitisedText = sanitiseText(text);
  const vals = sanitisedText?.split("∆").filter(isNotNull) ?? [];
  return [...acc, ...vals];
};

export type QuerySelectorFn = HTMLParser.HTMLElement["querySelector"];
export type QuerySelectorAllFn = HTMLParser.HTMLElement["querySelectorAll"];

const generateSelectorFromAttr = (val: { attr: string; value: string }) => {
  return `*[${val.attr}=${val.value}]`;
};

const getElementsByClassMap = (html: string, selectorMap: SelectorMap) => {
  const document = HTMLParser.parse(html);
  const recipeEl = document.querySelector(
    `${generateSelectorFromAttr(selectorMap.root)}`
  );

  if (recipeEl == null) {
    return;
  }

  const title =
    document.querySelector(generateSelectorFromAttr(selectorMap.title)) ??
    undefined;
  const ingredients =
    document.querySelectorAll(
      generateSelectorFromAttr(selectorMap.ingredients)
    ) ?? [];
  const authors =
    document.querySelectorAll(generateSelectorFromAttr(selectorMap.authors)) ??
    [];
  const steps =
    document.querySelectorAll(generateSelectorFromAttr(selectorMap.steps)) ??
    [];
  const yield_ =
    document.querySelector(generateSelectorFromAttr(selectorMap.yield)) ??
    undefined;

  return { title, ingredients, authors, steps, yield: yield_ };
};

const getElementsByCascadingClassMap = (
  html: string,
  selectorMap: CascadingSelectorMap
) => {
  const document = HTMLParser.parse(html);

  const recipes = selectorMap.root.map((root) => {
    const recipeEl = document.querySelector(
      `${generateSelectorFromAttr(root)}`
    );

    if (recipeEl == null) {
      return;
    }

    const title =
      selectorMap.title
        .map((attr) => recipeEl.querySelector(generateSelectorFromAttr(attr)))
        .find(isNotNull) ?? undefined;
    const ingredients =
      selectorMap.ingredients
        .map((attr) =>
          recipeEl.querySelectorAll(generateSelectorFromAttr(attr))
        )
        .find((x) => x.length > 0) ?? [];
    const steps =
      selectorMap.steps
        .map((attr) =>
          recipeEl.querySelectorAll(generateSelectorFromAttr(attr))
        )
        .find((x) => x.length > 0) ?? [];
    const authors =
      selectorMap.authors
        .map((attr) =>
          recipeEl.querySelectorAll(generateSelectorFromAttr(attr))
        )
        .find((x) => x.length > 0) ?? [];
    const yield_ =
      selectorMap.yield
        .map((attr) => recipeEl.querySelector(generateSelectorFromAttr(attr)))
        .find(isNotNull) ?? undefined;

    return { title, ingredients, authors, steps, yield: yield_ };
  });
  return recipes.find(isNotNull);
};

export const isElsEmpty = (els: ReturnType<typeof getElementsByClassMap>) => {
  if (els == null) {
    return true;
  }
  return (
    els.authors.length === 0 &&
    els.ingredients.length === 0 &&
    els.steps.length === 0 &&
    els.title === undefined &&
    els.yield === undefined
  );
};

const computeCompletenessScore = (
  els: ReturnType<typeof getElementsByClassMap>
) => {
  if (els == null) {
    return 0;
  }
  return (
    Number(els.title != null) +
    Number(els.yield != null) +
    Number(els.steps.length > 0) +
    Number(els.ingredients.length > 0) +
    Number(els.authors.length > 0)
  );
};

export const getElements = (html: string) => {
  const standardEls = getElementsByClassMap(html, HRECIPE_STANDARD);

  const itemPropEls = getElementsByClassMap(html, HRECIPE_ITEM_PROP);

  const cascadedEls = getElementsByCascadingClassMap(
    html,
    EXHAUSTIVE_ITEM_PROP
  );

  const standardScore = computeCompletenessScore(standardEls);
  const itemPropScore = computeCompletenessScore(itemPropEls);
  const cascadedScore = computeCompletenessScore(cascadedEls);

  const maxScore = Math.max(standardScore, itemPropScore, cascadedScore);
  if (standardScore === maxScore) {
    return standardEls;
  }
  if (itemPropScore === maxScore) {
    return itemPropEls;
  }
  return cascadedEls;
};

export const extractFromHRecipe = (html: string): Recipe | undefined => {
  const elements = getElements(html);

  if (elements == null || isElsEmpty(elements)) {
    return;
  }

  const titleRaw = elements.title?.innerText;
  const ingredientsRaw = elements.ingredients.reduce(valueExtractReducer, []);
  const stepsRaw = elements.steps.reduce(valueExtractReducer, []);
  const authorsRaw = elements.authors.reduce(valueExtractReducer, []);
  const yieldRaw = elements.yield?.innerText;

  const { amount, metric } = extractYieldInfo(yieldRaw);

  return {
    title: sanitiseText(titleRaw),
    ingredients: extractIngredientsFromRaw(ingredientsRaw),
    steps: stepsRaw.map((x) => ({ text: sanitiseText(x) })),
    authors: authorsRaw.map((x) => ({ name: sanitiseText(x) })),
    yield: amount,
    yieldMetric: sanitiseText(metric),
  };
};
