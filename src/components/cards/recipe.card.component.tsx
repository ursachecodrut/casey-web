import {
  AspectRatio,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { RecipeDto } from '../../dtos';

export const RecipeCard = ({ recipe }: { recipe: RecipeDto }) => {
  const { title, description, imageUrl } = recipe;
  const navigate = useNavigate();

  return (
    <Card maxW="sm" variant="elevated">
      <CardBody>
        <AspectRatio>
          <Image
            src={imageUrl}
            alt="Recipe Image"
            borderRadius="lg"
            objectFit="cover"
          />
        </AspectRatio>
        <Stack mt="6" spacing="3">
          <Heading size="md">{title}</Heading>
          <Text>{description.slice(0, 100)}...</Text>
          <HStack justify="space-between">
            <Text fontSize="md" fontWeight="bold">
              Total time: {recipe.time}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Rating: 4.5 / 5
            </Text>
          </HStack>
          <Button
            colorScheme="purple"
            onClick={() => navigate(`/recipes/${recipe.id}`)}
          >
            View
          </Button>
        </Stack>
      </CardBody>
    </Card>
  );
};
