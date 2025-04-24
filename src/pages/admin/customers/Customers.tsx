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
import { Filter, Search, Loader2 } from 'lucide-react';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import { Link } from 'react-router-dom';
import CreateCustomerModal from './CreateCustomerModal';
import useCustomerStore from '@/store/customer-store';
import { format } from 'date-fns';
import { Customer } from '@/types/customer';

export default function Customers() {
  const { customers, loading, filter, setFilter, loadCustomers, totalCount } =
    useCustomerStore();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(totalCount / filter.pageSize));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpen(true);
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

        {/* Global Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-[400px] bg-white">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search" className="pl-10" />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
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
                    checked={false} // or implement a selectedCustomers array
                    onCheckedChange={() => {}}
                  />
                </TableHead>
                {/* Table Headers */}
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Created At</TableHead>
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
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
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
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Show pagination only when we have customers */}
        {customers && customers.length > 0 && (
          <div className="mt-4 flex items-center justify-end gap-4">
            <div className="text-sm text-gray-500">
              Showing {(filter.page - 1) * filter.pageSize + 1} to{' '}
              {Math.min(filter.page * filter.pageSize, totalCount)} of{' '}
              {totalCount} results
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Per page</span>
                <Select
                  value={filter.pageSize.toString()}
                  onValueChange={(value) =>
                    setFilter({ pageSize: Number(value) })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-1">
                {pages.map((page) => (
                  <Button
                    key={page}
                    variant={filter.page === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter({ page })}
                  >
                    {page}
                  </Button>
                ))}
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
