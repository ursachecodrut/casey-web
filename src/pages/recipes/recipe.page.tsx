import {
  AspectRatio,
  Container,
  HStack,
  Heading,
  Image,
  ListItem,
  OrderedList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchRecipe } from '../../api';
import { RecipeDto } from '../../dtos';

export const RecipePage = () => {
  const { id } = useParams();

  const { isLoading, data: recipe } = useQuery<RecipeDto, Error>({
    queryKey: ['recipe'],
    queryFn: () => fetchRecipe(id!),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container
      maxW="container.lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing="12">
        <Heading>{recipe?.title}</Heading>

        <AspectRatio>
          <Image
            src={recipe?.imageUrl}
            alt="Recipe Image"
            borderRadius="lg"
            objectFit="cover"
          />
        </AspectRatio>

        <Heading size="md">Description</Heading>
        <Text>{recipe?.description}</Text>

        <Heading size="md">Ingredients</Heading>
        <OrderedList>
          {recipe?.ingredients.map((ingredient) => (
            <ListItem key={ingredient.name}>
              <HStack>
                <Text fontSize="lg">{ingredient.name}</Text>
                <Text fontSize="lg">{ingredient.quantity}</Text>
                <Text fontSize="lg">{ingredient.unit}</Text>
              </HStack>
            </ListItem>
          ))}
        </OrderedList>

        <Heading size="md">Steps</Heading>
        <Stack spacing="3">
          {recipe?.steps.map((step) => (
            <Text key={step.description} fontSize="lg">
              {step.description}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};
