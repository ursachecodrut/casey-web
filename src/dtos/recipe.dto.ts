import { Timestamp } from 'firebase/firestore';

export interface RecipeDto {
  id: string;
  userId: string;
  title: string;
  description: string;
  time: string;
  imageUrl: string;
  ingredients: IngredientDto[];
  steps: StepDto[];
  reviews: ReviewDto[];
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
