import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/sparrow/StarRating';
import { Loader2 } from 'lucide-react';
import { Review, ReviewResponseProps } from '@/types/review';
import { Customer } from '@/types/customer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/types/product';

const reviewFormSchema = z.object({
  customerId: z.number({
    required_error: 'Please select a customer',
  }),
  productId: z.number({
    required_error: 'Please select a product',
  }),
  rating: z
    .number()
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must be at most 5' }),
  comment: z
    .string()
    .min(1, { message: 'Comment must be at least 2 character' }),
  isActive: z.boolean(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  review?: Review | ReviewResponseProps;
  onSubmit: (data: Partial<Review>) => void;
  onDelete?: () => void;
  submitting?: boolean;
  customers: Customer[];
  products: Product[];
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  review,
  onSubmit,
  submitting = false,
  customers,
  products,
}) => {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      customerId: review
        ? 'customerId' in review
          ? review.customerId
          : review.customer?.id
        : undefined,
      productId: review
        ? 'productId' in review
          ? review.productId
          : review.product?.id
        : undefined,
      rating: review?.rating || 5,
      comment: review?.comment || '',
      isActive: review
        ? 'isActive' in review
          ? review.isActive
          : review.display === true
        : false,
    },
  });

  const handleFormSubmit = async (data: ReviewFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products &&
                    products.map((product) => (
                      <SelectItem key={product.id} value={String(product.id)}>
                        {product.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={field.value}
                    className="cursor-pointer"
                    onClick={(rating) => field.onChange(rating)}
                  />
                  <span className="text-sm text-gray-500">
                    ({field.value}/5)
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write your review..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display review?</FormLabel>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className={`ml-3 ${
                  field.value ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {review ? 'Update Review' : 'Create Review'}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
