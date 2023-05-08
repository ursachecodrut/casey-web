import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { RecipeDto } from '../dtos';
import { db, storage } from '../firebase/firebase';
import { RecipeFormValues } from '../schemas';

export const postRecipe = async (data: RecipeFormValues, userId: string) => {
  const { files, ...recipe } = data;
  const image = files[0];

  const storageRef = ref(storage, `recipes/${image.name}`);
  const uploadTask = uploadBytesResumable(storageRef, image);

  uploadTask.on(
    'state_changed',
    () => {},
    (error) => {
      console.log(error);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      const newRecipe: RecipeDto = {
        ...recipe,
        id: uuidv4(),
        imageUrl: downloadURL,
        userId,
      };
      await setDoc(doc(db, 'recipes', newRecipe.id), newRecipe);
    }
  );
};

export const fetchRecipes = async () => {
  const querySnapshot = await getDocs(collection(db, 'recipes'));
  const recipes = querySnapshot.docs.map(
    (recipeDoc) => recipeDoc.data() as RecipeDto
  );
  return recipes;
};

export const fetchRecipe = async (id: string) => {
  const recipeRef = doc(db, 'recipes', id);
  const recipeSnap = await getDoc(recipeRef);

  if (!recipeSnap.exists()) {
    throw new Error('No such recipe!');
  }

  return recipeSnap.data() as RecipeDto;
};
