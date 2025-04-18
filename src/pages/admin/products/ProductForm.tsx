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
import { useNavigate } from 'react-router-dom';
import { productFormSchema } from '@/form-schema/productFormSchema';
import { ImageUpload } from './ImageUpload';
import useProductStore from '@/store/product-store';
import { useAuthStore } from '@/store/auth';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  costPerUnit: number;
  isActive: boolean;
  availability: Date;
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
  const navigate = useNavigate();
  const [isImagesOpen, setIsImagesOpen] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Zustand store
  const {
    submitting,
    validationErrors,
    createProduct,
    updateProduct,
    deleteProduct,
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
      availability: product?.availability || new Date(),
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

  // In your ProductForm component, ensure proper FormData construction:
  const onSubmit0 = async (
    values: z.infer<ReturnType<typeof productFormSchema>>
  ) => {
    clearValidationErrors();
    const formData = new FormData();
    const { token } = useAuthStore.getState();

    // Append all non-file fields
    Object.entries(values).forEach(([key, value]) => {
      if (key !== 'images') {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
    });

    // Handle images differently for create vs edit
    if (mode === 'create') {
      (values.images as File[]).forEach((file) => {
        formData.append('images', file);
      });
    } else {
      // For edit mode, separate existing and new images
      const existingImages = (values.images as (string | File)[]).filter(
        (img) => typeof img === 'string'
      );
      const newImages = (values.images as (string | File)[]).filter(
        (img) => img instanceof File
      ) as File[];

      formData.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach((file) => {
        formData.append('newImages', file);
      });
    }

    // Debug: Log FormData contents
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      if (mode === 'create') {
        await createProduct(formData, token);
      } else if (mode === 'edit' && product) {
        await updateProduct(product.id, formData, token);
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const onSubmit = async (
    values: z.infer<ReturnType<typeof productFormSchema>>
  ) => {
    clearValidationErrors();
    const formData = new FormData();
    const { token } = useAuthStore.getState();

    // Explicitly append all fields including slug
    formData.append('name', values.name);
    formData.append('slug', values.slug); // Make sure this is included
    formData.append('description', values.description ?? '');
    formData.append('price', values.price.toString());
    formData.append('discount', values.discount.toString());
    formData.append('costPerUnit', values.costPerUnit.toString());
    formData.append('quantity', values.quantity.toString());
    formData.append('isActive', values.isActive.toString());
    formData.append('availability', values.availability.toISOString());

    // Handle categories
    formData.append('categories', JSON.stringify(values.categories));

    // Handle images
    if (mode === 'create') {
      (values.images as File[]).forEach((file) => {
        formData.append('images', file);
      });
    } else {
      const existingImages = (values.images as (string | File)[]).filter(
        (img) => typeof img === 'string'
      );
      const newImages = (values.images as (string | File)[]).filter(
        (img) => img instanceof File
      ) as File[];

      formData.append('existingImages', JSON.stringify(existingImages));
      newImages.forEach((file) => {
        formData.append('newImages', file);
      });
    }

    // Debug: Verify all fields are included
    for (const [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `File(${value.name})` : value
      );
    }

    try {
      if (mode === 'create') {
        await createProduct(formData, token);
        toast.success('Product created successfully');
      } else if (product) {
        await updateProduct(product.id, formData, token);
        toast.success('Product updated successfully');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to save product');
    }
  };

  const onSubmit1 = async (
    values: z.infer<ReturnType<typeof productFormSchema>>
  ) => {
    clearValidationErrors();
    const formData = new FormData();
    const { token } = useAuthStore.getState();

    const slug = values.slug || generateSlug(values.name);
    console.log('Using slug:', slug); // Debug log

    // Basic fields
    formData.append('name', values.name);
    formData.append('slug', slug); // Ensure slug is never empty
    formData.append('description', values.description ?? '');
    formData.append('price', String(values.price));
    formData.append('discount', String(values.discount));
    formData.append('costPerUnit', String(values.costPerUnit));
    formData.append('quantity', String(values.quantity));
    formData.append('is_active', String(values.isActive)); // Note: backend uses snake_case
    formData.append('availability', values.availability.toISOString());

    // Handle categories - convert to array of IDs
    const categoryIds = values.categories.map((cat) =>
      typeof cat === 'object' && cat.id ? cat.id : Number(cat)
    );
    formData.append('categories', JSON.stringify(categoryIds));

    // Handle images
    if (mode === 'create') {
      // For new products, append each file directly as 'images'
      if (Array.isArray(values.images)) {
        values.images.forEach((value: string | File) => {
          if (value instanceof File) {
            formData.append('images', value);
          }
        });
      }
    } else {
      // For editing, handle both existing URLs and new files
      const existingImages = values.images.filter(
        (img): img is string => typeof img === 'string'
      );
      const newImages = values.images.filter(
        (img): img is File => img instanceof File
      );

      // Send existing image URLs as a JSON string
      formData.append('image_urls', JSON.stringify(existingImages));

      // Send new files as 'images'
      newImages.forEach((file) => {
        formData.append('images', file);
      });
    }

    // Debug: Log FormData contents
    console.log('Submitting form data:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File (${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    try {
      let result;
      if (mode === 'create') {
        result = await createProduct(formData, token);
      } else if (mode === 'edit' && product) {
        result = await updateProduct(product.id, formData, token);
      }

      if (result) {
        toast.success(
          `Product ${mode === 'create' ? 'created' : 'updated'} successfully`
        );
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  // Handle creating another product
  function handleCreateAnother() {
    form.reset({
      name: '',
      slug: '',
      description: '',
      price: 0,
      discount: 0,
      costPerUnit: 0,
      isActive: true,
      availability: new Date(),
      categories: [],
      images: [],
    });
    toast.success('Ready to create another product');
  }

  // Handle product deletion
  const handleDelete = async () => {
    if (!product) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (result) {
        toast.success('Product deleted successfully');
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/products');
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Set validation errors from API on form fields
  useEffect(() => {
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        console.error('Validation error:', error);
        const fieldName = error.field.toLowerCase() as any;
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
                              <FormLabel>Slugs</FormLabel>
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
                                  <FormLabel>
                                    Compare at price
                                    <span className="text-red-500">*</span>
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
                        {mode === 'edit' && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </Button>
                        )}
                        {mode === 'create' && (
                          <Button
                            type="button"
                            variant="outline"
                            className="bg-secondary-500
                            text-dark-100 hover:bg-orange-600 hover:text-white"
                            onClick={handleCreateAnother}
                          >
                            Create and Create Another
                          </Button>
                        )}
                        <Button
                          type="button"
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
