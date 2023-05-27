import { Timestamp } from 'firebase/firestore';
import { IngredientDto } from './recipe.dto';

export interface ShoppingDto {
  current: ShoppingListDto;
  history: ShoppingListDto[];
}

export interface ShoppingListDto {
  ingredients: ShoppingListItemDto[];
  updatedAt: Timestamp;
}

export type ShoppingListItemDto = IngredientDto & {
  checked: boolean;
};
