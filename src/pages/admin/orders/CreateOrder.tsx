import OrderForm from './OrderForm';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'New', href: '#' },
];

const CreateOrder = () => {
  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="w-full p-6 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Create Order</h1>
        </div>

        <OrderForm />
      </div>
    </>
  );
};

export default CreateOrder;
