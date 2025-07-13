import { useEffect, useState, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import useProductStore from '@/store/product-store';
import DOMPurify from 'dompurify';
import { format, parseISO } from 'date-fns';

interface Review {
  id: number;
  rating: number;
  comment: string;
  display: boolean;
  is_reported: boolean;
  is_approved: boolean;
  is_rejected: boolean;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer: { name: string };
}

// Memoized Review Item
const ReviewItem = memo(({ review }: { review: Review }) => {
  let formattedDate = 'Unknown Date';
  try {
    formattedDate = format(parseISO(review.created_at), 'MMM dd, yyyy');
  } catch (error) {
    console.error('Failed to parse review date:', review.created_at, error);
  }

  return (
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
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-500">{formattedDate}</span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
      <p className="text-sm text-gray-500 mt-1">
        — {review.customer.name || 'Anonymous'}
      </p>
    </div>
  );
});

// Memoized Similar Product Item
const SimilarProductItem = memo(
  ({
    product,
  }: {
    product: { id: number; name: string; price: number; imageUrls: string[] };
  }) => (
    <Link
      to={`/products/details/${product.id}`}
      className="group block p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
    >
      <img
        src={product.imageUrls[0] || '/placeholder.jpg'}
        alt={product.name}
        className="w-full h-32 object-cover rounded-md mb-2 group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <h3 className="text-sm font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.price.toFixed(2)}Fcfa</p>
    </Link>
  )
);

const ProductDetailsUI = () => {
  const { id } = useParams<{ id: string }>();
  const {
    currentProduct,
    similarProducts,
    error,
    loadProductDetails,
    loadingProductDetails,
    loadSimilarProducts,
  } = useProductStore();
  const [imageIndex, setImageIndex] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    if (id) {
      loadProductDetails(Number(id)).then((product) => {
        if (product && product.categories?.length) {
          loadSimilarProducts(product.categories, product.id);
        }
      });
    }
  }, [id, loadProductDetails, loadSimilarProducts]);

  const handleImageChange = (direction: 'next' | 'prev') => {
    if (!currentProduct?.imageUrls) return;
    const maxIndex = currentProduct.imageUrls.length - 1;
    setImageIndex((prev) =>
      direction === 'next'
        ? Math.min(prev + 1, maxIndex)
        : Math.max(prev - 1, 0)
    );
  };

  // Show loading state
  if (loadingProductDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!currentProduct) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Product not found
        </h2>
        <p className="text-gray-600 mb-4">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = currentProduct.reviews?.length
    ? Math.round(
        currentProduct.reviews.reduce((sum, r) => sum + r.rating, 0) /
          currentProduct.reviews.length
      )
    : 0;

  // Paginated reviews
  const paginatedReviews = currentProduct.reviews
    ? currentProduct.reviews.slice(
        (reviewPage - 1) * reviewsPerPage,
        reviewPage * reviewsPerPage
      )
    : [];
  const totalReviewPages = currentProduct.reviews
    ? Math.ceil(currentProduct.reviews.length / reviewsPerPage)
    : 1;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
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
                  loading="lazy"
                />
                {currentProduct.imageUrls.length > 1 && (
                  <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleImageChange('prev')}
                      disabled={imageIndex === 0}
                      className="bg-white/80 hover:bg-white"
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
                      className="bg-white/80 hover:bg-white"
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
                    {Number(currentProduct.price).toFixed(2)}Fcfa
                  </p>
                  {currentProduct.discount > 0 && (
                    <p className="text-sm text-green-600 mb-2">
                      Discount: {currentProduct.discount}%
                    </p>
                  )}
                  <Badge
                    variant={
                      new Date(currentProduct.availability) > new Date()
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {new Date(currentProduct.availability) > new Date()
                      ? 'In Stock'
                      : 'Out of Stock'}
                  </Badge>
                  <div
                    className="text-gray-600 mt-4 prose"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(currentProduct.description),
                    }}
                  />
                  <div className="mt-4 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < averageRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {currentProduct.reviews.length} review
                      {currentProduct.reviews.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              {paginatedReviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {paginatedReviews.map((review) => (
                    <ReviewItem key={review.id} review={review} />
                  ))}
                  {totalReviewPages > 1 && (
                    <div className="flex justify-between mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setReviewPage((p) => Math.max(p - 1, 1))}
                        disabled={reviewPage === 1}
                      >
                        Previous
                      </Button>
                      <span>
                        Page {reviewPage} of {totalReviewPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setReviewPage((p) =>
                            Math.min(p + 1, totalReviewPages)
                          )
                        }
                        disabled={reviewPage === totalReviewPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
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
              {similarProducts.length === 0 ? (
                <p className="text-gray-500">No similar products found.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {similarProducts.slice(0, 5).map((product) => (
                    <SimilarProductItem key={product.id} product={product} />
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
