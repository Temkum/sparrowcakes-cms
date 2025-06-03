import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StarRating } from '@/components/sparrow/StarRating';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReviewResponseProps } from '@/types/review';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useProductStore from '@/store/product-store';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewsTableProps {
  reviews: ReviewResponseProps[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (review: ReviewResponseProps) => void;
  onDelete: (reviewId: number) => void;
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({
  reviews,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] =
    useState<ReviewResponseProps | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  const {
    loadProduct,
    currentProduct,
    loading: productLoading,
  } = useProductStore();

  const filteredReviews = reviews?.filter((review) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      review.customer?.name?.toLowerCase().includes(searchTermLower) ||
      review.product?.name?.toLowerCase().includes(searchTermLower) ||
      review.comment?.toLowerCase().includes(searchTermLower) ||
      review.id.toString().includes(searchTermLower) ||
      review.customer?.email?.toLowerCase().includes(searchTermLower) ||
      review.customer?.phone?.toLowerCase().includes(searchTermLower) ||
      format(new Date(review.created_at), 'dd MMM yyyy').includes(
        searchTermLower
      )
    );
  });

  const handleViewReview = async (review: ReviewResponseProps) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
    if (review.product?.id) {
      await loadProduct(review.product.id);
    }
  };

  const confirmDelete = (reviewId: number) => {
    setReviewToDelete(reviewId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (reviewToDelete !== null) {
      onDelete(reviewToDelete);
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, product, or review content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date added</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews && filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">#{review.id}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleViewReview(review)}
                      className="text-blue-600 hover:underline"
                    >
                      {review.customer?.name || 'Unknown Customer'}
                    </button>
                  </TableCell>
                  <TableCell>
                    {review.product?.name || 'Unknown Product'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-gray-500">
                        ({review.rating}/5)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {review.comment}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={review.display ? 'default' : 'outline'}
                      className={
                        review.display ? 'bg-green-500' : 'bg-gray-300'
                      }
                    >
                      {review.display ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(review)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(review.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No reviews found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Showing {reviews.length} of {totalCount} reviews
            {pageSize < totalCount && (
              <>
                {' '}
                (Page {currentPage} of {totalPages})
              </>
            )}
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                  <img
                    src={
                      selectedReview.customer?.image_url || '/placeholder.svg'
                    }
                    alt={selectedReview.customer?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedReview.customer?.name || 'Unknown Customer'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedReview.customer?.email}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Product</h3>
                {productLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                ) : currentProduct ? (
                  <div className="flex items-start gap-4">
                    {currentProduct.image_urls?.[0] && (
                      <div className="w-20 h-20 rounded border overflow-hidden">
                        <img
                          src={currentProduct.image_urls[0]}
                          alt={currentProduct.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              '/placeholder.svg';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium">{currentProduct.name}</h4>
                      <p className="text-sm text-gray-500">
                        ${currentProduct.price}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Product not found</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Rating</h3>
                <div className="flex items-center gap-2">
                  <StarRating rating={selectedReview.rating} />
                  <span className="text-sm text-gray-500">
                    ({selectedReview.rating}/5)
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Comment</h3>
                <p className="whitespace-pre-wrap text-gray-700">
                  {selectedReview.comment}
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Status</h3>
                <div className="flex gap-2">
                  <Badge
                    variant={selectedReview.display ? 'default' : 'outline'}
                  >
                    {selectedReview.display ? 'Active' : 'Inactive'}
                  </Badge>
                  {selectedReview.is_reported && (
                    <Badge variant="destructive">Reported</Badge>
                  )}
                  {selectedReview.is_approved && (
                    <Badge variant="default" className="bg-green-500">
                      Approved
                    </Badge>
                  )}
                  {selectedReview.is_rejected && (
                    <Badge variant="destructive">Rejected</Badge>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p>
                      {format(
                        new Date(selectedReview.created_at),
                        'MMM dd, yyyy'
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Updated</p>
                    <p>
                      {format(
                        new Date(selectedReview.updated_at),
                        'MMM dd, yyyy'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    onEdit(selectedReview);
                  }}
                >
                  Edit Review
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            <p>Are you sure you want to delete this review?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsTable;
