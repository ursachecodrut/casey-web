import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Heading,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { deleteReview } from '../../api';
import { DeleteReviewDto, RecipeDto, ReviewDto } from '../../dtos';

interface ReviewCardProps {
  review: ReviewDto;
  recipeId: string;
  currentUserId?: string | undefined;
}

export const ReviewCard = ({
  review,
  recipeId,
  currentUserId = undefined,
}: ReviewCardProps) => {
  const { title, description } = review;
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['deleteReview'],
    mutationFn: (dto: DeleteReviewDto) => deleteReview(dto),
    onSuccess: () => {
      queryClient.setQueryData<RecipeDto>(
        ['recipes', recipeId],
        (prevRecipe?: RecipeDto) => {
          if (prevRecipe) {
            return {
              ...prevRecipe,
              reviews: prevRecipe.reviews.filter((r) => r.id !== review.id),
            };
          }
          return prevRecipe;
        }
      );
      toast({
        title: 'Review deleted',
        description: 'Your review has been deleted',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Could not delete review',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDeleteReview = async () => {
    await mutateAsync({
      recipeId,
      reviewId: review.id,
    });
  };

  return (
    <Stack>
      <Box boxShadow="base" p="4" flex="1">
        <Stack>
          <HStack justifyContent="space-between">
            <Heading size="md">{title}</Heading>
            <Text fontSize="lg" color="gray">
              {format(review.updatedAt.toDate(), 'dd/MM/yyyy HH:mm')}
            </Text>
          </HStack>
          <Text fontSize="lg">{description}</Text>
        </Stack>
      </Box>
      {review.userId === currentUserId && (
        <Button
          colorScheme="red"
          isLoading={isLoading}
          onClick={handleDeleteReview}
        >
          <DeleteIcon />
        </Button>
      )}
    </Stack>
  );
};
