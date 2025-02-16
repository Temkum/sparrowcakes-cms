import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  XCircle,
  MoreVertical,
  TagIcon,
  Cake,
  BadgeDollarSign,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { products } from '@/utilities/data';
import { Link } from 'react-router-dom';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';

const initialStats: ProductStats = {
  totalProducts: 50,
  productInventory: 272,
  averagePrice: 247.07,
};

const breadcrumbItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  { label: 'Products', href: '#' },
];

const ProductDashboard = () => {
  // const [products, setProducts] = React.useState<Product[]>([]);
  const [stats, setStats] = React.useState<ProductStats>(initialStats);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mx-auto h-full w-full px-4 md:px-6 lg:px-8 xl:max-w-7xl">
        <div className="p-6 min-h-[100vh] flex-1 rounded-xl md:min-h-min ">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <Button className="bg-orange-500 hover:bg-orange-600">
              New product
            </Button>
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
              <p className="text-2xl font-bold">{products.length}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm text-gray-500">Product Inventory</h3>
              <p className="text-2xl font-bold">{stats.productInventory}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm text-gray-500">Average price</h3>
              <p className="text-2xl font-bold">
                ${stats.averagePrice.toFixed(2)}
              </p>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6 justify-end">
            <Input
              className="w-full md:w-1/3"
              placeholder="Search"
              type="search"
            />
          </div>

          {/* Products Table */}
          <Card>
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

            {/* Pagination */}
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
          </Card>
        </div>
      </div>
    </>
  );
};

export default ProductDashboard;
