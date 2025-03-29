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
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth';
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
} from './ui/alert-dialog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategoriesTable = () => {
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
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useAuthStore();

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
  }, [fetchCategories]);

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

  const handleDelete = async (categoryId: string) => {
    setIsDeleting(false);
    try {
      await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Category deleted successfully');
      await fetchCategories(); // Refresh the list after deletion
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete category. Please try again later!', {
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;
    setIsDeleting(true);

    try {
      await Promise.all(
        selectedCategories.map((id) =>
          axios.delete(`${API_BASE_URL}/categories/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );
      toast.success(
        `${selectedCategories.length} categories deleted successfully`
      );
      setSelectedCategories([]);
      await fetchCategories(); // Refresh the list after deletion
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete some categories. Please try again later!', {
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
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
      {/* Add bulk actions toolbar */}
      {/* {selectedCategories.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-gray-100 border-b">
          <div className="text-sm">{selectedCategories.length} selected</div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isDeleting !== null}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash className="mr-2 h-4 w-4" />
            )}
            Delete Selected
          </Button>
        </div>
      )} */}

      {selectedCategories.length > 0 && (
        <div className="p-4 bg-gray-100 flex justify-between items-center">
          <span className="text-sm">
            {selectedCategories.length} categor
            {selectedCategories.length > 1 ? 'ies' : 'y'} selected
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Selected'
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {selectedCategories.length}
                  {selectedCategories.length > 1 ? ' categories' : ' category'}.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleBulkDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

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
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-orange-600"
                      // onClick={() => handleEdit(category.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the category "
                            {category.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
};

export default CategoriesTable;
