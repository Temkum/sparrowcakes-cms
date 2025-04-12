import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/auth';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Eye, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ProductsTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { token } = useAuthStore();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/products`, {
        params: {
          page,
          limit,
          search: debouncedSearchTerm || undefined,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearchTerm, token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (productId: string) => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Product deleted successfully');
      await fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    setIsDeleting(true);

    try {
      await Promise.all(
        selectedProducts.map((id) =>
          axiosInstance.delete(`${API_BASE_URL}/products/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      await fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete some products');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            setSelectedProducts(
              value ? products.map((product) => product.id) : []
            );
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            setSelectedProducts((prev) =>
              value
                ? [...prev, row.original.id]
                : prev.filter((id) => id !== row.original.id)
            );
          }}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          to={`/products/${row.original.slug}`}
          className="font-medium hover:text-orange-600"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
    },
    {
      accessorKey: 'isVisible',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isVisible ? 'default' : 'secondary'}>
          {row.original.isVisible ? 'Visible' : 'Hidden'}
        </Badge>
      ),
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) =>
        format(new Date(row.original.updatedAt), 'MMM dd, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProduct(row.original);
              setEditModalOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={() => handleDelete(row.original.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search products..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/admin/products/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            Add Product
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        page={page}
        totalPages={Math.ceil(total / limit)}
        onPageChange={setPage}
        selectedItems={selectedProducts}
        onBulkDelete={handleBulkDelete}
      />

      <ProductFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={fetchProducts}
        product={selectedProduct}
        mode="edit"
      />
    </div>
  );
};
