import React, { useEffect, useState } from 'react';
import useReviewsStore from '@/store/reviews-store';
import { ReviewResponse } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ReviewForm from '@/components/reviews/ReviewForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReviewsTable from '@/pages/admin/reviews/ReviewsTable';
import useProductStore from '@/store/product-store';
import useCustomerStore from '@/store/customer-store';
import toast, { Toaster } from 'react-hot-toast';

const Reviews: React.FC = () => {
  const { reviews, fetchReviews, createReview, updateReview, deleteReview } =
    useReviewsStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(
    null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { products: productsFromStore, loadProducts } = useProductStore();
  const { customers: customersFromStore, loadCustomers } = useCustomerStore();

  const products = productsFromStore.map((product) => ({
    ...product,
    id: Number(product.id),
  }));

  const customers = customersFromStore.map((customer) => ({
    ...customer,
    id: Number(customer.id),
  }));

  useEffect(() => {
    fetchReviews();
    loadProducts();
    loadCustomers();
  }, [fetchReviews, loadProducts, loadCustomers]);

  const handleSubmit = async (data: Partial<ReviewResponse>) => {
    try {
      setIsSubmitting(true);

      if (selectedReview) {
        await updateReview(selectedReview.id, {
          ...data,
          customerId:
            data.customer?.id || (selectedReview.customer?.id as number),
          productId: data.product?.id || (selectedReview.product?.id as number),
        });
        toast.success('Review updated successfully');
      } else {
        await createReview({
          ...data,
        });
        toast.success('Review created successfully');
      }

      setIsFormOpen(false);
      setSelectedReview(null);
      fetchReviews(); // Refresh the list
    } catch (err) {
      console.error('Error saving review:', err);
      toast.error('Failed to save review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (review: ReviewResponse) => {
    setSelectedReview({
      ...review,
      isActive: review.display,
      customerId: review.customer?.id,
      productId: review.product?.id,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      toast.success('Review deleted successfully');
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to delete review');
    }
  };

  const handleDeleteCurrent = async () => {
    if (selectedReview) {
      await handleDelete(selectedReview.id);
      setIsFormOpen(false);
      setSelectedReview(null);
    }
  };

  return (
    <>
      <Toaster />
      <div className="container mx-auto py-6 space-y-6 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reviews</h1>
          <Button
            onClick={() => {
              setSelectedReview(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Review
          </Button>
        </div>

        <ReviewsTable
          reviews={reviews}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) {
              setSelectedReview(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedReview ? 'Edit Review' : 'Add Review'}
              </DialogTitle>
            </DialogHeader>
            <ReviewForm
              review={selectedReview || undefined}
              onSubmit={handleSubmit}
              onDelete={selectedReview ? handleDeleteCurrent : undefined}
              customers={customers}
              products={products}
              submitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Reviews;
