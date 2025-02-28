import { z } from 'zod';

const productItemSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be a positive number'),
});

export type ProductItemSchema = z.infer<typeof productItemSchema>;

export default productItemSchema;
