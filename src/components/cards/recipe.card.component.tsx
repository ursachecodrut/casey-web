import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
  Image,
} from '@chakra-ui/react';
import { RecipeDto } from '../../dtos';

// type RecipeProps = RecipeDto;

export const RecipeCard = ({ recipe }: { recipe: RecipeDto }) => {
  const { title, description, imageUrl } = recipe;
  return (
    <Card maxW="sm" variant="elevated">
      <CardBody>
        <Image
          src={imageUrl}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{title}</Heading>
          <Text>{description.slice(0, 100)}...</Text>
          <Text color="blue.600" fontSize="2xl">
            $450
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue">
            Buy now
          </Button>
          <Button variant="ghost" colorScheme="blue">
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
