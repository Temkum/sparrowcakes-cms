import React, { useEffect, useState } from 'react';
import useReviewsStore from '@/store/reviews-store';
import useCustomerStore from '@/store/customer-store';
import useProductStore from '@/store/product-store';
import { Review } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewsTable from './ReviewsTable';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Reviews: React.FC = () => {
  const { reviews, fetchReviews, createReview, updateReview, deleteReview } =
    useReviewsStore();
  const { customers, fetchCustomers } = useCustomerStore();
  const { products, loadProducts } = useProductStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    fetchCustomers();
    loadProducts();
  }, [fetchReviews, fetchCustomers]);

  const handleSubmit = async (data: Partial<Review>) => {
    console.log('Submitting review with data:', data);
    try {
      setIsSubmitting(true);
      if (selectedReview) {
        await updateReview(selectedReview.id, {
          ...data,
          productId: data.productId || 0, // Ensure productId is included in the request
        });
        toast({
          title: 'Success',
          description: 'Review updated successfully',
        });
      } else {
        await createReview({
          ...data,
          productId: data.productId || 0, // Ensure productId is included in the request
        });
        toast({
          title: 'Success',
          description: 'Review created successfully',
        });
      }
      setIsFormOpen(false);
      setSelectedReview(null);
    } catch (err) {
      console.error('Error saving review:', err);
      toast({
        title: 'Error',
        description: 'Failed to save review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setIsFormOpen(true);
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting review:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reviews</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </div>

      <ReviewsTable
        reviews={reviews}
        customers={customers ?? []}
        products={products ?? []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedReview ? 'Edit Review' : 'Add Review'}
            </DialogTitle>
          </DialogHeader>
          <ReviewForm
            review={selectedReview as Review | undefined}
            onSubmit={handleSubmit}
            customers={customers ?? []}
            products={products ?? []}
            submitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews;
