import {
  Box,
  Button,
  CloseButton,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { postRecipe } from '../api/recipes.api';
import { RecipeFormValues, RecipeSchema } from '../schemas';

export const AddRecipePage = () => {
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
    name: 'steps',
    control,
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
    mutationFn: (recipe: RecipeFormValues) => postRecipe(recipe),
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (data: RecipeFormValues) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

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
                    <CloseButton
                      onClick={() => removeIngredient(index)}
                      type="button"
                    />
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
                    <FormControl
                      isInvalid={Boolean(errors.steps?.[index]?.name)}
                    >
                      <FormLabel>Step {index + 1}</FormLabel>
                      <Textarea
                        placeholder={`Enter step ${index + 1} name...`}
                        {...register(`steps.${index}.name` as const)}
                      />
                      <FormErrorMessage>
                        {errors.steps?.[index]?.name?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={Boolean(errors.steps?.[index]?.description)}
                    >
                      <FormLabel>Step {index + 1} description</FormLabel>
                      <Textarea
                        placeholder={`Enter step ${index + 1} description...`}
                        {...register(`steps.${index}.description` as const)}
                      />
                      <FormErrorMessage>
                        {errors.steps?.[index]?.description?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="button"
                      colorScheme="red"
                      onClick={() => removeStep(index)}
                    >
                      Remove Step
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
            <Button
              type="button"
              variant="solid"
              colorScheme="purple"
              onClick={() => {
                appendStep({
                  name: '',
                  description: '',
                });
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
