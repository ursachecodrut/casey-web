import {
  AspectRatio,
  Button,
  Container,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchRecipe } from '../../api';
import { addIngredientsToShoppingList } from '../../api/shopping.api';
import { ReviewCard } from '../../components/cards/review.card.component';
import { ReviewComponent } from '../../components/review.component';
import { RecipeDto, ReviewDto } from '../../dtos';
import { useAuth } from '../../hooks';
import { partition } from '../../utils';

export const RecipePage = () => {
  const { id: recipeId } = useParams();
  const { currentUser } = useAuth();
  const toast = useToast();

  const { isLoading, data: recipe } = useQuery<RecipeDto, Error>({
    queryKey: ['recipes', recipeId],
    queryFn: () => fetchRecipe(recipeId),
  });

  const { mutate, isLoading: isLoadingAddIngredients } = useMutation({
    mutationFn: () =>
      addIngredientsToShoppingList(recipe?.ingredients, currentUser?.uid),
    onSuccess: () => {
      toast({
        title: 'Ingredients added to shopping list',
        status: 'success',
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Something went wrong',
        description: error.message,
        status: 'error',
        isClosable: true,
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const [personalReivews, odersReviews] = partition(
    recipe.reviews,
    (r: ReviewDto) => r.userId === currentUser?.uid
  );

  return (
    <Container
      maxW="container.lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing="12">
        <Heading>{recipe.title}</Heading>

        <AspectRatio maxW="400px">
          <Image
            src={recipe.imageUrl}
            alt="Recipe Image"
            borderRadius="lg"
            objectFit="cover"
          />
        </AspectRatio>

        <Heading size="md">Description</Heading>
        <Text>{recipe.description}</Text>

        <Heading size="md">Ingredients</Heading>
        <Stack spacing="3">
          {recipe.ingredients.map((ingredient) => (
            <HStack key={ingredient.name}>
              <Text fontSize="lg">{ingredient.name}</Text>
              <Text fontSize="lg">{ingredient.quantity}</Text>
              <Text fontSize="lg">{ingredient.unit}</Text>
            </HStack>
          ))}
        </Stack>

        <Heading size="md">Steps</Heading>
        <Stack spacing="3">
          {recipe?.steps.map((step) => (
            <Text key={step.description} fontSize="lg">
              {step.description}
            </Text>
          ))}
        </Stack>

        <Stack spacing="3">
          <Heading size="md">Want to cook this recipe?</Heading>
          <HStack>
            <Button
              colorScheme="purple"
              isLoading={isLoadingAddIngredients}
              onClick={() => mutate()}
            >
              Add to shopping list
            </Button>
          </HStack>
        </Stack>

        {currentUser && <ReviewComponent recipeId={recipe.id} />}

        <Heading size="md">Reviews</Heading>

        {recipe.reviews.length === 0 ? (
          <Text>No reviews yet</Text>
        ) : (
          <>
            <Stack spacing="8">
              {personalReivews
                .sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis())
                .map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    recipeId={recipe.id}
                    currentUserId={currentUser?.uid}
                  />
                ))}
            </Stack>
            <Stack spacing="8">
              {odersReviews
                .sort((a, b) => b.updatedAt.toMillis() - a.updatedAt.toMillis())
                .map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    recipeId={recipe.id}
                    currentUserId=""
                  />
                ))}
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  );
};
