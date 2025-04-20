import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TagIcon, Cake, BadgeDollarSign } from 'lucide-react';
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
  const { stats, loadProducts, loadStats } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Load both products and stats when component mounts
    const loadData = async () => {
      await loadProducts();
      await loadStats();
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
              <Button className="bg-orange-500 hover:bg-orange-600">
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
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm text-gray-500">Active Products</h3>
              <p className="text-2xl font-bold">{stats.activeProducts}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm text-gray-500">Average price</h3>
              <p className="text-2xl font-bold">
                ${stats.averagePrice.toFixed(2)}
              </p>
            </Card>
          </div>

          {/* Products Table */}
          {/* <Card>
            <Table className="h-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === products.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts(
                            products.map((product) => product.id)
                          );
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProducts([
                              ...selectedProducts,
                              product.id,
                            ]);
                          } else {
                            setSelectedProducts(
                              selectedProducts.filter((id) => id !== product.id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {product.display ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Per page</span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Next</Button>
            </div>
          </Card> */}

          <ProductsTable onEdit={handleEdit} onView={handleView} />
        </div>
      </div>
    </>
  );
};

export default ProductDashboard;
