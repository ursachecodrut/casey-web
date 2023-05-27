import { Timestamp, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { IngredientDto } from '../dtos';
import { db } from '../firebase/firebase';
import { ShoppingDto, ShoppingListDto } from '../dtos/shopping-lists.dto';

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
    id: uuid(),
  }));

  const newCurrent: ShoppingListDto = {
    ingredients: [...shopping.current.ingredients, ...newIngredients],
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
