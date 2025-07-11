import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import useProductStore from '@/store/product-storeold';
import { useEffect } from 'react';

const breadcrumbItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  { label: 'Products', href: '/admin/products' },
  { label: 'Modify Product', href: '#' },
];

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loadProduct, currentProduct, loadingProduct } = useProductStore();

  if (!id) {
    toast.error('Product ID not found');
    throw new Error('Product ID is required');
  }

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id, loadProduct]);

  const handleSuccess = () => {
    // Navigate to products list after successful update
    navigate('/admin/products');
  };

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentProduct) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mx-auto h-full w-full px-4 md:px-6 lg:px-8 xl:max-w-6xl">
        <div className="w-full p-8">
          <h1 className="text-3xl font-bold mt-4 mb-8">Edit Product</h1>

          <ProductForm
            mode="edit"
            product={{
              ...currentProduct,
              costPerUnit: currentProduct.cost_per_unit || 0,
              isActive: currentProduct.is_active || false,
              images: currentProduct.image_urls || [],
              categories: currentProduct.categories.map((category) =>
                Number(category.id)
              ),
              availability: new Date(currentProduct.availability),
            }}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </>
  );
};

export default ProductEdit;
