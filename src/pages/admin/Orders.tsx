import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Filter, Columns3, CircleCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface Order {
  id: string;
  number: string;
  customer: string;
  status: 'Processing' | 'Delivered' | 'Shipped' | 'New' | 'Cancelled';
  currency: string;
  totalPrice: number;
  shippingCost: number;
  orderDate: string;
}

const ordersData: Order[] = [
  {
    id: '1',
    number: 'OR571702',
    customer: 'Dahlia Conroy',
    status: 'Processing',
    currency: 'USD',
    totalPrice: 1261.25,
    shippingCost: 323.42,
    orderDate: 'Feb 29, 2024',
  },
  {
    id: '2',
    number: 'OR323020',
    customer: 'Mitchel Moen',
    status: 'Delivered',
    currency: 'Saudi Riyal',
    totalPrice: 104.0,
    shippingCost: 103.23,
    orderDate: 'Apr 19, 2024',
  },
  // Add more orders as needed
];

const OrdersPage = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  return (
    <div className="p-6 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Button className="bg-orange-500 hover:bg-orange-600">New order</Button>
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

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 justify-center ">
        <div className="border rounded-md text-gray-500">
          <Button variant="ghost" className="text-orange-500">
            All
          </Button>
          <Button variant="ghost">New</Button>
          <Button variant="ghost">Processing</Button>
          <Button variant="ghost">Shipped</Button>
          <Button variant="ghost">Delivered</Button>
          <Button variant="ghost">Cancelled</Button>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex justify-between items-center mb-4">
        <Select defaultValue="default">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Group by</SelectItem>
            <SelectItem value="status">Status</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <Input placeholder="Search" className="w-[200px]" />
          <Button variant="ghost" size="icon">
            <Filter className="h-4 w-4" fill="gray" color="gray" />
          </Button>
          <Button variant="ghost" size="icon">
            <Columns3 className="h-4 w-4" color="gray" />
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedOrders.length === ordersData.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedOrders(ordersData.map((order) => order.id));
                    } else {
                      setSelectedOrders([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Total price</TableHead>
              <TableHead>Shipping cost</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedOrders([...selectedOrders, order.id]);
                      } else {
                        setSelectedOrders(
                          selectedOrders.filter((id) => id !== order.id)
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{order.number}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
                      ${
                        order.status === 'Processing'
                          ? 'bg-yellow-100 text-orange-600'
                          : order.status === 'Delivered' && (
                              <CircleCheck className="h-4 w-4" />
                            )
                          ? 'bg-green-100 text-green-600'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {order.status === 'Processing' && '⌛'}
                    {order.status === 'Delivered' && (
                      <CircleCheck
                        className="h-4 w-4 mr-1"
                        color="white"
                        fill="green"
                      />
                    )}
                    {order.status === 'Shipped' && '🚚'} {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.currency}</TableCell>
                <TableCell>{order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>{order.shippingCost.toFixed(2)}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Summary Section */}
        <div className="p-4 border-t">
          <div className="space-y-4">
            <div className="font-medium">Summary</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">This page</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Total price</div>
                    <div>Sum</div>
                    <div className="text-gray-600">$10,267.38</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Shipping cost</div>
                    <div>Sum</div>
                    <div className="text-gray-600">$2,627.24</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">All orders</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Total price</div>
                    <div>Sum</div>
                    <div className="text-gray-600">$1,024,185.96</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Shipping cost</div>
                    <div>Sum</div>
                    <div className="text-gray-600">$291,223.85</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Showing 1 to 10 of 998 results
            </span>
            <Select defaultValue="10">
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-orange-500">
              1
            </Button>
            <Button variant="ghost">2</Button>
            <Button variant="ghost">3</Button>
            <Button variant="ghost">4</Button>
            <span>...</span>
            <Button variant="ghost">99</Button>
            <Button variant="ghost">100</Button>
            <Button variant="ghost">→</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrdersPage;
