/* eslint-disable @typescript-eslint/return-await */
import { Wrap, WrapItem } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchRecipes } from '../../api';
import { RecipeCard } from '../../components';
import { RecipeDto } from '../../dtos';

export const RecipesListPage = () => {
  const { isLoading, data, error } = useQuery<RecipeDto[], Error>(
    ['recipes'],
    fetchRecipes
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Wrap>
      {data?.map((recipe) => (
        <WrapItem key={recipe.title}>
          <RecipeCard recipe={recipe} />
        </WrapItem>
      ))}
    </Wrap>
  );
};
