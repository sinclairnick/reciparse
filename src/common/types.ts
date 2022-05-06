export type Author = {
  name?: string;
};

export type Ingredient = {
  name?: string;
  amount?: number;
  measure?: string;
  group?: string;
};

export type Step = {
  text?: string;
  group?: string;
};

export type Recipe = {
  authors: Author[];
  title?: string;
  yield?: number;
  prepTime?: string;
  cookingTime?: string;
  totalTime?: string;
  yieldMetric?: string;
  ingredients: Ingredient[];
  steps: Step[];
};
