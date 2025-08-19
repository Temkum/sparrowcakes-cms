import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
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
import useOrderStore from '@/store/order-store';
import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormatCurrency } from '@/hooks/format-currency';

interface ChartDataPoint {
  name: string | number;
  value: number;
}

const formatMonthlyData = (data: number[]): ChartDataPoint[] => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return data.map((value, index) => ({
    name: months[index],
    value,
  }));
};

const formatWeeklyData = (data: number[]): ChartDataPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return data.map((value, index) => ({
    name: days[index],
    value,
  }));
};

const formatYearlyData = (data: number[]): ChartDataPoint[] => {
  const currentYear = new Date().getFullYear();
  return data.map((value, index) => ({
    name: currentYear - 4 + index,
    value,
  }));
};

const AdminDashboard = () => {
  const { orders, stats, loadStats } = useOrderStore();
  const user = useAuthStore().user;
  const formatCurrency = useFormatCurrency();

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const breadcrumbItems = useMemo(
    () => [
      { label: 'Cakes By Sparrow', href: '/admin' },
      { label: 'Dashboard', href: '/admin/dashboard' },
    ],
    []
  );

  return (
    <div className="min-h-screen">
      <div>
        <BreadcrumbComponent items={breadcrumbItems} />
      </div>

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
                <h3 className="text-2xl font-bold">
                  {formatCurrency(stats.totalRevenue / 100)}
                </h3>
              </div>
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {((stats.totalRevenue / stats.totalOrders) * 100).toFixed(0)}%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={formatMonthlyData(stats.monthlyOrders)}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Active Orders</p>
                <h3 className="text-2xl font-bold">{stats.activeOrders}</h3>
              </div>
              <span
                className={`${
                  stats.newOrders > stats.completedOrders
                    ? 'text-green-500'
                    : 'text-red-500'
                } flex items-center`}
              >
                {stats.newOrders > stats.completedOrders ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.newOrders - stats.completedOrders)}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={formatWeeklyData(stats.weeklyOrders)}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">New Orders</p>
                <h3 className="text-2xl font-bold">{stats.newOrders}</h3>
              </div>
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {((stats.newOrders / stats.totalOrders) * 100).toFixed(0)}%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={formatMonthlyData(stats.monthlyOrders)}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Orders per month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formatMonthlyData(stats.monthlyOrders)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Orders by Year</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatYearlyData(stats.yearlyOrders)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
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
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total price</TableHead>
                <TableHead>Shipping cost</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => {
                const total =
                  order.items?.reduce(
                    (sum, item) => sum + (item.total || 0),
                    0
                  ) || 0;
                const shippingCost =
                  typeof order.shipping_cost === 'string'
                    ? parseFloat(order.shipping_cost)
                    : order.shipping_cost || 0;

                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{order.order_number}</TableCell>
                    <TableCell>{order.customer?.name || 'N/A'}</TableCell>
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
                    <TableCell>${total.toFixed(2)}</TableCell>
                    <TableCell>${shippingCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" asChild>
                        <Link to={`/admin/orders/${order.id}`}>Open</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
