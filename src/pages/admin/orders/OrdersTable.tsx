import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/useDebounce';
import { OrderStatus, Order } from '@/types/order';
import { toast } from 'react-hot-toast';
import useOrderStore from '@/store/order-store';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  ArrowDown,
  ArrowUp,
  Download,
  X,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';

type StatusFilter = OrderStatus | 'all';

const OrdersTable: React.FC = () => {
  const navigate = useNavigate();
  const {
    orders,
    loading,
    totalCount,
    filter,
    setFilter,
    loadOrders,
    deleteOrders,
    resetFilter,
    exportOrders,
  } = useOrderStore();

  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [currentStatus, setCurrentStatus] = useState<StatusFilter>('all');
  const [searchValue, setSearchValue] = useState(filter.searchTerm || '');
  const debouncedSearch = useDebounce(searchValue, 600);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<
    'csv' | 'xlsx' | 'pdf' | null
  >(null);

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearch !== filter.searchTerm) {
      setFilter({
        searchTerm: debouncedSearch,
        page: 1,
      });
    }
  }, [debouncedSearch, filter.searchTerm, setFilter]);

  useEffect(() => {
    loadOrders();
  }, [filter, loadOrders]);

  // Update status filter state when filter changes from outside this component
  useEffect(() => {
    setCurrentStatus(filter.status || 'all');
  }, [filter.status]);

  // Enhance status filter handling
  const handleStatusFilter = (status: StatusFilter) => {
    setCurrentStatus(status);
    setFilter({
      status: status === 'all' ? undefined : status,
      page: 1,
    });
  };

  const calculateOrderTotal = (order: Order) => {
    if (!order.items) return 0;

    const itemsTotal = order.items.reduce((sum, item) => {
      const itemTotal = item.total || item.quantity * item.unit_price;
      return sum + itemTotal;
    }, 0);

    const shippingCost =
      typeof order.shipping_cost === 'string'
        ? parseFloat(order.shipping_cost)
        : order.shipping_cost || 0;

    return itemsTotal + shippingCost;
  };

  const handleEdit = (orderId: number) => {
    navigate(`/admin/orders/${orderId}/edit`);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!orders) return;
    setSelectedOrders(checked ? orders.map((order) => order.id) : []);
  };

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSoftDelete = async () => {
    if (selectedOrders.length === 0) return;
    setDeleting(true);
    try {
      await deleteOrders(selectedOrders);
      setSelectedOrders([]);
      toast.success('Orders deleted successfully');
    } catch (error) {
      console.error('Failed to delete orders:', error);
      toast.error('Failed to delete orders');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Handle sorting
  const handleSort = (columnName: string) => {
    const newDirection =
      filter.sortBy === columnName && filter.sortDirection === 'ASC'
        ? 'DESC'
        : 'ASC';

    setFilter({
      sortBy: columnName,
      sortDirection: newDirection,
    });
  };

  // Render sort indicator
  const renderSortIndicator = (columnName: string) => {
    if (filter.sortBy !== columnName) return null;

    return filter.sortDirection === 'ASC' ? (
      <ArrowUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 inline ml-1" />
    );
  };

  // Enhanced export handler with progress tracking
  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    setExporting(true);
    setExportFormat(format);
    setExportProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Use the store's exportOrders method
      const success = await exportOrders(format, selectedOrders);

      clearInterval(progressInterval);
      setExportProgress(100);

      if (success) {
        toast.success(
          `Successfully exported ${
            selectedOrders.length > 0
              ? `${selectedOrders.length} selected orders`
              : 'all filtered orders'
          } as ${format.toUpperCase()}`
        );
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export orders as ${format.toUpperCase()}`);
    } finally {
      // Reset export state after a short delay
      setTimeout(() => {
        setExporting(false);
        setExportProgress(0);
        setExportFormat(null);
      }, 1500);
    }
  };

  const handleClearFilters = () => {
    resetFilter();
    setSearchValue('');
    setCurrentStatus('all');
  };

  const hasActiveFilters =
    filter.searchTerm ||
    filter.status ||
    filter.sortBy !== 'created_at' ||
    filter.sortDirection === 'ASC';

  /*   const getExportButtonText = (format: 'csv' | 'xlsx' | 'pdf') => {
    if (exporting && exportFormat === format) {
      return `Exporting... ${exportProgress}%`;
    }
    return format.toUpperCase();
  };

  const getExportIcon = (format: 'csv' | 'xlsx' | 'pdf') => {
    if (exporting && exportFormat === format) {
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }

    switch (format) {
      case 'csv':
        return <FileText className="mr-2 h-4 w-4" />;
      case 'xlsx':
        return <FileSpreadsheetIcon className="mr-2 h-4 w-4" />;
      case 'pdf':
        return <FileText className="mr-2 h-4 w-4" />;
      default:
        return <Download className="mr-2 h-4 w-4" />;
    }
  };
 */
  return (
    <>
      {/* Status Filters */}
      <div className="flex gap-2 mb-6 justify-center">
        <div className="border rounded-md text-gray-500">
          <Button
            variant="ghost"
            className={currentStatus === 'all' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'New' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('New')}
          >
            New
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'Processing' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('Processing')}
          >
            Processing
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'Shipped' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('Shipped')}
          >
            Shipped
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'Delivered' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('Delivered')}
          >
            Delivered
          </Button>
          <Button
            variant="ghost"
            className={currentStatus === 'Cancelled' ? 'text-orange-500' : ''}
            onClick={() => handleStatusFilter('Cancelled')}
          >
            Cancelled
          </Button>
        </div>
      </div>

      {/* Orders Table and Controls */}
      <Card>
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search orders..."
              className="w-[300px]"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-gray-500"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Export Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={exporting}
                  className="flex items-center gap-2"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export
                      {selectedOrders.length > 0 && (
                        <span className="ml-1 bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
                          {selectedOrders.length}
                        </span>
                      )}
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleExport('csv')}
                  disabled={exporting}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport('xlsx')}
                  disabled={exporting}
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport('pdf')}
                  disabled={exporting}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Actions for Selected Orders */}
            {selectedOrders.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2"
              >
                Delete ({selectedOrders.length})
              </Button>
            )}

            <Select
              value={String(filter.pageSize)}
              onValueChange={(value) =>
                setFilter({ pageSize: Number(value), page: 1 })
              }
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Export Progress Bar */}
        {exporting && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>
                Exporting{' '}
                {selectedOrders.length > 0
                  ? `${selectedOrders.length} selected orders`
                  : 'all filtered orders'}{' '}
                as {exportFormat?.toUpperCase()}...
              </span>
              <span>{exportProgress}%</span>
            </div>
            <Progress value={exportProgress} className="h-2" />
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="font-bold text-black-600 bg-gray-200">
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={
                    orders.length > 0 && selectedOrders.length === orders.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-300"
                onClick={() => handleSort('order_number')}
              >
                Number {renderSortIndicator('order_number')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-300"
                onClick={() => handleSort('customer_id')}
              >
                Customer {renderSortIndicator('customer_id')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-300"
                onClick={() => handleSort('status')}
              >
                Status {renderSortIndicator('status')}
              </TableHead>
              <TableHead>Currency</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-300"
                onClick={() => handleSort('items')}
              >
                Total Amount {renderSortIndicator('items')}
              </TableHead>
              <TableHead>Shipping Cost</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-300"
                onClick={() => handleSort('created_at')}
              >
                Date {renderSortIndicator('created_at')}
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  No orders found
                  {filter.searchTerm && (
                    <>
                      {' '}
                      for "<strong>{filter.searchTerm}</strong>"
                    </>
                  )}
                  {filter.status && (
                    <>
                      {' '}
                      with status "<strong>{filter.status}</strong>"
                    </>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const totalAmount = calculateOrderTotal(order);
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOrder(order.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link to={`/admin/orders/${order.id}`}>
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {order.customer?.name || `Customer ${order.customer_id}`}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            order.status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>{order.currency}</TableCell>
                    <TableCell>
                      {totalAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      {typeof order.shipping_cost === 'string'
                        ? parseFloat(order.shipping_cost).toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : order.shipping_cost.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="text-orange-500 hover:text-orange-600"
                        onClick={() => handleEdit(order.id)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing {orders.length} of {totalCount} orders
            {selectedOrders.length > 0 && (
              <span className="ml-2 text-orange-600 font-medium">
                ({selectedOrders.length} selected)
              </span>
            )}
            {filter.pageSize < totalCount && (
              <>
                {' '}
                (Page {filter.page} of {Math.ceil(totalCount / filter.pageSize)}
                )
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter({ page: Math.max(1, filter.page - 1) })}
              disabled={filter.page <= 1}
            >
              Previous
            </Button>

            <div className="text-sm">
              Page {filter.page} of {Math.ceil(totalCount / filter.pageSize)}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilter({ page: filter.page + 1 })}
              disabled={filter.page >= Math.ceil(totalCount / filter.pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Orders</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedOrders.length} selected
              order{selectedOrders.length > 1 ? 's' : ''}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSoftDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrdersTable;
