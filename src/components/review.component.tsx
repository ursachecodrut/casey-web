import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { addReview } from '../api';
import { AddReviewDto } from '../dtos';
import { useAuth } from '../hooks';
import { ReviewSchema, ReviewSchemaValues } from '../schemas';

interface Props {
  recipeId: string;
}

export const ReviewComponent = ({ recipeId }: Props) => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewSchemaValues>({
    resolver: zodResolver(ReviewSchema),
  });

  const { mutateAsync: mutateAddReview } = useMutation({
    mutationKey: ['addReview', recipeId],
    mutationFn: (dto: AddReviewDto) => addReview(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes', recipeId]);
      toast({
        title: 'Review added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Could not add review',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const onAddReview: SubmitHandler<ReviewSchemaValues> = async (data) => {
    const { title, description } = data;

    await mutateAddReview({
      title,
      description,
      recipeId,
      userId: currentUser!.uid!,
    });
  };

  return (
    <Box maxW="lg" as="form" onSubmit={handleSubmit(onAddReview)}>
      <Stack spacing="4">
        <Heading size="md">Add a review</Heading>

        <VStack spacing="4">
          <FormControl isInvalid={Boolean(errors.title)}>
            <FormLabel>Title</FormLabel>
            <Input
              id="review-title"
              placeholder="Title..."
              {...register('title')}
            />
            <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={Boolean(errors.description)}>
            <FormLabel>Description</FormLabel>
            <Textarea
              id="review-description"
              placeholder="Description..."
              rows={7}
              {...register('description')}
            />
            <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
          </FormControl>

          <Button type="submit" isLoading={isSubmitting}>
            Add Review
          </Button>
        </VStack>
      </Stack>
    </Box>
  );
};
