import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  ChevronDown,
  Edit,
  CheckCircle,
  XCircle,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: 'asc' | 'desc';
  }>({ field: 'name', direction: 'asc' });

  // Fetch categories with sorting and pagination
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        params: {
          page,
          limit,
          sortBy: sortConfig.field,
          sortOrder: sortConfig.direction,
        },
      });
      setCategories(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, sortConfig]);

  useEffect(() => {
    fetchCategories();
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(1); // Reset to first page when sorting changes
  };

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig.field !== field)
      return <ChevronDown className="h-4 w-4 opacity-50" />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="font-bold text-black-600 hover:bg-gray-100 bg-gray-200">
            <TableHead className="w-12">
              <Checkbox
                aria-label="Select all categories"
                checked={
                  selectedCategories.length === categories.length &&
                  categories.length > 0
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCategories(categories.map((c) => c.id));
                  } else {
                    setSelectedCategories([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead>
              <button
                className="flex items-center justify-between w-full"
                onClick={() => handleSort('name')}
              >
                Name
                <SortIcon field="name" />
              </button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>
              <button
                className="flex items-center justify-between w-full"
                onClick={() => handleSort('isActive')}
              >
                Visibility
                <SortIcon field="isActive" />
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center justify-between w-full"
                onClick={() => handleSort('updatedAt')}
              >
                Last Updated
                <SortIcon field="updatedAt" />
              </button>
            </TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading categories...
                </div>
              </TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${category.name}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([
                          ...selectedCategories,
                          category.id,
                        ]);
                      } else {
                        setSelectedCategories(
                          selectedCategories.filter((id) => id !== category.id)
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <img
                    src={category.imageUrl || '/placeholder-image.png'}
                    alt={category.name}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/placeholder-image.png';
                    }}
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {category.description || '-'}
                </TableCell>
                <TableCell>
                  {category.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(category.updated_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-500 hover:text-orange-600"
                    // onClick={() => handleEdit(category.id)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Enhanced Pagination */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              setLimit(Number(value));
              setPage(1);
            }}
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && <span className="px-2">...</span>}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={page >= totalPages}
            >
              Last
            </Button>
          </div>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
}
