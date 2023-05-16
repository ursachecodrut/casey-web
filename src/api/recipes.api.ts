import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { AddReviewDto, RecipeDto, ReviewDto } from '../dtos';
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
      console.error(error);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      const newRecipe: RecipeDto = {
        ...recipe,
        id: uuidv4(),
        imageUrl: downloadURL,
        userId,
        reviews: [],
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

export const fetchRecipe = async (id: string | undefined) => {
  if (!id) {
    throw new Error('No id provided!');
  }

  const recipeRef = doc(db, 'recipes', id);
  const recipeSnap = await getDoc(recipeRef);

  if (!recipeSnap.exists()) {
    throw new Error('No such recipe!');
  }

  return recipeSnap.data() as RecipeDto;
};

export const addReview = async (dto: AddReviewDto) => {
  const { userId, recipeId, ...review } = dto;

  const recipeRef = doc(db, 'recipes', recipeId);

  const recipeSnap = await getDoc(recipeRef);

  if (!recipeSnap.exists()) {
    throw new Error('Recipe does not exist!');
  }

  const recipe = recipeSnap.data() as RecipeDto;

  const newReview: ReviewDto = {
    ...review,
    id: uuidv4(),
    userId,
    updatedAt: Timestamp.fromDate(new Date()),
  };

  recipe.reviews.push(newReview);

  await updateDoc(recipeRef, {
    reviews: recipe.reviews,
  });
};
