/* eslint-disable react/no-children-prop */
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { postRecipe } from '../api/recipes.api';
import { useAuth } from '../hooks';
import { RecipeFormValues, RecipeSchema } from '../schemas';

export const AddRecipePage = () => {
  const { currentUser } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(RecipeSchema),
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray<RecipeFormValues>({
    control,
    name: 'steps',
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray<RecipeFormValues>({
    name: 'ingredients',
    control,
  });

  const { mutateAsync } = useMutation({
    mutationKey: ['addRecipe'],
    mutationFn: ({
      data,
      userId,
    }: {
      data: RecipeFormValues;
      userId: string;
    }) => postRecipe(data, userId),
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (data: RecipeFormValues) => {
    try {
      await mutateAsync({
        data,
        userId: currentUser?.uid as string,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing="8">
        <Heading>Post a new Recipe</Heading>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing="8">
            <FormControl isInvalid={Boolean(errors.title)}>
              <FormLabel fontSize="lg">Recipe Title</FormLabel>
              <Input
                type="text"
                placeholder="Enter a title for your recipe"
                {...register('title')}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.description)}>
              <FormLabel fontSize="lg">Description</FormLabel>
              <Textarea
                size="md"
                placeholder="Enter a main description for your recipe"
                {...register('description')}
              />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.files)}>
              <FormLabel fontSize="lg">Recipe Image</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<AddIcon />} />
                <Input
                  type="file"
                  multiple={false}
                  accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                  placeholder="Upload an image for your recipe"
                  {...register('files')}
                />
              </InputGroup>
              <FormErrorMessage>{errors.files?.message}</FormErrorMessage>
            </FormControl>

            <Text fontSize="lg">Recipe Ingredients</Text>
            <Stack spacing="6">
              {ingredientFields.map((ingredient, index) => (
                <FormControl key={ingredient.id}>
                  <HStack>
                    <FormControl
                      isInvalid={Boolean(errors.ingredients?.[index]?.name)}
                    >
                      <Input
                        placeholder="Ing..."
                        {...register(`ingredients.${index}.name` as const)}
                      />
                      <FormErrorMessage>
                        {errors.ingredients?.[index]?.name?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={Boolean(errors.ingredients?.[index]?.quantity)}
                    >
                      <Input
                        placeholder="Qty..."
                        type="number"
                        {...register(`ingredients.${index}.quantity` as const, {
                          valueAsNumber: true,
                        })}
                      />
                      <FormErrorMessage>
                        {errors.ingredients?.[index]?.quantity?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={Boolean(errors.ingredients?.[index]?.unit)}
                    >
                      <Input
                        placeholder="Unit..."
                        {...register(`ingredients.${index}.unit` as const)}
                      />
                      <FormErrorMessage>
                        {errors.ingredients?.[index]?.unit?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      colorScheme="red"
                      onClick={() => removeIngredient(index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </HStack>
                </FormControl>
              ))}
            </Stack>
            <Button
              onClick={() =>
                appendIngredient({
                  name: '',
                  quantity: 1,
                  unit: '',
                })
              }
            >
              Add Ingredient
            </Button>

            <Text fontSize="lg">Recipe Steps</Text>
            <Stack spacing="12">
              {stepFields.map((step, index) => {
                return (
                  <Stack key={step.id} spacing="6">
                    <HStack>
                      <FormControl isInvalid={Boolean(errors.steps?.[index])}>
                        <FormLabel>Step {index + 1} description</FormLabel>
                        <Textarea
                          placeholder={`Enter step ${index + 1} description...`}
                          {...register(`steps.${index}.description` as const)}
                        />
                        <FormErrorMessage>
                          {errors.steps?.[index]?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <Button
                        colorScheme="red"
                        onClick={() => removeStep(index)}
                      >
                        <DeleteIcon />
                      </Button>
                    </HStack>
                  </Stack>
                );
              })}
            </Stack>
            <Button
              type="button"
              variant="solid"
              colorScheme="purple"
              onClick={() => {
                appendStep({ description: '' });
              }}
            >
              Add Step
            </Button>

            <Button type="submit" isLoading={isSubmitting} colorScheme="blue">
              Post Recipe
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};