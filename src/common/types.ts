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
  prepTime?: number;
  cookingTime?: number;
  totalTime?: number;
  yieldMetric?: string;
  ingredients: Ingredient[];
  steps: Step[];
};
