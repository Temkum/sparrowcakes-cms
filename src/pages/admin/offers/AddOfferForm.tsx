import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { z } from 'zod';
import { Offer } from '@/types/offer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useProductStore from '@/store/product-store';

// Zod schema for offer validation
const offerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Offer name is required')
      .max(255, 'Offer name must be less than 255 characters'),
    productId: z.number().min(1, 'Please select a product'),
    discountType: z.enum(['percentage', 'fixed'], {
      required_error: 'Please select a discount type',
    }),
    discountValue: z
      .number()
      .min(0.01, 'Discount value must be greater than 0')
      .max(99999999.99, 'Discount value is too large')
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: 'Discount value can have at most 2 decimal places',
      }),
    startTime: z
      .string()
      .min(1, 'Start time is required')
      .refine((val) => new Date(val) >= new Date(), {
        message: 'Start time must be in the future',
      }),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine((data) => new Date(data.endTime) >= new Date(data.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

interface AddOfferFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
  offer?: Offer;
  onSubmit: (
    offer: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
}

const AddOfferForm = ({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  offer,
  onSubmit,
}: AddOfferFormProps) => {
  // Get products from the store
  const { products, loadProducts } = useProductStore();
  const [formData, setFormData] = useState({
    name: '',
    productId: '',
    discountType: '',
    discountValue: '',
    startTime: '',
    endTime: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load products when the dialog opens
  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open, loadProducts]);

  // Initialize form data when offer changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && offer) {
      setFormData({
        name: offer.name || '',
        productId: offer.productId?.toString() || '',
        discountType: offer.discountType || '',
        discountValue: offer.discountValue?.toString() || '',
        startTime: offer.startTime
          ? new Date(offer.startTime).toISOString().slice(0, 16)
          : '',
        endTime: offer.endTime
          ? new Date(offer.endTime).toISOString().slice(0, 16)
          : '',
      });
    } else if (mode === 'create') {
      // Set default times for create mode
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const defaultStart = now.toISOString().slice(0, 16);

      const endTime = new Date(now);
      endTime.setDate(endTime.getDate() + 1);
      const defaultEnd = endTime.toISOString().slice(0, 16);

      setFormData({
        name: '',
        productId: '',
        discountType: '',
        discountValue: '',
        startTime: defaultStart,
        endTime: defaultEnd,
      });
    }
  }, [mode, offer, open]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setErrors({});
      if (mode === 'create') {
        setFormData({
          name: '',
          productId: '',
          discountType: '',
          discountValue: '',
          startTime: '',
          endTime: '',
        });
      }
    }
  }, [open, mode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      const validatedData = offerSchema.parse({
        ...formData,
        productId: parseInt(formData.productId),
        discountValue: parseFloat(formData.discountValue),
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      setErrors({});
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validatedData = validateForm();
    if (validatedData) {
      try {
        // Convert to the expected format
        const offerData = {
          name: validatedData.name,
          productId: validatedData.productId,
          discountType: validatedData.discountType as 'percentage' | 'fixed',
          discountValue: validatedData.discountValue,
          startTime: validatedData.startTime,
          endTime: validatedData.endTime,
          isActive: true,
        };
        console.log('data for submit', offerData);

        await onSubmit(offerData);
        onOpenChange(false);
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error submitting offer:', error);
      }
    }

    setIsSubmitting(false);
  };

  const handleQuickDuration = (hours: number) => {
    if (formData.startTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
      handleInputChange('endTime', endDate.toISOString().slice(0, 16));
    }
  };

  const selectedProduct = products.find(
    (p) => p.id === parseInt(formData.productId)
  );

  const previewDiscountedPrice =
    selectedProduct && formData.discountValue && formData.discountType
      ? formData.discountType === 'percentage'
        ? selectedProduct.price -
          (selectedProduct.price * parseFloat(formData.discountValue)) / 100
        : selectedProduct.price - parseFloat(formData.discountValue)
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {mode === 'edit' ? 'Edit Offer' : 'Create New Offer'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Offer Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Offer Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Weekend Special: Chocolate Cake"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="productId">Select Product *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => handleInputChange('productId', value)}
            >
              <SelectTrigger
                className={errors.productId ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Choose a product..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name} - ${product.price.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId && (
              <p className="text-sm text-red-600">{errors.productId}</p>
            )}
          </div>

          {/* Discount Type and Value */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type *</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) =>
                  handleInputChange('discountType', value)
                }
              >
                <SelectTrigger
                  className={errors.discountType ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                </SelectContent>
              </Select>
              {errors.discountType && (
                <p className="text-sm text-red-600">{errors.discountType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value *</Label>
              <div className="relative">
                <Input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  min="0"
                  max={
                    formData.discountType === 'percentage'
                      ? '100'
                      : '99999999.99'
                  }
                  value={formData.discountValue}
                  onChange={(e) =>
                    handleInputChange('discountValue', e.target.value)
                  }
                  placeholder={
                    formData.discountType === 'percentage' ? '25' : '10.00'
                  }
                  className={`pr-8 ${
                    errors.discountValue ? 'border-red-500' : ''
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">
                    {formData.discountType === 'percentage' ? '%' : '$'}
                  </span>
                </div>
              </div>
              {errors.discountValue && (
                <p className="text-sm text-red-600">{errors.discountValue}</p>
              )}
            </div>
          </div>

          {/* Price Preview */}
          {selectedProduct &&
            formData.discountValue &&
            formData.discountType &&
            previewDiscountedPrice > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Price Preview
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-lg text-gray-500 line-through">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    ${previewDiscountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Save $
                    {(selectedProduct.price - previewDiscountedPrice).toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>
            )}

          {/* Date and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={errors.startTime ? 'border-red-500' : ''}
              />
              {errors.startTime && (
                <p className="text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={errors.endTime ? 'border-red-500' : ''}
              />
              {errors.endTime && (
                <p className="text-sm text-red-600">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Quick Duration Buttons */}
          <div className="space-y-2">
            <Label>Quick Duration (from start time)</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '1 Hour', hours: 1 },
                { label: '6 Hours', hours: 6 },
                { label: '1 Day', hours: 24 },
                { label: '3 Days', hours: 72 },
                { label: '1 Week', hours: 168 },
              ].map((duration) => (
                <Button
                  key={duration.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickDuration(duration.hours)}
                  className="text-xs"
                >
                  {duration.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'edit' ? 'Update Offer' : 'Create Offer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOfferForm;
