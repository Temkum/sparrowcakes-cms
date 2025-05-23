import React, { useEffect, useState } from 'react';
import { useReviewsStore } from '@/store/reviews-store';
import ReviewsTable from './ReviewsTable';
import ReviewsForm from './ReviewsForm';
import { ReviewResponse } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import useProductStore from '@/store/product-store';
import useCustomerStore from '@/store/customer-store';
import { BreadcrumbComponent } from '@/components/BreadcrumbComponent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Reviews', href: '#' },
];

const Reviews: React.FC = () => {
  const {
    reviews,
    totalCount,
    currentPage,
    pageSize,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
  } = useReviewsStore();
  const { products, loadProducts } = useProductStore();
  const { customers, loadCustomers } = useCustomerStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews({ page: currentPage, limit: pageSize });
    loadProducts();
    loadCustomers();
  }, [currentPage, pageSize, fetchReviews, loadProducts, loadCustomers]);

  const handleEdit = async (review: ReviewResponse) => {
    setSelectedReview(review);
    if (products.length === 0) {
      await loadProducts();
    }
    setIsFormOpen(true);
  };

  const handleAddReview = async () => {
    setSelectedReview(null);
    if (products.length === 0) {
      await loadProducts();
    }
    setIsFormOpen(true);
  };

  const handleDelete = async (reviewId: number) => {
    await deleteReview(reviewId);
  };

  const handlePageChange = (page: number) => {
    fetchReviews({ page, limit: pageSize });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchReviews({ page: 1, limit: newPageSize });
  };

  const handleSubmit = async (data: Partial<ReviewResponse>) => {
    setIsSubmitting(true);
    try {
      if (selectedReview) {
        await updateReview(selectedReview.id, data);
      } else {
        await createReview(data);
      }
      setIsFormOpen(false);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <BreadcrumbComponent items={breadcrumbItems} />
      <div className="container mx-auto py-6 space-y-6 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reviews</h1>
          <Button onClick={handleAddReview}>
            <Plus className="w-4 h-4 mr-2" />
            Add Review
          </Button>
        </div>

        <ReviewsTable
          reviews={reviews}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
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
            <ReviewsForm
              review={selectedReview || undefined}
              onSubmit={handleSubmit}
              submitting={isSubmitting}
              customers={customers}
              products={products}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Reviews;
