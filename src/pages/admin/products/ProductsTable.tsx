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
  Loader2,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProductTableProps {
  onEdit: (productId: number) => void;
  onView: (productId: number) => void;
}

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
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedForDeleteId, setSelectedForDeleteId] = useState<number | null>(
    null
  );

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

  const handleDelete = async (productId: number) => {
    try {
      setDeletingProductId(productId);
      const success = await deleteProduct(productId);
      if (success) {
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteDialogOpen(false);
      setDeletingProductId(null);
      setSelectedForDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    setIsBulkDeleting(true);
    try {
      const success = await bulkDeleteProducts(selectedProducts);
      if (success) {
        toast.success(
          `${selectedProducts.length} product(s) deleted successfully`
        );
        setSelectedProducts([]);
      } else {
        toast.error('Failed to delete selected products');
      }
    } catch (error: unknown) {
      console.error('Error bulk deleting products:', error);
      
      let errorMessage = 'Failed to delete selected products';
      
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === 'object' && error !== null) {
        // Handle API error response structure
        const apiError = error as { response?: { data?: { message?: string } } };
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsBulkDeleting(false);
      setBulkDeleteDialogOpen(false);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products?.map((product) => product.id!) || []);
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

  const isOperationInProgress =
    loading || isBulkDeleting || deletingProductId !== null;

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search products..."
            className="max-w-sm"
            value={filter.searchTerm || ''}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={isOperationInProgress}
          />

          {selectedProducts.length > 0 && (
            <AlertDialog
              open={bulkDeleteDialogOpen}
              onOpenChange={setBulkDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isOperationInProgress}
                  onClick={() => setBulkDeleteDialogOpen(true)}
                >
                  {isBulkDeleting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin w-4 h-4" />
                      Processing...
                    </span>
                  ) : (
                    `Delete Selected (${selectedProducts.length})`
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {selectedProducts.length}{' '}
                    selected product
                    {selectedProducts.length > 1 ? 's' : ''}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isBulkDeleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={(e) => {
                      e.preventDefault();
                      handleBulkDelete();
                    }}
                    disabled={isBulkDeleting}
                  >
                    {isBulkDeleting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Deleting...
                      </span>
                    ) : (
                      'Delete'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                    disabled={isOperationInProgress || products.length === 0}
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Date added</TableHead>
                <TableHead>Price</TableHead>
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
                products.map((product) => {
                  const isDeleting = deletingProductId === product.id;

                  return (
                    <TableRow key={product.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id!)}
                          onCheckedChange={(checked) =>
                            toggleSelectProduct(product.id!, checked as boolean)
                          }
                          disabled={isOperationInProgress}
                        />
                      </TableCell>
                      <TableCell>
                        {(product.image_urls && product.image_urls.length > 0) ? (
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
                            <span className="text-xs text-gray-500">
                              No image
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="font-medium hover:underline"
                          onClick={(e) => {
                            if (isOperationInProgress) {
                              e.preventDefault();
                              return;
                            }
                            onView(product.id!);
                          }}
                        >
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {(product.isActive || product.is_active) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {(product.createdAt || product.created_at)
                          ? format(new Date(product.createdAt || product.created_at || ''), 'MMM dd, yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {product.price ? `$${product.price}` : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isOperationInProgress}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onView(product.id!);
                              }}
                              disabled={isDeleting}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(product.id!);
                              }}
                              disabled={isDeleting}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <AlertDialog
                              open={
                                deleteDialogOpen &&
                                selectedForDeleteId === product.id
                              }
                              onOpenChange={(open) => {
                                if (!open) {
                                  setDeleteDialogOpen(false);
                                  setSelectedForDeleteId(null);
                                }
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <button
                                  type="button"
                                  className="text-red-600 cursor-pointer flex items-center bg-transparent border-none p-2 w-full text-left hover:bg-gray-100 rounded-sm text-sm"
                                  disabled={isDeleting}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedForDeleteId(product.id!);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent
                                onClick={(e) => e.stopPropagation()}
                              >
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete this product.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    onClick={() => {
                                      setDeleteDialogOpen(false);
                                      setSelectedForDeleteId(null);
                                    }}
                                    disabled={deletingProductId === product.id}
                                  >
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDelete(product.id!);
                                    }}
                                    disabled={deletingProductId === product.id}
                                  >
                                    {deletingProductId === product.id ? (
                                      <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Deleting...
                                      </span>
                                    ) : (
                                      'Delete'
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
                handlePageSizeChange(newLimit);
              }}
              disabled={isOperationInProgress}
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
              disabled={currentPage === 1 || isOperationInProgress}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {Math.ceil(totalCount / pageSize) || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(totalCount / pageSize) ||
                isOperationInProgress ||
                totalCount === 0
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsTable;
