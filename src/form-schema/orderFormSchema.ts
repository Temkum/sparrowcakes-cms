import { z } from 'zod';

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
  items: z.array(
    z.object({
      product: z.string(),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
      unitPrice: z.number().min(0, 'Price must be greater than or equal to 0'),
    })
  ),
  shippingCost: z
    .number()
    .min(0, 'Shipping cost must be greater than or equal to 0'),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export { orderFormSchema, type OrderFormValues };

export default orderFormSchema;
