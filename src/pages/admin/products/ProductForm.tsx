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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { productFormSchema } from '@/form-schema/productFormSchema';
import { Toaster } from 'react-hot-toast';
import { Editor } from '../Editor';
import { DynamicCategories } from '../categories/DynamicCategories';

const ProductForm = () => {
  const [isImagesOpen, setIsImagesOpen] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(true);
  // const { toast } = useToast();

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      isVisible: true,
      availability: new Date(),
      slug: '',
      description: '',
      categories: [], // Default value for categories
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  function onSubmit(values: z.infer<typeof productFormSchema>) {
    console.log(values);
    toast.success('Product created successfully!');
  }

  function handleCreateAnother() {
    form.reset();
  }

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
                                <Input {...field} readOnly />
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
                              <FormControl>
                                <ImageUpload
                                  value={field.value ?? []}
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
                              name="compareAtPrice"
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

                          <FormField
                            control={form.control}
                            name="costPerItem"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cost per item</FormLabel>
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
                                <p className="text-sm text-muted-foreground">
                                  Customers won't see this price.
                                </p>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Create
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleCreateAnother()}
                        >
                          Create & create another
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
                      name="isVisible"
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
                  <DynamicCategories name="categories" label="Categories" />
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
