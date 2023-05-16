import { z } from 'zod';

export const ReviewSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'Title is required',
    })
    .max(100, {
      message: 'Title must be less than 100 characters',
    }),
  description: z
    .string()
    .min(1, {
      message: 'Description is required',
    })
    .max(1000, {
      message: 'Description must be less than 1000 characters',
    }),
});

export type ReviewSchemaValues = z.infer<typeof ReviewSchema>;
