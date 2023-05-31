import { Timestamp } from 'firebase/firestore';

export interface RecipeDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: string;
  tag: Tag;
  imageUrl: string;
  ingredients: IngredientDto[];
  steps: StepDto[];
  reviews: ReviewDto[];
}

export enum Tag {
  None = 'none',
  Quick = 'quick',
  Vegan = 'vegan',
  Vegetarian = 'vegetarian',
  GlutenFree = 'gluten-free',
  HighProtein = 'high-protein',
}

export interface IngredientDto {
  name: string;
  quantity: number;
  unit: string;
}

export interface StepDto {
  description: string;
}

export interface ReviewDto {
  id: string;
  userId: string;
  updatedAt: Timestamp;
  title: string;
  description: string;
}
