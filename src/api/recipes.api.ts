import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
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
        imageUrl: downloadURL,
        userId,
      };
      await setDoc(doc(db, 'recipes', recipe.title), newRecipe);
    }
  );
};
