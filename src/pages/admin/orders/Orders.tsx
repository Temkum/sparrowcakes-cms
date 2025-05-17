import React, { useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import { Link } from 'react-router-dom';
import OrdersTable from './OrdersTable';
import useOrderStore from '@/store/order-store';
import { Loader2 } from 'lucide-react';
import type { OrderStats } from '@/types/order';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Orders', href: '#' },
];

const EMPTY_STATS: OrderStats = {
  totalOrders: 0,
  activeOrders: 0,
  newOrders: 0,
  completedOrders: 0,
  totalRevenue: 0,
  averageOrderValue: 0,
  weeklyOrders: [],
  monthlyOrders: [],
  yearlyOrders: [],
  topProducts: [],
  topCustomers: [],
};

const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <Card className="p-4 text-red-600">
    <p>Error loading statistics:</p>
    <pre className="text-sm">{error.message}</pre>
  </Card>
);

const OrdersPage: React.FC = () => {
  const { stats = EMPTY_STATS, loadStats, loading } = useOrderStore();

  const formatCurrency = useCallback(
    (amount: number, currency: string = 'XAF'): string => {
      const localeMap: Record<string, string> = {
        XAF: 'fr-FR', // Franc CFA BEAC
        USD: 'en-US',
        EUR: 'fr-FR',
        GBP: 'en-GB',
        XOF: 'fr-FR', // Franc CFA BCEAO
      };

      try {
        const locale = localeMap[currency] || 'en';

        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          currencyDisplay: 'symbol',
        }).format(amount);
      } catch (error) {
        console.error('Failed to format currency:', error);
        return `${amount.toFixed(2)} ${currency}`;
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;

    const loadStatsData = async () => {
      try {
        await loadStats();
      } catch (err) {
        if (mounted) {
          console.error('Failed to load stats:', err);
        }
      }
    };

    loadStatsData();

    // Cleanup function to prevent memory leaks
    return () => {
      mounted = false;
    };
  }, [loadStats]);

  const statCardContent = useMemo(
    () => ({
      totalOrders: {
        label: 'Total Orders',
        value: stats.totalOrders,
        ariaLabel: 'Total number of orders',
      },
      activeOrders: {
        label: 'Active Orders',
        value: stats.activeOrders,
        ariaLabel: 'Number of active orders',
      },
      totalRevenue: {
        label: 'Total Revenue',
        value: formatCurrency(stats.totalRevenue),
        ariaLabel: 'Total revenue from all orders',
      },
      averageOrderValue: {
        label: 'Average Order Value',
        value: formatCurrency(stats.averageOrderValue),
        ariaLabel: 'Average value per order',
      },
    }),
    [stats, formatCurrency]
  );

  const renderStatCard = useCallback(
    ({
      label,
      value,
      ariaLabel,
    }: {
      label: string;
      value: string | number;
      ariaLabel: string;
    }) => (
      <Card className="p-4" role="status" aria-label={ariaLabel}>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        {loading ? (
          <div className="flex items-center justify-center" aria-busy="true">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <p className="text-2xl font-semibold">{value}</p>
        )}
      </Card>
    ),
    [loading]
  );

  const renderProductsList = useMemo(
    () => (
      <div className="space-y-3">
        {stats.topProducts?.map((product) => (
          <div
            key={product.productId}
            className="flex justify-between items-center border-b pb-2"
            role="listitem"
            aria-label={`${product.productName} sales information`}
          >
            <div>
              <p className="font-medium">{product.productName}</p>
              <p className="text-sm text-gray-500">
                {product.totalQuantity} units sold
              </p>
            </div>
            <p className="font-medium">{formatCurrency(product.totalSales)}</p>
          </div>
        ))}
      </div>
    ),
    [stats.topProducts, formatCurrency]
  );

  const renderCustomersList = useMemo(
    () => (
      <div className="space-y-3">
        {stats.topCustomers?.map((customer) => (
          <div
            key={customer.customerId}
            className="flex justify-between items-center border-b pb-2"
            role="listitem"
            aria-label={`${customer.customerName}'s order information`}
          >
            <div>
              <p className="font-medium">{customer.customerName}</p>
              <p className="text-sm text-gray-500">
                {customer.totalOrders} orders
              </p>
            </div>
            <p className="font-medium">{formatCurrency(customer.totalSpent)}</p>
          </div>
        ))}
      </div>
    ),
    [stats.topCustomers, formatCurrency]
  );

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="p-6 max-w-[1280px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <Link to="/admin/orders/new">
            <Button className="bg-orange-500 hover:bg-orange-600">
              New order
            </Button>
          </Link>
        </div>

        <ErrorBoundary fallback={<ErrorFallback error={new Error('Failed to load statistics')} />}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(statCardContent).map(([key, content]) => (
              <React.Fragment key={key}>
                {renderStatCard(content)}
              </React.Fragment>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4" id="top-products">
                Top Products
              </h3>
              <div role="list" aria-labelledby="top-products">
                {loading ? (
                  <div
                    className="flex items-center justify-center py-4"
                    aria-busy="true"
                  >
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  renderProductsList
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4" id="top-customers">
                Top Customers
              </h3>
              <div role="list" aria-labelledby="top-customers">
                {loading ? (
                  <div
                    className="flex items-center justify-center py-4"
                    aria-busy="true"
                  >
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  renderCustomersList
                )}
              </div>
            </Card>
          </div>
        </ErrorBoundary>

        <OrdersTable />
      </div>
    </>
  );
};

export default React.memo(OrdersPage);
