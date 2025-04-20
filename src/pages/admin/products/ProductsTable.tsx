// components/products/ProductTable.tsx
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Eye,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import useProductStore from '@/store/product-store';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductTableProps {
  onEdit: (productId: number) => void;
  onView: (productId: number) => void;
}
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProductsTable = ({ onEdit, onView }: ProductTableProps) => {
  const {
    products,
    loading,
    totalCount,
    currentPage,
    pageSize,
    filter,
    setFilter,
    deleteProduct,
    bulkDeleteProducts,
    loadProducts,
  } = useProductStore();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [limit, setLimit] = useState<number>(pageSize);

  // Handle filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [filter, loadProducts]);

  const handleSearch = (searchTerm: string) => {
    setFilter({ searchTerm, page: 1 });
  };

  const handlePageSizeChange = (size: number) => {
    setFilter({ pageSize: size, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilter({ page });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      await bulkDeleteProducts(selectedProducts.map(String));
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      toast.error('Failed to delete selected products');
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products?.map((product) => product.id!));
    } else {
      setSelectedProducts([]);
    }
  };

  const toggleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search products..."
          className="max-w-sm"
          value={filter.searchTerm || ''}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {selectedProducts.length > 0 && (
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={loading}
          >
            Delete Selected ({selectedProducts.length})
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedProducts.length > 0 &&
                    selectedProducts.length === products.length
                  }
                  onCheckedChange={toggleSelectAll}
                  disabled={loading || products.length === 0}
                />
              </TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Last updated</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id!)}
                      onCheckedChange={(checked) =>
                        toggleSelectProduct(product.id!, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {product.image_urls && product.image_urls.length > 0 ? (
                      <img
                        src={product.image_urls[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-image.png';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="font-medium hover:underline"
                      onClick={() => onView(product.id!)}
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {product.is_active ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {product.created_at
                      ? format(new Date(product.created_at), 'MMM dd, yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {product.updated_at
                      ? format(new Date(product.updated_at), 'MMM dd, yyyy')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(product.id!)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(product.id!)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(product.id!)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              const newLimit = Number(value);
              setLimit(newLimit);
              handlePageSizeChange(newLimit); // Ensure the page size is updated in the filter
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {Math.ceil(totalCount / pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(totalCount / pageSize) || loading
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
