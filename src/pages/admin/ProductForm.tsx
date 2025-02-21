import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Editor } from './Editor';
import { ImageUpload } from '@/components/ImageUpload';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  slug: z.string(),
  description: z.string(),
  isVisible: z.boolean().default(true),
  availability: z.date(),
  brand: z.string().optional(),
  categories: z.string(),
  images: z.array(z.string()).optional(),
  price: z.string().min(1, { message: 'Price is required' }),
  compareAtPrice: z
    .string()
    .min(1, { message: 'Compare at price is required' }),
  costPerItem: z.string().optional(),
});

const ProductForm = () => {
  const [isImagesOpen, setIsImagesOpen] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isVisible: true,
      availability: new Date(),
      description: '',
      images: [],
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <FormProvider {...form}>
      <div className="flex gap-8">
        <div className="flex-1 space-y-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Name<span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                form.setValue(
                                  'slug',
                                  generateSlug(e.target.value)
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Editor
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsImagesOpen(!isImagesOpen)}
                  >
                    <h2 className="text-lg font-semibold">Images</h2>
                    {isImagesOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  {isImagesOpen && (
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUpload
                              value={field.value || []}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsPricingOpen(!isPricingOpen)}
                  >
                    <h2 className="text-lg font-semibold">Pricing</h2>
                    {isPricingOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                  {isPricingOpen && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Price<span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.01" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="compareAtPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Compare at price
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.01" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="costPerItem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost per item</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.01" />
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-muted-foreground">
                              Customers won't see this price.
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Create product
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 space-y-8">
          <div className="border rounded-lg p-4 space-y-6">
            <h2 className="font-semibold">Status</h2>

            <FormField
              control={form.control}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel>Visible</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      This product will be hidden from all sales channels.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Availability<span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border rounded-lg p-4 space-y-6">
            <h2 className="font-semibold">Associations</h2>

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="brand1">Brand 1</SelectItem>
                      <SelectItem value="brand2">Brand 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Categories<span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="category1">Category 1</SelectItem>
                      <SelectItem value="category2">Category 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default ProductForm;
