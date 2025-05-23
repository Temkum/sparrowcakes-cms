import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TagIcon, Cake, BadgeDollarSign, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import ProductsTable from './ProductsTable';
import useProductStore from '@/store/product-store';

const breadcrumbItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  { label: 'Products', href: '#' },
];

const ProductDashboard = () => {
  const { stats, loadProducts, loadStats, loading } = useProductStore();
  const navigate = useNavigate();
  // const totalProducts = stats?.totalProducts ?? 0;
  // const activeProducts = stats?.activeProducts ?? 0;
  // const averagePrice = Number(stats?.averagePrice || 0).toFixed(2);

  useEffect(() => {
    // Load both products and stats when component mounts
    const loadData = async () => {
      try {
        await Promise.all([loadProducts(), loadStats()]);
      } catch (error) {
        console.error('Error loading product data:', error);
      }
    };
    loadData();
  }, [loadProducts, loadStats]);

  const handleEdit = (productId: number) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleView = (productId: number) => {
    navigate(`/admin/products/${productId}`);
  };

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mx-auto h-full w-full px-4 md:px-6 lg:px-8 xl:max-w-7xl">
        <div className="p-6 min-h-[100vh] flex-1 rounded-xl md:min-h-min ">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <Link to="/admin/products/new">
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                New product
              </Button>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mb-6">
            <Button variant="ghost" className="flex items-center gap-2">
              <Cake className="w-4 h-4" />
              Products
            </Button>
            <Link to="/admin/categories">
              <Button variant="outline" className="flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Categories
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline" className="flex items-center gap-2">
                <BadgeDollarSign className="w-4 h-4" />
                Orders
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <h3 className="text-sm text-gray-500">Total Products</h3>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <p className="text-2xl font-bold">
                  {stats?.totalProducts || 0}
                </p>
              )}
            </Card>
            <Card className="p-4">
              <h3 className="text-sm text-gray-500">Active Products</h3>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <p className="text-2xl font-bold">
                  {stats?.activeProducts || 0}
                </p>
              )}
              {/* <p className="text-2xl font-bold">{activeProducts}</p> */}
            </Card>
            <Card className="p-4">
              <h3 className="text-sm text-gray-500">Average price</h3>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <p className="text-2xl font-bold">
                  ${Number(stats?.averagePrice || 0).toFixed(2)}
                </p>
              )}
            </Card>
          </div>

          <ProductsTable onEdit={handleEdit} onView={handleView} />
        </div>
      </div>
    </>
  );
};

export default ProductDashboard;
