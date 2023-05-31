import {
  Box,
  Container,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Skeleton,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { fetchRecipes } from '../../api';
import { RecipeCard } from '../../components';
import { RecipeDto } from '../../dtos';

export const RecipesListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoading, data, error } = useQuery<RecipeDto[], Error>({
    queryKey: ['recipes'],
    queryFn: fetchRecipes,
  });

  if (isLoading) {
    return (
      <Container
        maxW="container.2xl"
        py={{ base: '10', md: '22' }}
        px={{ base: '0', sm: '8' }}
      >
        <Box my="4">
          <InputGroup borderRadius="5">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputRightAddon>Search</InputRightAddon>
          </InputGroup>
        </Box>

        <Wrap spacing="10">
          {Array.from({ length: 10 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <WrapItem key={i}>
              <Skeleton height="400px" width="300px" />
            </WrapItem>
          ))}
        </Wrap>
      </Container>
    );
  }

  if (error) {
    <div>Error</div>;
  }

  const filteredData = data?.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.2xl" px={{ base: '4', sm: '8' }}>
      <Box my="4">
        <InputGroup borderRadius="5">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputRightAddon>Search</InputRightAddon>
        </InputGroup>
      </Box>

      <Wrap spacing="10">
        {filteredData?.map((recipe) => (
          <WrapItem key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </WrapItem>
        ))}
      </Wrap>
    </Container>
  );
};
