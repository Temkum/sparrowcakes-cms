import { z } from 'zod';
// Combined regex for MTN, Orange, and Camtel phone numbers in Cameroon
const cameroonPhoneRegex =
  /^(?:\+237|00237)?(?:6[5-9]\d{7}|2[23]\d{7}|33\d{7})$/;

// Optional: Custom email regex (if needed)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const customerFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z
    .string()
    .regex(emailRegex, {
      message: 'Please enter a valid email address (e.g., user@example.com).',
    })
    .optional()
    .or(z.literal('')), // This allows empty string as valid input
  phone: z.string().regex(cameroonPhoneRegex, {
    message:
      'Please enter a valid phone number (e.g., +237671234567 or 237681234567).',
  }),
  city: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

export default customerFormSchema;
