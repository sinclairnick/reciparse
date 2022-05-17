export type SchemaOrgImageObject = {
  "@type": "ImageObject";
  url: string;
  width: number;
  height: number;
};

export type SchemaOrgHowToStep =
  | {
      "@type": "HowToStep";
      text: string;
    }
  | {
      "@type": "HowToSection";
      name: string;
      itemListElement: Extract<SchemaOrgHowToStep, { "@type": "HowToStep" }>[];
    }
  | string;

export type SchemaOrgPerson = {
  "@type": "Person";
  name: string;
  image?: SchemaOrgImageObject;
  sameAs?: string;
};

export type SchemaOrgReview = {
  "@type": "Review";
  datePublished: string;
  reviewBody: string;
  reviewRating: {
    "@type": "Rating";
    worstRating: string;
    bestRating: string;
    ratingValue: number;
  };
  author: SchemaOrgPerson;
};

export interface SchemaOrgRecipe {
  "@context": string;
  "@type": "Recipe" | ["Recipe"];
  mainEntityOfPage?: string;
  articleBody?: string;
  headline?: string;
  alternativeHeadline?: string;
  name?: string;
  image?: SchemaOrgImageObject | SchemaOrgImageObject[];
  datePublished?: string;
  description?: string;
  prepTime?: `PT${number}M`;
  cookTime?: `PT${number}M`;
  totalTime?: `PT${number}M`;
  recipeYield?: string;
  recipeIngredient?: string[];
  recipeInstructions?: SchemaOrgHowToStep[];
  recipeCategory?: string[];
  author?: SchemaOrgPerson | SchemaOrgPerson[];
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    ratingCount: number;
    itemReviewed: string;
    bestRating: string;
    worstRating: string;
  };

  nutrition?: {
    "@type": "NutritionInformation";
    calories: "115.5 calories";
    carbohydrateContent: "8.9 g";
    cholesterolContent: "22.9 mg";
    fatContent: "8.8 g";
    fiberContent: "3.9 g";
    proteinContent: "2.3 g";
    saturatedFatContent: "5.5 g";
    servingSize: null;
    sodiumContent: "222.5 mg";
    sugarContent: "1.7 g";
    transFatContent: null;
    unsaturatedFatContent: null;
  };
  review?: SchemaOrgReview[];
}
