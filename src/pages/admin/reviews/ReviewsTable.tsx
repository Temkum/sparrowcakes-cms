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
import { Search, AlertTriangle } from 'lucide-react';
import { ReviewResponse } from '@/types/review';

interface ReviewsTableProps {
  reviews: ReviewResponse[];
  onEdit: (review: ReviewResponse) => void;
  onDelete: (reviewId: number) => void;
}

const ReviewsTable: React.FC<ReviewsTableProps> = ({
  reviews,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  const filteredReviews = reviews?.filter((review) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      review.customer?.name?.toLowerCase().includes(searchTermLower) ||
      review.product?.name?.toLowerCase().includes(searchTermLower) ||
      review.comment?.toLowerCase().includes(searchTermLower) ||
      review.id.toString().includes(searchTermLower)
    );
  });

  const handleViewReview = (review: ReviewResponse) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
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
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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

      {/* View Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Customer</h3>
                <p>{selectedReview.customer?.name || 'Unknown Customer'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Product</h3>
                <p>{selectedReview.product?.name || 'Unknown Product'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Rating</h3>
                <div className="flex items-center gap-2">
                  <StarRating rating={selectedReview.rating} />
                  <span className="text-sm text-gray-500">
                    ({selectedReview.rating}/5)
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Comment</h3>
                <p className="whitespace-pre-wrap">{selectedReview.comment}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <Badge
                  variant={selectedReview.display ? 'default' : 'outline'}
                  className={
                    selectedReview.display ? 'bg-green-500' : 'bg-gray-300'
                  }
                >
                  {selectedReview.display ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">Date Created</h3>
                <p>{format(new Date(selectedReview.created_at), 'PPP')}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            {selectedReview && (
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  onEdit(selectedReview);
                }}
                className="bg-orange-500"
              >
                Edit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </p>
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
