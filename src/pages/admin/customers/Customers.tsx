import { useEffect, useMemo, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Filter,
  Search,
  Loader2,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
} from 'lucide-react';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import { Link } from 'react-router-dom';
import CreateCustomerModal from './CreateCustomerModal';
import useCustomerStore from '@/store/customer-store';
import { format } from 'date-fns';
import { Customer } from '@/types/customer';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/store/auth';
import { customerService } from '@/services/customers.service';
import toast from 'react-hot-toast';

export default function Customers() {
  const { customers, loading, filter, setFilter, loadCustomers, totalCount } =
    useCustomerStore();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);

  const [searchValue, setSearchValue] = useState(filter.searchTerm || '');
  const debouncedSearch = useDebounce(searchValue, 400);

  useEffect(() => {
    setFilter({ searchTerm: debouncedSearch, page: 1 });
  }, [debouncedSearch, setFilter]);

  useEffect(() => {
    loadCustomers();
  }, [filter, loadCustomers]);

  const totalPages = Math.max(1, Math.ceil(totalCount / filter.pageSize));

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && customers) {
      setSelectedCustomers(customers.map((c) => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: number, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId));
    }
  };

  const handleExport = () => {
    if (selectedCustomers.length === 0) return;

    const customersToExport = customers.filter(
      (c) => c && selectedCustomers.includes(c.id)
    );

    if (customersToExport.length === 0) return;

    const csvData = customersToExport.map((c) => ({
      name: c.name,
      phone: c.phone,
      occupation: c.occupation,
      city: c.city,
      email: c.email,
      created_at: format(new Date(c.created_at), 'PP'),
    }));

    const csvString = [
      Object.keys(csvData[0]).join(';'),
      ...csvData.map((row) => Object.values(row).join(';')),
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteSelected = async () => {
    if (selectedCustomers.length === 0) return;

    try {
      const { token } = useAuthStore.getState(); // Ensure token is available

      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      await customerService.deleteCustomers(selectedCustomers, token);
      toast.success(
        `${selectedCustomers.length} ${
          selectedCustomers.length > 1 ? 'customers' : 'customer'
        } deleted successfully`
      );
      setSelectedCustomers([]);
      loadCustomers(); // Refresh the customer list
    } catch (error) {
      console.error('Error deleting customers:', error);
      toast.error('Failed to delete selected customers');
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilter({ page: newPage });
  };

  const breadcrumbItems = useMemo(
    () => [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Customers', href: '#' },
    ],
    []
  );

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="w-full p-6 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">Customers</h1>
        </div>

        {/* Global Search and Actions */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-[400px] bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search customers..."
              className="pl-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          {selectedCustomers.length > 0 && (
            <>
              <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                className="flex items-center gap-2"
              >
                <span>Delete Selected ({selectedCustomers.length})</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export ({selectedCustomers.length})
              </Button>
            </>
          )}
          <div className="ml-auto">
            <Link to="/admin/customers/new">
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => {
                  setSelectedCustomer(null);
                  setOpen(true);
                }}
              >
                New customer
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader className="">
              <TableRow className="h-9 bg-slate-200">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      customers && selectedCustomers.length === customers.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {/* Table Headers */}
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : !customers || customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                (customers || []).map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) =>
                          handleSelectCustomer(customer.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={customer.image_url || '/placeholder.svg'}
                        alt={customer.name}
                        className="w-10 h-10 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/placeholder.svg';
                        }}
                      />
                    </TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.occupation}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>
                      {format(new Date(customer.created_at), 'PP')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => handleEditCustomer(customer)}
                        aria-label={`Edit ${customer.name}`}
                        className="hover:bg-orange-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {customers && customers.length > 0 && (
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                Showing {(filter.page - 1) * filter.pageSize + 1} to{' '}
                {Math.min(filter.page * filter.pageSize, totalCount)} of{' '}
                {totalCount} results
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm">Rows per page</p>
                <Select
                  value={filter.pageSize.toString()}
                  onValueChange={(value) => {
                    setFilter({ pageSize: Number(value), page: 1 });
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={filter.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 50, 100].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {filter.page} of {totalPages}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => handlePageChange(1)}
                  disabled={filter.page === 1}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(filter.page - 1)}
                  disabled={filter.page === 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePageChange(filter.page + 1)}
                  disabled={filter.page >= totalPages}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={filter.page >= totalPages}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <CreateCustomerModal
          open={open}
          onOpenChange={setOpen}
          mode={selectedCustomer ? 'edit' : 'create'}
          customer={selectedCustomer}
          onSuccess={() => {
            loadCustomers();
            setSelectedCustomer(null);
          }}
        />
      </div>
    </>
  );
}
