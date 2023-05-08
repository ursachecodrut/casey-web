export interface RecipeDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: string;
  imageUrl: string;
  ingredients: IngredientDto[];
  steps: StepDto[];
}

export interface IngredientDto {
  name: string;
  quantity: number;
  unit: string;
}

export interface StepDto {
  description: string;
}
