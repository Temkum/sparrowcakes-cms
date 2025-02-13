import { useState } from 'react';
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
import { Filter, Search, Edit, ArrowDownAZ } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  town: string;
  phone: string;
}

const customers: Customer[] = [
  {
    id: '1',
    name: 'Ethan Sanford',
    email: 'steuber.woodrow@example.net',
    town: 'Madagascar',
    phone: '986.381.4395',
  },
  {
    id: '2',
    name: 'Prof. Nathan Kiehn Jr.',
    email: 'mollie.huel@example.org',
    town: 'Bonaire, Saint Eustatius and Saba',
    phone: '276-594-4610',
  },
  {
    id: '3',
    name: 'Kristina Wiegand',
    email: 'natalie.hill@example.org',
    town: 'Mozambique',
    phone: '910-372-5087',
  },
  {
    id: '4',
    name: 'Louisa McKenzie DVM',
    email: 'schiller.brannon@example.net',
    town: 'Nigeria',
    phone: '754-524-7077',
  },
  {
    id: '5',
    name: 'Providenci Smith',
    email: 'crodriguez@example.com',
    town: 'Turks and Caicos Islands',
    phone: '(254) 435-1369',
  },
  // ... add more customers as needed
];

const columns = [
  {
    title: 'Name',
    accessorKey: 'name',
  },
  {
    title: 'Email',
    accessorKey: 'email',
  },
  {
    title: 'City',
    accessorKey: 'city',
  },
  {
    title: 'Phone',
    accessorKey: 'phone',
  },
];

export default function Customers() {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    town: '',
    phone: '',
  });

  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      customer.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      customer.town.toLowerCase().includes(filters.town.toLowerCase()) &&
      customer.phone.toLowerCase().includes(filters.phone.toLowerCase())
    );
  });

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
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
          <Button className="bg-orange-500 hover:bg-orange-600">
            New customer
          </Button>
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
                    selectedCustomers.length === paginatedCustomers.length
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCustomers(paginatedCustomers.map((c) => c.id));
                    } else {
                      setSelectedCustomers([]);
                    }
                  }}
                />
              </TableHead>
              {/* Table Headers */}
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>
                  <div className="flex items-center">
                    {column.title}
                    {column.accessorKey !== 'phone' && (
                      <ArrowDownAZ className="h-4 w-4 ml-4" />
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-12"> </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-12"> </TableHead>
              <TableHead className="w-12">
                <Input
                  placeholder="Search"
                  className="my-2"
                  value={filters.name}
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                />
              </TableHead>
              <TableHead className="w-12">
                <Input
                  placeholder="Search"
                  className="my-2"
                  value={filters.email}
                  onChange={(e) =>
                    setFilters({ ...filters, email: e.target.value })
                  }
                />
              </TableHead>
              <TableHead className="w-12">
                <Input
                  placeholder="Search"
                  className="my-2"
                  value={filters.town}
                  onChange={(e) =>
                    setFilters({ ...filters, town: e.target.value })
                  }
                />
              </TableHead>
              <TableHead className="w-12">
                <Input
                  placeholder="Search"
                  className="my-2"
                  value={filters.phone}
                  onChange={(e) =>
                    setFilters({ ...filters, phone: e.target.value })
                  }
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCustomers([
                          ...selectedCustomers,
                          customer.id,
                        ]);
                      } else {
                        setSelectedCustomers(
                          selectedCustomers.filter((id) => id !== customer.id)
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.town}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="ml-2">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of{' '}
          {filteredCustomers.length} results
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Per page</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
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
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
