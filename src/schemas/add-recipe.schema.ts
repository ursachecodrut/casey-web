import { z } from 'zod';

export const RecipeSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: 'Title must be at most 50 characters long' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long' })
    .max(500, { message: 'Description must be at most 500 characters long' }),
  time: z.string().min(1, { message: 'Time is required' }),
  files: z.instanceof(FileList),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1, {
          message: 'Name is required',
        }),
        quantity: z.number().min(1, {
          message: 'At least 1',
        }),
        unit: z.string().min(1, {
          message: 'Unit is required',
        }),
      })
    )
    .nonempty({
      message: 'You must have at least one ingredient',
    }),
  steps: z
    .array(
      z.object({
        description: z.string().min(1, {
          message: 'Description is required',
        }),
      })
    )
    .nonempty({
      message: 'You must have at least one step',
    }),
});

export type RecipeFormValues = z.infer<typeof RecipeSchema>;
