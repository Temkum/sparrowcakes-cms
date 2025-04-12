import ProductForm from './ProductForm';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';

const breadcrumbItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  { label: 'Products', href: '/admin/products' },
  { label: 'Create Product', href: '#' },
];

export default function AddProduct() {
  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mx-auto h-full w-full px-4 md:px-6 lg:px-8 xl:max-w-6xl">
        <div className="w-full p-8">
          <h1 className="text-3xl font-bold mt-4 mb-8">Create Product</h1>

          <ProductForm mode="create" onSuccess={() => {}} />
        </div>
      </div>
    </>
  );
}
