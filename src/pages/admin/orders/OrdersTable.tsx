import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Columns3, CircleCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import useOrderStore from '@/store/order-store';
import { OrderStatus } from '@/types/order';
import { useNavigate } from 'react-router-dom';

const OrdersTable = () => {
  const navigate = useNavigate();
  const {
    orders,
    loading,
    filter,
    totalCount,
    setFilter,
    loadOrders,
    deleteOrders,
  } = useOrderStore();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | 'all'>(
    'all'
  );

  useEffect(() => {
    loadOrders();
  }, [filter, loadOrders]);

  const handleStatusFilter = (status: OrderStatus | 'all') => {
    setCurrentStatus(status);
    setFilter({
      ...filter,
      status: status === 'all' ? undefined : status,
      page: 1,
    });
  };

  const handleSearch = (searchTerm: string) => {
    setFilter({ ...filter, searchTerm, page: 1 });
  };

  const handleEdit = (orderId: string) => {
    navigate(`/admin/orders/${orderId}/edit`);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedOrders(checked ? orders.map((order) => order.id) : []);
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleDelete = async () => {
    if (selectedOrders.length === 0) return;

    try {
      await deleteOrders(selectedOrders);
      setSelectedOrders([]);
    } catch (error) {
      console.error('Failed to delete orders:', error);
    }
  };

  return (
    <>
      {/* Status Filters */}
      <div className="flex gap-2 mb-6 justify-center">
        <div className="border rounded-md text-gray-500">
          <Button
            variant="ghost"
            className={currentStatus === 'all' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'New' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('New')}
          >
            New
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'Processing' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('Processing')}
          >
            Processing
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'Shipped' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('Shipped')}
          >
            Shipped
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'Delivered' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('Delivered')}
          >
            Delivered
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'Cancelled' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('Cancelled')}
          >
            Cancelled
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <div className="flex justify-between items-center mb-4 p-3">
          {/* Table Controls */}
          <div className="flex items-center gap-2">
            {selectedOrders.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="mr-2"
              >
                Delete Selected ({selectedOrders.length})
              </Button>
            )}
            <Input
              placeholder="Search orders..."
              className="w-[300px]"
              onChange={(e) => handleSearch(e.target.value)}
              value={filter.searchTerm}
            />
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Columns3 className="h-4 w-4" />
            </Button>
          </div>

          <Select
            value={String(filter.pageSize)}
            onValueChange={(value) =>
              setFilter({ ...filter, pageSize: Number(value) })
            }
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="font-bold text-black-600 bg-gray-200">
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedOrders.length === orders.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Shipping Cost</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOrder(order.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.order_number}
                  </TableCell>
                  <TableCell>{order.customer_id}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
                        ${
                          order.status === 'Processing'
                            ? 'bg-yellow-100 text-orange-600'
                            : order.status === 'Delivered'
                            ? 'bg-green-100 text-green-600'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {order.status === 'Processing' && '⌛'}
                      {order.status === 'Delivered' && (
                        <CircleCheck className="h-4 w-4 mr-1" color="green" />
                      )}
                      {order.status === 'Shipped' && '🚚'} {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.currency}</TableCell>
                  <TableCell>{order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{order.shipping_cost.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="text-orange-500 hover:text-orange-600"
                      onClick={() => handleEdit(order.id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {orders.length} of {totalCount} orders
          </div>
          {/* Add pagination buttons here */}
        </div>
      </Card>
    </>
  );
};

export default OrdersTable;
