import { count } from 'console';
import { z } from 'zod';
// Combined regex for MTN, Orange, and Camtel phone numbers in Cameroon
const cameroonPhoneRegex =
  /^(?:\+237|00237)?(?:6[5-9]\d{7}|2[23]\d{7}|33\d{7})$/;

const customerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(100, { message: 'Name cannot exceed 100 characters.' }),

  email: z
    .string()
    .trim()
    .email({
      message: 'Please enter a valid email address (e.g., user@example.com).',
    })
    .optional()
    .or(z.literal('').transform(() => undefined)),

  phone: z
    .string()
    .min(9, { message: 'Phone number must be at least 9 digits.' })
    .max(13, { message: 'Phone number cannot exceed 13 digits.' })
    .regex(cameroonPhoneRegex, {
      message:
        'Please enter a valid Cameroon phone number (e.g., +237671234567 or 681234567).',
    }),

  city: z
    .string()
    .max(100, { message: 'City cannot exceed 100 characters.' })
    .optional(),
  address: z
    .string()
    .max(200, { message: 'Address cannot exceed 200 characters.' })
    .optional(),
  occupation: z
    .string()
    .max(100, { message: 'Occupation cannot exceed 100 characters.' })
    .optional(),
  country: z
    .string()
    .refine((value) => ['US', 'CA', 'CM', 'FR', 'DE'].includes(value), {
      message: 'Please select a valid country from the dropdown.',
    }),
});

export default customerFormSchema;
