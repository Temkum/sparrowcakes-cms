import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import useProductStore from '@/store/product-store';
import { useReviewsStore } from '@/store/reviews-store';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

// Review form schema
const reviewSchema = z.object({
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const ProductDetailsUI = () => {
  const { id } = useParams<{ id: string }>();
  const {
    currentProduct,
    similarProducts,
    loadingProduct,
    error,
    loadProduct,
    loadSimilarProducts,
  } = useProductStore();
  const {
    reviews,
    totalCount,
    currentPage,
    pageSize,
    fetchReviews,
    createReview,
    loading,
  } = useReviewsStore();
  const [imageIndex, setImageIndex] = useState(0);

  // Review form setup
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 1, comment: '' },
  });

  useEffect(() => {
    if (id) {
      loadProduct(Number(id));
      fetchReviews({ productId: Number(id), page: 1, limit: 5, display: true });
    }
  }, [id, loadProduct, fetchReviews]);

  const handlePageChange = (page: number) => {
    if (id && page >= 1 && page <= Math.ceil(totalCount / pageSize)) {
      fetchReviews({
        productId: Number(id),
        page,
        limit: pageSize,
        display: true,
      });
    }
  };

  const onSubmitReview = async (data: ReviewFormValues) => {
    if (!id) return;
    try {
      await createReview({ ...data, product: Number(id), display: true });
      form.reset();
      toast.success('Review submitted successfully');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const handleImageChange = (direction: 'next' | 'prev') => {
    if (!currentProduct?.imageUrls) return;
    const maxIndex = currentProduct.imageUrls.length - 1;
    setImageIndex((prev) =>
      direction === 'next'
        ? Math.min(prev + 1, maxIndex)
        : Math.max(prev - 1, 0)
    );
  };

  if (loadingProduct || loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!currentProduct) return null;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Product Details */}
        <div className="lg:col-span-3">
          <Card className="mb-8 transition-shadow hover:shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Carousel */}
              <div className="relative">
                <img
                  src={
                    currentProduct.imageUrls[imageIndex] || '/placeholder.jpg'
                  }
                  alt={currentProduct.name}
                  className="w-full max-w-md h-auto object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                />
                {currentProduct.imageUrls.length > 1 && (
                  <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleImageChange('prev')}
                      disabled={imageIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleImageChange('next')}
                      disabled={
                        imageIndex === currentProduct.imageUrls.length - 1
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <CardHeader>
                  <CardTitle className="text-3xl font-bold">
                    {currentProduct.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold mb-2">
                    ${currentProduct.price.toFixed(2)}
                  </p>
                  {currentProduct.discount > 0 && (
                    <p className="text-sm text-green-600 mb-2">
                      Discount: {currentProduct.discount}%
                    </p>
                  )}
                  <Badge
                    variant={
                      currentProduct.availability ? 'default' : 'destructive'
                    }
                  >
                    {currentProduct.availability ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                  <p className="text-gray-600 mt-4">
                    {currentProduct.description}
                  </p>
                  <div className="mt-4 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i <
                          Math.round(
                            currentProduct.reviews.reduce(
                              (sum, r) => sum + r.rating,
                              0
                            ) / (currentProduct.totalReviews || 1)
                          )
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {currentProduct.totalReviews} review
                      {currentProduct.totalReviews !== 1 ? 's' : ''}
                    </span>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Review Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Submit a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitReview)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="w-20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Write your review..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    Submit Review
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(
                    (review) =>
                      review.display &&
                      !review.is_deleted && (
                        <div
                          key={review.id}
                          className="border-b pb-4 transition-opacity duration-300"
                        >
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            — {review.customer?.name || 'Anonymous'}
                          </p>
                        </div>
                      )
                  )}
                </div>
              )}
              {totalCount > pageSize && (
                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {Math.ceil(totalCount / pageSize)}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === Math.ceil(totalCount / pageSize)}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Similar Products */}
        <div className="lg:col-span-1">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle>Similar Products</CardTitle>
            </CardHeader>
            <CardContent>
              {similarProducts && similarProducts.length === 0 ? (
                <p className="text-gray-500">No similar products found.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {similarProducts &&
                    similarProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="group block p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <img
                          src={product.imageUrls[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-md mb-2 group-hover:scale-105 transition-transform duration-300"
                        />
                        <h3 className="text-sm font-semibold">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          ${product.price.toFixed(2)}
                        </p>
                      </Link>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsUI;
