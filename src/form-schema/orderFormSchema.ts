import { z } from 'zod';
import productItemSchema from './productItemSchema';

const orderFormSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  status: z.enum(['New', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
  customer: z
    .number({
      required_error: 'Customer is required',
      invalid_type_error: 'Customer ID must be a number',
    })
    .min(1, 'Please select a customer'),
  currency: z.string().min(1, 'Currency is required'),
  country: z.string().min(1, 'Country is required'),
  address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  notes: z.string().optional(),
  items: z.array(productItemSchema).min(1, 'At least one product is required'),
  shippingCost: z
    .number()
    .min(0, 'Shipping cost must be greater than or equal to 0'),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export { orderFormSchema, type OrderFormValues };

export default orderFormSchema;
