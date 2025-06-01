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
import toast from 'react-hot-toast';
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
} from '../../../components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import CategoryFormModal from '@/pages/admin/categories/CategoryFormModal';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Category } from '@/types/category';
import useCategoriesStore from '@/store/categories-store';

const CategoriesTable = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: 'ASC' | 'DESC';
  }>({ field: 'name', direction: 'ASC' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCategoryDetails, setSelectedCategoryDetails] =
    useState<Category | null>(null);

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch categories with sorting and pagination
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const categories = await useCategoriesStore
        .getState()
        .getCategoriesPaginated({
          categories: [],
          page,
          limit,
          search: debouncedSearchTerm,
          sortBy: sortConfig.field,
          sortOrder: sortConfig.direction,
        });
      setTotal(categories.length);
      setCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories. Please try again later!');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, limit, page, sortConfig]);

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
        prev.field === field && prev.direction === 'ASC' ? 'DESC' : 'ASC',
    }));
    setPage(1); // Reset to first page when sorting changes
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Reset to page 1 when search term or sort changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, sortConfig]);

  const handleDelete = async (categoryId: number) => {
    await useCategoriesStore.getState().deleteCategory(categoryId);
    await fetchCategories();
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) return;
    setIsDeleting(true);

    try {
      await useCategoriesStore.getState().deleteCategories(selectedCategories);
      toast.success(
        `${selectedCategories.length} categories deleted successfully`
      );
      setSelectedCategories([]);
      await fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete some categories. Please try again later!', {
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig.field !== field)
      return <ChevronDown className="h-4 w-4 opacity-50" />;
    return sortConfig.direction === 'ASC' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleRowClick = (category: Category) => {
    setSelectedCategoryDetails(category);
    setDetailsOpen(true);
  };

  return (
    <>
      {/* Search */}
      <div className="relative w-full mb-6 bg-white flex items-center justify-between">
        <div className="relative w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search categories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" disabled>
            Import categories
            <span className="text-xs text-gray-500 ml-1">(Not functional)</span>
          </Button>
          <Link to="/admin/categories/new">
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isDeleting}
              type="button"
              onClick={() => {
                setCreateModalOpen(true);
                setSelectedCategory(null); // Reset selected category for new creation
              }}
            >
              New category
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        {selectedCategories && selectedCategories.length > 0 && (
          <div className="p-4 bg-gray-100 flex justify-between items-center">
            <span className="text-sm">
              {selectedCategories.length}
              {selectedCategories.length > 1 ? ' categories ' : ' category '}
              selected
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
                    {selectedCategories.length > 1
                      ? ' categories'
                      : ' category'}
                    . This action cannot be undone.
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
                    selectedCategories?.length === categories?.length &&
                    categories.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories(
                        categories && categories.map((c) => c.id)
                      );
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
            ) : categories && categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {searchTerm ? (
                    <>
                      No categories found matching "
                      <strong>{searchTerm}</strong>"
                    </>
                  ) : (
                    <>No categories found</>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              categories &&
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
                            selectedCategories.filter(
                              (id) => id !== category.id
                            )
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={category.imageUrl || '/placeholder.svg'}
                      alt={category.name}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(category);
                      }}
                      className="text-left font-medium hover:text-orange-600"
                    >
                      {category.name}
                    </button>
                  </TableCell>
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
                        onClick={() => handleEdit(category)}
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
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Delete'
                              )}
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

      <CategoryFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={fetchCategories} // Refresh the table
        category={selectedCategory}
        mode="edit"
      />

      {/* add category modal */}
      <CategoryFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchCategories} // Refresh the table
        mode="create"
      />

      {/* Category Details Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="w-full sm:max-w-md lg:max-w-lg">
          {selectedCategoryDetails && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedCategoryDetails.name}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Large Image */}
                <div className="flex justify-center">
                  <img
                    src={selectedCategoryDetails.imageUrl || '/placeholder.svg'}
                    alt={selectedCategoryDetails.name}
                    className="w-full max-h-64 object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Slug</p>
                    <p>{selectedCategoryDetails.slug}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="flex items-center">
                      {selectedCategoryDetails.isActive ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          <span>Inactive</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2">
                    <p className="text-sm font-medium text-gray-500">
                      Description
                    </p>
                    <div
                      className="whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          selectedCategoryDetails.description ||
                            'No description'
                        ),
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p>
                      {format(
                        new Date(selectedCategoryDetails.created_at),
                        'MMM dd, yyyy'
                      )}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">
                      Last Updated
                    </p>
                    <p>
                      {format(
                        new Date(selectedCategoryDetails.updated_at),
                        'MMM dd, yyyy'
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDetailsOpen(false);
                      handleEdit(selectedCategoryDetails);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDetailsOpen(false);
                      handleDelete(selectedCategoryDetails.id);
                    }}
                    className="hover:bg-red-500 hover:text-white text-red-500"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-1 hover:text-white" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CategoriesTable;
