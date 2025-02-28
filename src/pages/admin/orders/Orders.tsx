import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import { Link } from 'react-router-dom';
import OrdersTable from './OrdersTable';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Orders', href: '#' },
];

const OrdersPage = () => {
  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="p-6 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <Link to="/admin/orders/new">
            <Button className="bg-orange-500 hover:bg-orange-600">
              New order
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-gray-500 mb-1">Orders</p>
            <p className="text-2xl font-semibold">998</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500 mb-1">Open orders</p>
            <p className="text-2xl font-semibold">211</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500 mb-1">Average price</p>
            <p className="text-2xl font-semibold">1,026.24</p>
          </Card>
        </div>

        {/* orders table */}
        <OrdersTable />
      </div>
    </>
  );
};

export default OrdersPage;
