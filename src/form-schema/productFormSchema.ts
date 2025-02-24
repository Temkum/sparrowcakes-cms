import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  slug: z.string().optional(),
  description: z.string(),
  isVisible: z.boolean().default(true),
  availability: z.date(),
  categories: z
    .array(z.number())
    .min(1, { message: 'At least one category is required' }), // Updated to array of numbers
  images: z
    .array(z.string())
    .min(1, { message: 'At least one image is required' }),
  price: z.number().min(0, { message: 'Price is required' }),
  compareAtPrice: z
    .number()
    .min(0, { message: 'Compare at price is required' }),
  costPerItem: z.number().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
