import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Avatar } from '@/components/ui/avatar';
import { LogOut, Search, TrendingDown, TrendingUp } from 'lucide-react';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import { logout } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth';

const monthlyOrders: ChartData[] = [
  { name: 'Jan', value: 2000 },
  { name: 'Feb', value: 4000 },
  { name: 'Mar', value: 3000 },
  { name: 'Apr', value: 5000 },
  { name: 'May', value: 4500 },
  { name: 'Jun', value: 6000 },
  { name: 'Jul', value: 7000 },
  { name: 'Aug', value: 8500 },
  { name: 'Sep', value: 7500 },
  { name: 'Oct', value: 9000 },
  { name: 'Nov', value: 8500 },
  { name: 'Dec', value: 8000 },
];

const orders: Order[] = [
  {
    date: 'Feb 11, 2025',
    number: 'OR407806',
    customer: 'Hollie White',
    status: 'Processing',
    currency: 'USD',
    totalPrice: 194.59,
    shippingCost: 325.53,
  },
  {
    date: 'Feb 10, 2025',
    number: 'OR808086',
    customer: 'Caitlyn Spencer',
    status: 'Cancelled',
    currency: 'USD',
    totalPrice: 1262.33,
    shippingCost: 344.09,
  },
  // Add more orders as needed
];

const breadcrumbItems = [
  { label: 'Cakes By Sparrow', href: '/admin' },
  { label: 'Dashboard', href: '/admin/dashboard' },
];

const AdminDashboard = () => {
  const user = useAuthStore().user;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div>
        <BreadcrumbComponent items={breadcrumbItems} />
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto p-4">
        <div className="flex justify-between items-center my-7">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex space-x-4 bg-white">
              <Select defaultValue="business">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Customer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">
                    Business customers only
                  </SelectItem>
                  <SelectItem value="all">All customers</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                className="w-[200px]"
                placeholder="Start date"
              />
              <Input type="date" className="w-[200px]" placeholder="End date" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar>
              <img src="/placeholder.svg" alt="User" />
            </Avatar>
            <div>
              <p className="font-medium">Welcome</p>
              <p className="text-sm text-gray-500">
                {user?.name || 'Loading...'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout();
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <h3 className="text-2xl font-bold">$192.10k</h3>
              </div>
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                32%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={monthlyOrders}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">New customers</p>
                <h3 className="text-2xl font-bold">1.34k</h3>
              </div>
              <span className="text-red-500 flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" />
                3%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={monthlyOrders}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">New orders</p>
                <h3 className="text-2xl font-bold">3.54k</h3>
              </div>
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                7%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={monthlyOrders}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Orders per month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Total customers</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Latest Orders */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Latest Orders</h3>
            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <Input
                  placeholder="Search orders..."
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Date</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total price</TableHead>
                <TableHead>Shipping cost</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.number}>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.number}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          order.status === 'Processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : order.status === 'Shipped'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>${order.shippingCost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="ghost">Open</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center mt-4">
            <Select defaultValue="5">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            <Button>Next</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
