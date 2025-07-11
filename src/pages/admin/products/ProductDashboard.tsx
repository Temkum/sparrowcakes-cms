import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { TagIcon, Cake, BadgeDollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import ProductsTable from './ProductsTable';
import useProductStore from '@/store/product-storeold';

const ProductDashboard = () => {
  const { loadingProducts } = useProductStore();
  const navigate = useNavigate();

  const breadcrumbItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Products', href: '#' },
    ],
    []
  );

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
                disabled={loadingProducts}
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

          {/* Pass skipInitialLoad prop to prevent ProductsTable from loading data */}
          <ProductsTable
            onEdit={handleEdit}
            onView={handleView}
            skipInitialLoad={true}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDashboard;
