import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useProductStore from '@/store/product-store';
import { Loader2 } from 'lucide-react';
import useCustomerStore from '@/store/customer-store';
import useOrderStore from '@/store/order-store';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/types/order';

import {
  orderFormSchema,
  OrderFormValues,
} from '@/form-schema/orderFormSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProductSelector } from '../products/productSelector';

const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // Generate a random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);

  // Format: ORD-YYMMDD-XXXX (e.g., ORD-250425-1234)
  return `ORD-${day}${month}${year}-${random}`;
};

interface OrderFormProps {
  mode?: 'create' | 'edit';
  order?: Order;
  onSubmit?: (data: Partial<Order>) => Promise<void>;
  submitting?: boolean;
  editableFields?: string[];
}

export function OrderForm({
  mode = 'create',
  order,
  onSubmit: propOnSubmit,
  submitting: propSubmitting,
  editableFields = [
    'status',
    'notes',
    'shipping_cost',
    'address',
    'city',
    'state',
    'country',
  ],
}: OrderFormProps) {
  const navigate = useNavigate();
  const { createOrder, submitting: createSubmitting } = useOrderStore();
  const { products, loadingProducts, loadProducts } = useProductStore();
  const { customers, loading: loadingCustomers, fetchCustomers } = useCustomerStore();

  const isSubmitting = propSubmitting || createSubmitting;

  useEffect(() => {
    loadProducts();
    fetchCustomers();
  }, [loadProducts, fetchCustomers]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      orderNumber: order?.order_number || generateOrderNumber(),
      status: order?.status || 'New',
      customer: order?.customer_id || undefined,
      currency: order?.currency || '',
      country: order?.country || '',
      address: order?.address || '',
      city: order?.city || '',
      state: order?.state || '',
      notes: order?.notes || '',
      items:
        order?.items?.map((item) => ({
          productId: Number(item.product_id),
          quantity: item.quantity,
          unitPrice: item.unit_price,
        })) || [],
      shippingCost: Number(order?.shipping_cost) || 0,
    },
  });

  const customerId = form.watch('customer');

  // Autofill address fields when customer is selected
  useEffect(() => {
    if (!customerId) return;
    const selectedCustomer = customers.find((c) => c.id === customerId);
    if (selectedCustomer) {
      // Only autofill if fields are empty or match previous customer
      const currentAddress = form.getValues('address');
      const currentCity = form.getValues('city');
      const currentState = form.getValues('state');
      const currentCountry = form.getValues('country');

      if (!currentAddress || currentAddress === '') {
        form.setValue('address', selectedCustomer.address || '');
      }
      if (!currentCity || currentCity === '') {
        form.setValue('city', selectedCustomer.city || '');
      }
      if (!currentState || currentState === '') {
        form.setValue('state', selectedCustomer.state || '');
      }
      if (!currentCountry || currentCountry === '') {
        form.setValue('country', selectedCustomer.country || '');
      }
    }
  }, [customerId, customers, form]);

  const handleSubmit: SubmitHandler<OrderFormValues> = async (data) => {
    try {
      if (mode === 'edit' && propOnSubmit) {
        // Transform form data to match Order type for edit mode
        const editData: Partial<Order> = {
          status: data.status,
          notes: data.notes,
          shipping_cost: data.shippingCost,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
        };
        await propOnSubmit(editData);
      } else {
        const orderData = {
          order_number: data.orderNumber,
          customer_id: data.customer,
          status: data.status,
          currency: data.currency,
          country: data.country,
          address: data.address,
          city: data.city,
          state: data.state,
          notes: data.notes,
          shipping_cost: data.shippingCost,
          items: data.items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        };

        await createOrder(orderData);
        toast.success('Order created successfully!');
        navigate('/admin/orders');
      }
    } catch (error) {
      console.error('Error with order:', error);
      toast.error(
        mode === 'edit' ? 'Failed to update order' : 'Failed to create order'
      );
    }
  };

  if (loadingProducts || loadingCustomers || isSubmitting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Transform products for selector component
  const formattedProducts = products
    .filter(
      (product): product is typeof product & { id: number } =>
        product.id !== undefined
    )
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
    }));

  return (
    <>
      <Toaster />

      <div className="flex flex-col lg:flex-row gap-8">
        <Form {...form}>
          <Card className="flex-1 space-y-8 p-4 bg-white shadow-sm border border-gray-200">
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              {/* Order Details */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Order Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="orderNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly className="bg-gray-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={
                            mode === 'edit' &&
                            !editableFields.includes('status')
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer*</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value?.toString()}
                          disabled={mode === 'edit'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers?.map((customer) => (
                              <SelectItem
                                key={customer.id}
                                value={customer.id.toString()}
                              >
                                {customer.name} ({customer.phone})
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
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={mode === 'edit'}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CFA">CFA</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Address</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={
                            mode === 'edit' &&
                            !editableFields.includes('country')
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CM">Cameroon</SelectItem>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: 123 Main Street"
                            disabled={
                              mode === 'edit' &&
                              !editableFields.includes('address')
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Buea"
                            disabled={
                              mode === 'edit' &&
                              !editableFields.includes('city')
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / Region*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ex: Southwest"
                            disabled={
                              mode === 'edit' &&
                              !editableFields.includes('state')
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Items */}
              <h2 className="text-lg font-semibold">Products</h2>
              <ProductSelector
                name="items"
                products={formattedProducts}
                readOnly={mode === 'edit'}
              />

              {/* Shipping Cost */}
              <h2 className="text-lg font-semibold">
                Shipping Cost | Delivery Fee
              </h2>
              <FormField
                control={form.control}
                name="shippingCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Cost</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={
                          mode === 'edit' &&
                          !editableFields.includes('shipping_cost')
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={
                          mode === 'edit' && !editableFields.includes('notes')
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </>
                ) : mode === 'edit' ? (
                  'Update Order'
                ) : (
                  'Create Order'
                )}
              </Button>
            </form>
          </Card>
        </Form>
      </div>
    </>
  );
}

export default OrderForm;
