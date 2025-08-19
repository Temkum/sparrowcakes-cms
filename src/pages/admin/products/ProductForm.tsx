import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Editor from '../Editor';
import { DynamicCategories } from '../categories/DynamicCategories';
import { productFormSchema } from '@/form-schema/productFormSchema';
import { ImageUpload } from './ImageUpload';
import useProductStore from '@/store/product-store';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  costPerUnit: number;
  isActive: boolean;
  availableFrom: Date | null;
  availableTo: Date | null;
  categories: number[];
  images: string[];
  quantity: number;
}

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  mode: 'create' | 'edit';
}

const ProductForm = ({ product, onSuccess, mode }: ProductFormProps) => {
  const [isImagesOpen, setIsImagesOpen] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(true);
  const [isCreateAnother, setIsCreateAnother] = useState(false);

  // Zustand store
  const {
    submitting,
    validationErrors,
    createProduct,
    updateProduct,
    clearValidationErrors,
  } = useProductStore();

  const form = useForm<z.infer<ReturnType<typeof productFormSchema>>>({
    resolver: zodResolver(productFormSchema(mode)),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      price: product?.price || 0,
      discount: product?.discount || 0,
      costPerUnit: product?.costPerUnit || 0,
      isActive: product?.isActive ?? true,
      availableFrom: product?.availableFrom
        ? new Date(product.availableFrom)
        : new Date(),
      availableTo: product?.availableTo ? new Date(product.availableTo) : null,
      categories: product?.categories || [],
      images: product?.images || [],
      quantity: product?.quantity || 0,
    },
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const formatDateForServer = (date: Date | null | undefined): string => {
    if (!date) return '';
    // Create a new date to avoid mutating the original
    const d = new Date(date);
    // Get current form values
    const formValues = form.getValues();
    // Set to start of day for from date, end of day for to date
    if (date === formValues.availableFrom) {
      d.setHours(0, 0, 0, 0);
    } else if (date === formValues.availableTo) {
      d.setHours(23, 59, 59, 999);
    }
    return d.toISOString();
  };

  const validateDateRange = (
    from: Date | null | undefined,
    to: Date | null | undefined
  ): boolean => {
    if (!from || !to) return true;
    return to >= from;
  };

  const onSubmit = async (
    values: z.infer<ReturnType<typeof productFormSchema>>
  ) => {
    clearValidationErrors();

    // Validate date range
    if (!validateDateRange(values.availableFrom, values.availableTo)) {
      form.setError('availableTo', {
        type: 'manual',
        message: 'Available to date must be after available from date',
      });
      return;
    }

    const formData = new FormData();

    // Format form data
    formData.append('name', values.name);
    formData.append('description', values.description ?? '');
    formData.append('price', String(values.price));
    formData.append('discount', String(values.discount));
    formData.append('costPerUnit', String(values.costPerUnit));
    formData.append('quantity', String(values.quantity));
    formData.append('isActive', String(values.isActive));

    // Handle dates
    if (values.availableFrom) {
      formData.append(
        'availableFrom',
        formatDateForServer(values.availableFrom)
      );
    }

    if (values.availableTo) {
      formData.append('availableTo', formatDateForServer(values.availableTo));
    }

    formData.append('categories', JSON.stringify(values.categories));

    try {
      let result;

      if (mode === 'create') {
        // Handle create mode
        // Only append slug if it exists
        if (values.slug) {
          formData.append('slug', values.slug);
        }
        (values.images as File[]).forEach((file) => {
          formData.append('images', file);
        });
        result = await createProduct(formData);
      } else {
        // Handle edit mode
        if (!product?.id) throw new Error('Product ID is required for updates');

        // Handle images for update
        const existingImages = (values.images as (string | File)[]).filter(
          (img) => typeof img === 'string'
        );
        const newImages = (values.images as (string | File)[]).filter(
          (img) => img instanceof File
        );

        // Add existing images that weren't removed
        formData.append('existingImages', JSON.stringify(existingImages));

        // Add new images if any
        newImages.forEach((file) => {
          formData.append('newImages', file);
        });

        // Calculate removed images
        const removedImages = product.images.filter(
          (img) => !existingImages.includes(img)
        );
        if (removedImages.length > 0) {
          formData.append('removedImages', JSON.stringify(removedImages));
        }

        result = await updateProduct(product.id, formData);
      }

      if (result) {
        toast.success(
          mode === 'create'
            ? 'Product created successfully'
            : 'Product updated successfully',
          { duration: 2000 }
        );

        if (mode === 'create' && isCreateAnother) {
          // Reset form for create another
          form.reset({
            name: '',
            slug: '',
            description: '',
            price: 0,
            discount: 0,
            costPerUnit: 0,
            quantity: 0,
            isActive: true,
            availableFrom: new Date(),
            availableTo: null,
            categories: [],
            images: [],
          });
          setIsCreateAnother(false);
        } else {
          if (onSuccess) {
            onSuccess();
          }
        }
      }
    } catch (error: unknown) {
      console.error('Submission error:', error);
      toast.error('Oops, something went wrong. Try again later!');
    }
  };

  // Set validation errors from API on form fields
  useEffect(() => {
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        console.error('Validation error:', error);
        // Convert field name to a valid form field key
        const fieldName = error.field.toLowerCase() as keyof z.infer<
          ReturnType<typeof productFormSchema>
        >;
        form.setError(fieldName, {
          type: 'server',
          message: error.message,
        });
      });
    }
  }, [validationErrors, form]);

  return (
    <>
      <Toaster />
      <FormProvider {...form}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <Form {...form}>
            <div className="w-full">
              <Card className="space-y-8 p-4 bg-white shadow-sm border border-gray-200">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <Input {...field} disabled />
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
                                value={field.value || ''}
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
                        <h2 className="text-lg font-semibold mt-5">Images</h2>
                        {isImagesOpen ? <ChevronUp /> : <ChevronDown />}
                      </div>
                      {isImagesOpen && (
                        <FormField
                          control={form.control}
                          name="images"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Images</FormLabel>
                              <FormControl>
                                <ImageUpload
                                  value={field.value || []}
                                  onChange={(images) => {
                                    field.onChange(images);
                                    form.trigger('images');
                                  }}
                                  maxFiles={10}
                                  isEditMode={mode === 'edit'}
                                  disabled={submitting}
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
                        <h2 className="text-lg font-semibold mt-5">Pricing</h2>
                        {isPricingOpen ? <ChevronUp /> : <ChevronDown />}
                      </div>
                      {isPricingOpen && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Price<span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      step="0.01"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="discount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Compare at price</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      step="0.01"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="costPerUnit"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cost per item</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                  <p className="text-sm text-muted-foreground">
                                    Customers won't see this price.
                                  </p>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="quantity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantity</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600"
                          disabled={submitting}
                        >
                          {submitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {mode === 'create' ? 'Create' : 'Update'}
                        </Button>
                        {mode === 'create' && (
                          <Button
                            type="button"
                            variant="outline"
                            className="bg-secondary-500 text-dark-100 hover:bg-orange-600 hover:text-white"
                            onClick={() => {
                              setIsCreateAnother(true); // Set state for "Create Another"
                              form.handleSubmit(onSubmit)();
                            }}
                            disabled={submitting}
                          >
                            {submitting && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create and Create Another
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          className="bg-secondary-500 text-dark-100 hover:bg-gray-600 hover:text-white"
                          onClick={() => window.history.back()}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-2/4 flex flex-col space-y-8">
              {/* Status Card */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="border-b px-6 py-4">
                  <CardTitle className="text-base font-medium">
                    Visibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <Label className="font-normal">Visible</Label>
                        </>
                      )}
                    />
                  </div>
                  <p className="text-gray-500 text-sm">
                    This product will be hidden from all sales channels.
                  </p>

                  <FormField
                    control={form.control}
                    name="availableFrom"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Available From<span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
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
                              selected={field.value ?? undefined}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availableTo"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Available To (optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
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
                              selected={field.value ?? undefined}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Associations Card */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="border-b px-6 py-4">
                  <CardTitle className="text-base font-medium">
                    Associations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <DynamicCategories
                    name="categories"
                    label="Category"
                    value={form.watch('categories')}
                    onChange={(categories) =>
                      form.setValue('categories', categories)
                    }
                    isRequired
                  />
                </CardContent>
              </Card>
            </div>
          </Form>
        </div>
      </FormProvider>
    </>
  );
};

export default ProductForm;
