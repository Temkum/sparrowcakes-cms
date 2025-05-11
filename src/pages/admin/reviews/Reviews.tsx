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
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import { Product } from '@/types/product';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Reviews', href: '#' },
];

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

  // Convert product data to match the expected Product type
  const products = productsFromStore.map((product) => ({
    ...product,
    id: Number(product.id),
  })) as unknown as Product[];

  const customers = customersFromStore.map((customer) => ({
    ...customer,
    id: Number(customer.id),
  }));

  useEffect(() => {
    fetchReviews();
    loadProducts();
    loadCustomers();
  }, [fetchReviews, loadProducts, loadCustomers]);

  const handleSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);

      if (selectedReview) {
        await updateReview(selectedReview.id, {
          comment: data.comment,
          rating: data.rating,
          isActive: data.isActive,
          customerId: data.customerId,
          productId: data.productId,
        });
        toast.success('Review updated successfully');
      } else {
        await createReview({
          comment: data.comment,
          rating: data.rating,
          isActive: data.isActive,
          customerId: data.customerId,
          productId: data.productId,
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

  // Define a type for form data
  type ReviewFormData = {
    customerId?: number;
    productId?: number;
    rating?: number;
    comment?: string;
    isActive?: boolean;
  };

  const handleEdit = (review: ReviewResponse) => {
    setSelectedReview(review);
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
      <BreadcrumbComponent items={breadcrumbItems} />
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
