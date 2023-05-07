import { HStack, Stack } from '@chakra-ui/react';
import { RecipeCard } from '../components';

export const RecipeListPage = () => {
  return (
    <Stack>
      <HStack>
        <RecipeCard
          title="Cobb Salad"
          description="To make the *perfect* Cobb salad, you MUST use homemade dressing.
            And it's so easy, there's really no excuse. Just throw
            some red wine vinegar, Dijon mustard, and olive oil into a mason jar
            and shake it out."
          time={30}
          rating={4.8}
          image="https://hips.hearstapps.com/del.h-cdn.co/assets/18/11/1600x1200/sd-aspect-1520887294-cobb-salad-delish.jpg?resize=1200:*"
        />

        <RecipeCard
          title="Cobb Salad"
          description="To make the *perfect* Cobb salad, you MUST use homemade dressing.
            And it's so easy, there's really no excuse. Just throw
            some red wine vinegar, Dijon mustard, and olive oil into a mason jar
            and shake it out."
          time={30}
          rating={4.8}
          image="https://hips.hearstapps.com/del.h-cdn.co/assets/18/11/1600x1200/sd-aspect-1520887294-cobb-salad-delish.jpg?resize=1200:*"
        />
      </HStack>
    </Stack>
  );
};
