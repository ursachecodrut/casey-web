import {
  AspectRatio,
  Button,
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Stack,
  Tag,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { RecipeDto, Tag as RecipeTag } from '../../dtos';

const tagsMapColor = new Map<RecipeTag, string>([
  [RecipeTag.None, 'gray'],
  [RecipeTag.Vegan, 'green'],
  [RecipeTag.Vegetarian, 'teal'],
  [RecipeTag.GlutenFree, 'yellow'],
  [RecipeTag.HighProtein, 'red'],
]);

export const RecipeCard = ({ recipe }: { recipe: RecipeDto }) => {
  const { title, description, imageUrl } = recipe;
  const navigate = useNavigate();

  return (
    <Card maxW="sm" variant="filled">
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

          <HStack>
            <Tag variant="solid" colorScheme={tagsMapColor.get(recipe.tag)}>
              {recipe.tag}
            </Tag>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="md" fontWeight="bold">
              Total time: {recipe.time}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              Reviews: {recipe.reviews.length}
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
