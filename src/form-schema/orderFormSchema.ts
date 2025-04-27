import { z } from 'zod';
import productItemSchema from './productItemSchema';

const orderFormSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  status: z.enum(['New', 'Processing', 'Shipped', 'Delivered']),
  customer: z.string().min(1, 'Customer is required'),
  currency: z.string().min(1, 'Currency is required'),
  country: z.string().min(1, 'Country is required'),
  address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  notes: z.string().optional(),
  items: z.array(productItemSchema).min(1, 'At least one product is required'),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export { orderFormSchema, type OrderFormValues };

export default orderFormSchema;
