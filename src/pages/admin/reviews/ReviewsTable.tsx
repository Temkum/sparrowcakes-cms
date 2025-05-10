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
import { Review } from '@/types/review';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
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
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredReviews = reviews?.filter((review) => {
    const cusNmae = review.customer.name;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      cusNmae.includes(searchTermLower) ||
      review.comment.toLowerCase().includes(searchTermLower) ||
      review.id.toString().includes(searchTermLower)
    );
  });

  const handleViewReview = (review: ReviewResponse) => {
    setSelectedReview({
      id: review.id,
      productId: review.product.id,
      customerId: review.customer.id,
      rating: review.rating,
      comment: review.comment,
      isActive: review.display,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
    } as Review);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or review content..."
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
            {filteredReviews &&
              filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">#{review.id}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleViewReview(review)}
                      className="text-blue-600 hover:underline"
                    >
                      {review.customer.name}
                    </button>
                  </TableCell>
                  <TableCell>{review.product.name}</TableCell>
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
                    <Badge variant={review.display ? 'default' : 'destructive'}>
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
                          if (
                            window.confirm(
                              'Are you sure you want to delete this review?'
                            )
                          ) {
                            onDelete(review.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Customer</h3>
                <p>
                  {
                    reviews.find((review) => review.id === selectedReview.id)
                      ?.customer.name
                  }
                </p>
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
                  variant={selectedReview.isActive ? 'default' : 'destructive'}
                >
                  {selectedReview.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold">Date</h3>
                <p>{format(new Date(selectedReview.createdAt), 'PPP')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsTable;
