/* eslint-disable @typescript-eslint/return-await */
import { Container, Wrap, WrapItem } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchRecipes } from '../../api';
import { RecipeCard } from '../../components';
import { RecipeDto } from '../../dtos';

export const RecipesListPage = () => {
  const { isLoading, data, error } = useQuery<RecipeDto[], Error>({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <Container
      maxW="container.2xl"
      py={{ base: '10', md: '22' }}
      px={{ base: '0', sm: '8' }}
    >
      <Wrap spacing="10">
        {data?.map((recipe) => (
          <WrapItem key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </WrapItem>
        ))}
      </Wrap>
    </Container>
  );
};
