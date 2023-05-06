import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { RecipeFormValues } from '../schemas';

export const postRecipe = async (recipe: RecipeFormValues) => {
  await setDoc(doc(db, 'recipes', recipe.title), recipe);
};
