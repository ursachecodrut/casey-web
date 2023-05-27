import { z } from 'zod';

export const CurrentShoppingListSchema = z.object({
  items: z.array(
    z.object({
      checked: z.boolean(),
      name: z.string(),
      quantity: z.string(),
      unit: z.string(),
    })
  ),
});

export type CurrentShoppingListValues = z.infer<
  typeof CurrentShoppingListSchema
>;
