import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
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
import { Trash2 } from 'lucide-react';

interface ProductSelectorProps {
  name: string;
  products: { id: number; name: string; price: number }[];
  readOnly?: boolean;
}

export function ProductSelector({
  name,
  products,
  readOnly,
}: ProductSelectorProps) {
  const { control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Initialize with one product field
  useEffect(() => {
    if (fields.length === 0) {
      append({ productId: 0, quantity: 1, unitPrice: 0 });
    }
  }, [append, fields.length]);

  const handleAddProduct = () => {
    append({ productId: 0, quantity: 1, unitPrice: 0 });
  };

  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = products.find((p) => p.id === Number(productId));
    if (selectedProduct) {
      setValue(`${name}.${index}.productId`, Number(productId));
      setValue(`${name}.${index}.unitPrice`, selectedProduct.price);
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="border p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product Selection */}
            <FormField
              control={control}
              name={`${name}.${index}.productId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product*</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      handleProductChange(index, value);
                    }}
                    value={field.value ? String(field.value) : undefined}
                    disabled={readOnly}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
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

            {/* Quantity */}
            <FormField
              control={control}
              name={`${name}.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit Price */}
            <FormField
              control={control}
              name={`${name}.${index}.unitPrice`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                      readOnly
                      className="bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Remove Button (only show if there's more than one product and not in readOnly mode) */}
          {fields.length > 1 && !readOnly && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
              className="w-full md:w-auto"
            >
              <Trash2 size={16} className="mr-2" />
              Remove Product
            </Button>
          )}
        </div>
      ))}

      {/* Add Product Button (only show if not in readOnly mode) */}
      {!readOnly && (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleAddProduct}
            className="w-full md:w-auto"
          >
            Add 1 more item
          </Button>
        </div>
      )}
    </div>
  );
}
