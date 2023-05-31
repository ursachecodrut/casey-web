import {
  Box,
  Container,
  Heading,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ShoppingDto } from '../../dtos';
import { fetchShopping } from '../../api';
import { useAuth } from '../../hooks';

export const HistoryListsPage = () => {
  const { currentUser } = useAuth();

  const {
    data: shopping,
    isLoading,
    isError,
  } = useQuery<ShoppingDto, Error>({
    queryKey: ['shopping', currentUser?.uid],
    queryFn: () => fetchShopping(currentUser?.uid),
  });

  if (isLoading) {
    return (
      <Container py="4">
        <SkeletonText
          my="5"
          noOfLines={1}
          skeletonHeight="8"
          spacing="4"
          width="200px"
        />

        <Stack spacing={4}>
          {Array.from({ length: 4 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Box key={i} shadow="base" p="4">
              <SkeletonText noOfLines={6} spacing="4" />
            </Box>
          ))}
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <Container maxW="lg">
      <Heading>History Lists</Heading>

      {shopping.history.length === 0 && (
        <Box mt="3">
          <Heading size="md">No history lists</Heading>
        </Box>
      )}

      <Stack spacing="4" py="4">
        {shopping.history.map((list) => (
          <Box key={JSON.stringify(list)} shadow="base" p="4">
            <Heading size="sm">
              {format(list.updatedAt.toDate(), 'dd/MM/yyyy HH:mm')}
            </Heading>

            <Stack spacing="2" mt="2">
              {list.ingredients.map((item) => {
                const { name, quantity, unit } = item;

                return (
                  <Box key={name}>
                    <Text size="xs" color="gray.600">
                      {name} - {quantity} {unit}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Container>
  );
};
