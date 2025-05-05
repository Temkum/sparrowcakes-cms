import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import useOrderStore from '@/store/order-store';
import OrderForm from './OrderForm';
import { Card } from '@/components/ui/card';
import type { Order } from '@/types/order';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Edit', href: '#' },
];

/**
 * EditOrder page allows editing only permitted fields of an order.
 * Follows container/presenter pattern and strict typing.
 */
const EditOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, loadOrders, updateOrder, loading } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!id) return;
    const found = orders.find((o) => o.id === Number(id));
    setOrder(found || null);
  }, [orders, id]);

  const handleSubmit = useCallback(
    async (data: Partial<Order>) => {
      if (!order || !id) return;
      setSubmitting(true);
      try {
        await updateOrder(Number(id), data);
        navigate('/admin/orders');
      } catch (e) {
        // error handled in store
        console.error('Failed to update order:', e);
      } finally {
        setSubmitting(false);
      }
    },
    [order, id, updateOrder, navigate]
  );

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="w-full p-6 max-w-[1280px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Order</h1>
        <Card className="p-6">
          <OrderForm
            mode="edit"
            order={order}
            onSubmit={handleSubmit}
            submitting={submitting}
            editableFields={[
              'status',
              'notes',
              'shipping_cost',
              'address',
              'city',
              'state',
              'country',
            ]}
          />
        </Card>
      </div>
    </>
  );
};

export default React.memo(EditOrder);
