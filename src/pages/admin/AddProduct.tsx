import ProductForm from './ProductForm';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';

export default function AddProduct() {
  return (
    <div className="w-full p-8">
      <BreadcrumbComponent
        items={[
          { label: 'Products', href: '/products' },
          { label: 'Create', href: '/products/create' },
        ]}
      />

      <h1 className="text-2xl font-bold mt-4 mb-8">Create Product</h1>

      <ProductForm />
    </div>
  );
}
