// pages/admin/products/ProductDetails.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import { Skeleton } from '@/components/ui/skeleton';
import useProductStore from '@/store/product-store';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { currentProduct, loading, loadProduct } = useProductStore();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProduct(Number(id)).catch(() => {
        toast.error('Failed to load product details');
      });
    }
  }, [id, loadProduct]);

  useEffect(() => {
    if (currentProduct && currentProduct?.image_urls?.length > 0) {
      setActiveImage(currentProduct.image_urls[0]);
    }
  }, [currentProduct]);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Products', href: '/admin/products' },
    { label: currentProduct?.name || 'Product Details', href: '#' },
  ];

  if (loading || !currentProduct) {
    return (
      <div className="p-6">
        <BreadcrumbComponent items={breadcrumbItems} />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-4 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <BreadcrumbComponent items={breadcrumbItems} />

      <div className="mt-6">
        <Link to="/admin/products">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div>
            <div className="rounded-lg border p-2 mb-4">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={currentProduct.name}
                  className="w-full h-96 object-contain rounded"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {currentProduct.image_urls?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {currentProduct.image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(image)}
                    className={`w-20 h-20 rounded border flex-shrink-0 overflow-hidden ${
                      activeImage === image ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{currentProduct.name}</h1>
              <Badge
                variant={currentProduct.is_active ? 'default' : 'secondary'}
                className={
                  currentProduct.is_active
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {currentProduct.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="mb-6">
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    currentProduct.description || 'No description'
                  ),
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-500">Price</h3>
                <p className="text-xl font-semibold">${currentProduct.price}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Discount</h3>
                <p className="text-xl font-semibold">
                  {currentProduct.discount}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Cost Per Unit</h3>
                <p className="text-xl font-semibold">
                  ${currentProduct.cost_per_unit.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Quantity</h3>
                <p className="text-xl font-semibold">
                  {currentProduct.quantity}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">Categories:</span>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.categories?.map((category) => (
                    <Badge key={category.id} variant="outline">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">
                  Availability:
                </span>
                <span>
                  {currentProduct.availability
                    ? format(
                        new Date(currentProduct.availability),
                        'MMM dd, yyyy'
                      )
                    : 'Not specified'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">Created:</span>
                <span>
                  {currentProduct.created_at
                    ? format(
                        new Date(currentProduct.created_at),
                        'MMM dd, yyyy'
                      )
                    : '-'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">Updated:</span>
                <span>
                  {currentProduct.updated_at
                    ? format(
                        new Date(currentProduct.updated_at),
                        'MMM dd, yyyy'
                      )
                    : '-'}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to={`/admin/products/edit/${currentProduct.id}`}>
                <Button variant="default">Edit Product</Button>
              </Link>
              <Link to="/admin/products">
                <Button variant="outline">Back to List</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
