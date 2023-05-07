import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  CardFooter,
  Text,
  Image,
  Stack,
  Heading,
  Button,
  Divider,
  SimpleGrid,
  HStack,
  Tag,
} from '@chakra-ui/react';

interface Props {
  title: string;
  description: string;
  time: number;
  rating: number;
  image: string;
}

export const RecipeCard = ({
  title,
  description,
  time,
  rating,
  image,
}: Props) => {
  return (
    <Card maxW="sm">
      <CardBody>
        <Image src={image} alt={title} borderRadius="lg" />
        <Stack mt="6" spacing="3">
          <Heading size="md">{title}</Heading>
          <Text>{description}</Text>
          <SimpleGrid columns={2} spacing={10}>
            <Text as="b">Total time: {time} min</Text>
            <Text as="b">Rating: {rating}/5.0</Text>
          </SimpleGrid>
          <HStack>
            <Tag colorScheme="red">meat</Tag>
            <Tag colorScheme="orange">gluten-free</Tag>
            <Tag colorScheme="teal">quick</Tag>
          </HStack>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Button
          variant="solid"
          colorScheme="teal"
          rightIcon={<ArrowForwardIcon />}
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
