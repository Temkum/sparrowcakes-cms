import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import useOrderStore from '@/store/order-store';
import { Card } from '@/components/ui/card';
import type { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Details', href: '#' },
];

/**
 * ViewOrder page displays all order details in a read-only, accessible, and responsive layout.
 */
const ViewOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, loadOrders, loading } = useOrderStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const found = orders.find((o) => String(o.id) === id);
    setOrder(found || null);
  }, [orders, id]);

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return (quantity * unitPrice).toFixed(2);
  };

  const calculateOrderTotal = () => {
    if (!order?.items) return 0;
    const itemsTotal = order.items.reduce((sum, item) => {
      return sum + item.quantity * item.unit_price;
    }, 0);
    const shippingCost =
      typeof order.shipping_cost === 'string'
        ? parseFloat(order.shipping_cost)
        : order.shipping_cost || 0;
    return (itemsTotal + shippingCost).toFixed(2);
  };

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
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        <div className="space-y-6">
          {/* Order Information Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Order Number:</span>{' '}
              {order.order_number}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{' '}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                  ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Processing'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'Shipped'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {order.status}
              </span>
            </div>
            <div>
              <span className="font-semibold">Customer:</span>{' '}
              {order.customer?.name || order.customer_id}
            </div>
            <div>
              <span className="font-semibold">Currency:</span> {order.currency}
            </div>
            <div>
              <span className="font-semibold">Address:</span> {order.address},{' '}
              {order.city}, {order.state}, {order.country}
            </div>
            <div>
              <span className="font-semibold">Notes:</span> {order.notes || '-'}
            </div>
            <div>
              <span className="font-semibold">Created At:</span>{' '}
              {new Date(order.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold">Shipping Cost:</span>{' '}
              {typeof order.shipping_cost === 'string'
                ? parseFloat(order.shipping_cost).toFixed(2)
                : order.shipping_cost.toFixed(2)}{' '}
              {order.currency}
            </div>
          </div>

          {/* Products Card */}
          <Card className="p-6" aria-label="Order items">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={`${item.product_id}-${item.unit_price}`}>
                    <TableCell>{item.product_id}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.unit_price.toFixed(2)} {order.currency}
                    </TableCell>
                    <TableCell className="text-right">
                      {calculateItemTotal(item.quantity, item.unit_price)}{' '}
                      {order.currency}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={3} className="font-semibold">
                    Order Total (including shipping):
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {calculateOrderTotal()} {order.currency}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>

          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
      </div>
    </>
  );
};

export default React.memo(ViewOrder);
