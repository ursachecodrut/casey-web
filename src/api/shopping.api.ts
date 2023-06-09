import { Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { IngredientDto } from '../dtos';
import { db } from '../firebase/firebase';
import {
  ShoppingDto,
  ShoppingListDto,
  ShoppingListItemDto,
} from '../dtos/shopping-lists.dto';

export const addIngredientsToShoppingList = async (
  ingredients: IngredientDto[] | undefined,
  userId: string | undefined
) => {
  if (!ingredients || !userId) {
    throw new Error('No ingredients or userId provided!');
  }

  const shoppingRef = doc(db, 'shopping', userId);

  const shoppingSnap = await getDoc(shoppingRef);

  if (!shoppingSnap.exists()) {
    throw new Error('No such shopping list!');
  }

  const shopping = shoppingSnap.data() as ShoppingDto;

  const newIngredients = ingredients.map((ingredient) => ({
    ...ingredient,
    checked: false,
  }));

  const newCurrent: ShoppingListDto = {
    ingredients: [...shopping.current.ingredients, ...newIngredients],
    updatedAt: Timestamp.fromDate(new Date()),
  };

  await updateDoc(shoppingRef, {
    current: newCurrent,
  });
};

export const updateShoppingList = async (
  userId: string | undefined,
  items: ShoppingListItemDto[]
) => {
  if (!userId) {
    throw new Error('No user id');
  }

  const shoppingRef = doc(db, 'shopping', userId);

  const shoppingSnap = await getDoc(shoppingRef);

  if (!shoppingSnap.exists()) {
    throw new Error('No such shopping list!');
  }

  const newCurrent: ShoppingListDto = {
    ingredients: items,
    updatedAt: Timestamp.fromDate(new Date()),
  };

  await updateDoc(shoppingRef, {
    current: newCurrent,
  });
};

export const fetchShopping = async (userId: string | undefined) => {
  if (!userId) {
    throw new Error('No user id');
  }

  const shoppingRef = doc(db, 'shopping', userId);

  const shoppingSnap = await getDoc(shoppingRef);

  if (!shoppingSnap.exists()) {
    throw new Error('No such shopping list!');
  }

  return shoppingSnap.data() as ShoppingDto;
};

export const addListToHistory = async (
  userId: string | undefined,
  list: ShoppingListDto
) => {
  if (!userId) {
    throw new Error('No user id');
  }

  const shoppingRef = doc(db, 'shopping', userId);

  const shoppingSnap = await getDoc(shoppingRef);

  if (!shoppingSnap.exists()) {
    throw new Error('No such shopping list!');
  }

  const shopping = shoppingSnap.data() as ShoppingDto;

  const checkedIngredients = list.ingredients.filter((i) => i.checked);

  const newList: ShoppingListDto = {
    updatedAt: list.updatedAt,
    ingredients: checkedIngredients,
  };

  const newHistory = [...shopping.history, newList];

  await updateDoc(shoppingRef, {
    history: newHistory,
    current: {
      ingredients: [],
      updatedAt: Timestamp.fromDate(new Date()),
    },
  });
};
