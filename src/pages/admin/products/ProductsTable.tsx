import { useState, useEffect, useCallback } from 'react';
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
import { Toaster } from 'react-hot-toast';
import { Card } from '@/components/ui/card';

interface ProductTableProps {
  onEdit: (productId: number) => void;
  onView: (productId: number) => void;
  skipInitialLoad?: boolean;
}

const ProductsTable = ({
  onEdit,
  onView,
  skipInitialLoad = false,
}: ProductTableProps) => {
  const {
    products,
    loadingProducts,
    deleting,
    error,
    totalCount,
    currentPage,
    pageSize,
    filter,
    setFilter,
    deleteProduct,
    bulkDeleteProducts,
    loadProducts,
    loadStats,
    setError,
    stats,
  } = useProductStore();

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchInput, setSearchInput] = useState(filter.searchTerm || '');
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedForDeleteId, setSelectedForDeleteId] = useState<number | null>(
    null
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize searchInput when filter changes from external source
  useEffect(() => {
    setSearchInput(filter.searchTerm || '');
  }, [filter.searchTerm]);

  // Initial data loading
  useEffect(() => {
    if (!skipInitialLoad && !isInitialized) {
      const initializeData = async () => {
        try {
          await Promise.all([loadProducts(), loadStats()]);
        } catch (err) {
          console.error('Failed to initialize data:', err);
        } finally {
          setIsInitialized(true);
        }
      };
      initializeData();
    } else if (skipInitialLoad) {
      setIsInitialized(true);
    }
  }, [skipInitialLoad, loadProducts, loadStats, isInitialized]);

  // Reload products when filter changes (except search term which is handled separately)
  useEffect(() => {
    if (isInitialized) {
      loadProducts();
    }
  }, [filter.page, filter.pageSize, loadProducts, isInitialized]);

  // Search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filter.searchTerm) {
        setFilter({
          ...filter,
          searchTerm: searchInput,
          page: 1,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filter, setFilter, isInitialized]);

  // Cleanup error on unmount
  useEffect(() => {
    return () => {
      if (error) {
        setError(null);
      }
    };
  }, [error, setError]);

  const handleSearch = useCallback((searchTerm: string) => {
    setSearchInput(searchTerm);
  }, []);

  const handlePageSizeChange = useCallback(
    async (size: number) => {
      try {
        await setFilter({
          ...filter,
          pageSize: size,
          page: 1,
        });
      } catch (err) {
        console.error('Failed to change page size:', err);
      }
    },
    [setFilter, filter]
  );

  const handlePageChange = useCallback(
    async (page: number) => {
      try {
        await setFilter({
          ...filter,
          page,
        });
      } catch (err) {
        console.error('Failed to change page:', err);
      }
    },
    [setFilter, filter]
  );

  const handleDelete = async (productId: number) => {
    setDeletingProductId(productId);

    try {
      const success = await deleteProduct(productId);

      if (success) {
        setSelectedProducts((prev) => prev.filter((id) => id !== productId));
        // Reload stats after deletion
        await loadStats();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleteDialogOpen(false);
      setDeletingProductId(null);
      setSelectedForDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;

    try {
      const success = await bulkDeleteProducts(selectedProducts);

      if (success) {
        setSelectedProducts([]);
        // Reload stats after bulk deletion
        await loadStats();
      }
    } catch (err) {
      console.error('Failed to bulk delete products:', err);
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const toggleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedProducts(products?.map((product) => product.id!) || []);
      } else {
        setSelectedProducts([]);
      }
    },
    [products]
  );

  const toggleSelectProduct = useCallback(
    (productId: number, checked: boolean) => {
      if (checked) {
        setSelectedProducts((prev) => [...prev, productId]);
      } else {
        setSelectedProducts((prev) => prev.filter((id) => id !== productId));
      }
    },
    []
  );

  const handleRetryLoad = useCallback(async () => {
    setError(null);
    try {
      await Promise.all([loadProducts(), loadStats()]);
    } catch (err) {
      console.error('Retry failed:', err);
    }
  }, [setError, loadProducts, loadStats]);

  const isOperationInProgress =
    loadingProducts || deleting || deletingProductId !== null;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const hasProducts = products && products.length > 0;

  return (
    <>
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          {loadingProducts && !isInitialized ? (
            <div className="flex items-center justify-center h-8">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
          )}
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Active Products</h3>
          {loadingProducts && !isInitialized ? (
            <div className="flex items-center justify-center h-8">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <p className="text-2xl font-bold">{stats?.activeProducts || 0}</p>
          )}
        </Card>
        <Card className="p-4">
          <h3 className="text-sm text-gray-500">Average Price</h3>
          {loadingProducts && !isInitialized ? (
            <div className="flex items-center justify-center h-8">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <p className="text-2xl font-bold">
              ${stats?.averagePrice?.toFixed(2) || '0.00'}
            </p>
          )}
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder="Search products..."
            className="max-w-sm"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={isOperationInProgress}
          />

          {selectedProducts.length > 0 && (
            <AlertDialog
              open={bulkDeleteDialogOpen}
              onOpenChange={setBulkDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isOperationInProgress}>
                  {deleting ? (
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
                    selected product{selectedProducts.length > 1 ? 's' : ''}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={(e) => {
                      e.preventDefault();
                      handleBulkDelete();
                    }}
                    disabled={deleting}
                  >
                    {deleting ? (
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
                      hasProducts && selectedProducts.length === products.length
                    }
                    onCheckedChange={toggleSelectAll}
                    disabled={isOperationInProgress || !hasProducts}
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingProducts && !isInitialized && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-10 rounded" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}

              {!loadingProducts && !hasProducts && !error && isInitialized && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              )}

              {!loadingProducts && error && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-red-600">
                        Failed to load products
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetryLoad}
                      >
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {isInitialized &&
                hasProducts &&
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
                        {product.imageUrls && product.imageUrls.length > 0 ? (
                          <img
                            src={product.imageUrls[0]}
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
                        {product.isActive ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {product.createdAt
                          ? format(new Date(product.createdAt), 'MMM dd, yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {product.price ? `$${product.price.toFixed(2)}` : '-'}
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
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onView(product.id!)}
                              disabled={isDeleting}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onEdit(product.id!)}
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
                                  onClick={() => {
                                    setSelectedForDeleteId(product.id!);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete "{product.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
              disabled={isOperationInProgress}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
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
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={
                currentPage === totalPages ||
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
