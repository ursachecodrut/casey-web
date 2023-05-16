import {
  AspectRatio,
  Box,
  Container,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { fetchRecipe } from '../../api';
import { ReviewComponent } from '../../components/review.component';
import { RecipeDto, ReviewDto } from '../../dtos';

export const ReviewCard = ({ review }: { review: ReviewDto }) => {
  const { title, description } = review;

  return (
    <Box boxShadow="base" p="4">
      <Stack>
        <HStack justifyContent="space-between">
          <Heading size="md">{title}</Heading>
          <Text fontSize="lg" colorScheme="gray">
            {format(review.updatedAt.toDate(), 'dd/MM/yyyy')}
          </Text>
        </HStack>
        <Text fontSize="lg">{description}</Text>
      </Stack>
    </Box>
  );
};

export const RecipePage = () => {
  const { id: recipeId } = useParams();

  const { isLoading, data: recipe } = useQuery<RecipeDto, Error>({
    queryKey: ['recipes', recipeId],
    queryFn: () => fetchRecipe(recipeId),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

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

        <ReviewComponent recipeId={recipe.id} />

        <Heading size="md">Reviews</Heading>

        {recipe.reviews.length === 0 ? (
          <Text>No reviews yet</Text>
        ) : (
          <Stack spacing="8">
            {recipe.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
};
