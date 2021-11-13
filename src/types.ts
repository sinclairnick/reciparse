export type Image = {
	"@type": "ImageObject";
	url: string;
	width: number;
	height: number;
};

export type Instruction = {
	"@type": "HowToStep";
	text: string;
};

export type Author = {
	"@type": "Person";
	name: string;
	image?: Image;
	sameAs?: string;
};

export type Review = {
	"@type": "Review";
	datePublished: string;
	reviewBody: string;
	reviewRating: {
		"@type": "Rating";
		worstRating: string;
		bestRating: string;
		ratingValue: number;
	};
	author: Author;
};

export type HRecipe = {
	"@context": string;
	"@type": "Recipe";
	mainEntityOfPage: string;
	articleBody: string
	headline: string
	alternativeHeadline: string
	name: string;
	image: Image | Image[];
	datePublished: string;
	description: string;
	prepTime?: string;
	cookTime?: string;
	totalTime?: string;
	recipeYield?: string;
	recipeIngredient?: string[];
	recipeInstructions?: Instruction[];
	recipeCategory?: string[];
	author?: Author | Author[];
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
	review?: Review[];
};