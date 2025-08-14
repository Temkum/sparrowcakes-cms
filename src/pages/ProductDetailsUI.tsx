import { useEffect, useState, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import useProductStore from '@/store/product-store';
import { useReviewsStore } from '@/store/reviews-store';
import DOMPurify from 'dompurify';
import { format, parseISO } from 'date-fns';
import { ReviewWithDetails } from '@/components/sparrow/ReviewsList';
import { useFormatCurrency } from '@/hooks/format-currency';

// Custom styles for scrollbar hiding
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Memoized Review Item
const ReviewItem = memo(({ review }: { review: ReviewWithDetails }) => {
  let formattedDate = 'Unknown Date';
  try {
    formattedDate = format(parseISO(review.createdAt), 'MMM dd, yyyy');
  } catch (error) {
    console.error('Failed to parse review date:', review.createdAt, error);
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
        — {review.customer?.name || 'Anonymous'}
      </p>
    </div>
  );
});

// Memoized Similar Product Item
const SimilarProductItem = memo(
  ({
    product,
    formatCurrency,
  }: {
    product: { id: number; name: string; price: number; imageUrls: string[] };
    formatCurrency: (amount: number) => string;
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
      <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
    </Link>
  )
);

const ProductDetailsUI = () => {
  const formatCurrency = useFormatCurrency();
  const { id } = useParams<{ id: string }>();
  const {
    currentProduct,
    similarProducts,
    error,
    loadProductDetails,
    loadingProductDetails,
    loadSimilarProducts,
    loadingSimilarProducts,
  } = useProductStore();
  const {
    uiReviews,
    fetchReviewsForUI,
    loading: reviewsLoading,
  } = useReviewsStore();
  const [imageIndex, setImageIndex] = useState(0);
  const [reviewPage, setReviewPage] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const reviewsPerPage = 5;

  useEffect(() => {
    if (id) {
      const productId = Number(id);
      console.log(
        'URL id parameter:',
        id,
        'converted to:',
        productId,
        'isValid:',
        !isNaN(productId) && productId > 0
      );

      if (isNaN(productId) || productId <= 0) {
        console.error('Invalid product ID from URL:', id);
        return;
      }

      loadProductDetails(productId).then((product) => {
        console.log('Product loaded:', {
          productId: product?.id,
          categories: product?.categories?.length || 0,
        });
        if (
          product &&
          product.categories?.length &&
          product.id &&
          !isNaN(product.id) &&
          product.id > 0
        ) {
          console.log('Loading similar products for product:', product.id);
          loadSimilarProducts(product.categories, product.id);
        } else {
          console.log(
            'Skipping similar products load - invalid product or no categories:',
            {
              hasProduct: !!product,
              productId: product?.id,
              categoriesCount: product?.categories?.length || 0,
            }
          );
        }
      });
      fetchReviewsForUI(); // Fetch reviews for UI
    }
    setImageIndex(0);
    setImageLoading(true);
    setIsZoomed(false);
  }, [id, loadProductDetails, loadSimilarProducts, fetchReviewsForUI]);

  const handleImageChange = (direction: 'next' | 'prev') => {
    if (!currentProduct?.imageUrls) return;
    const maxIndex = currentProduct.imageUrls.length - 1;
    setImageIndex((prev) => {
      const newIndex =
        direction === 'next'
          ? Math.min(prev + 1, maxIndex)
          : Math.max(prev - 1, 0);
      setImageLoading(true);
      return newIndex;
    });
  };

  const handleThumbnailClick = (index: number) => {
    if (index !== imageIndex) {
      setImageLoading(true);
      setImageIndex(index);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentProduct?.imageUrls || currentProduct.imageUrls.length <= 1)
        return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handleImageChange('prev');
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleImageChange('next');
          break;
        case 'Escape':
          setIsZoomed(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentProduct?.imageUrls]);

  // Filter reviews for the current product
  const productReviews = uiReviews
    .filter((review) => {
      const reviewProductId = review.product?.id;
      const currentProductId = Number(id);
      const isValidReview =
        reviewProductId &&
        !isNaN(reviewProductId) &&
        currentProductId &&
        !isNaN(currentProductId) &&
        reviewProductId === currentProductId;
      return isValidReview;
    })
    .map((review) => ({
      ...review,
      productId: review.product?.id,
      customerId: review.customer?.id,
      isActive: review.display ?? true,
      createdAt: review.created_at,
      updatedAt: review.updated_at,
      customer: {
        ...review.customer,
        occupation: review.customer?.occupation ?? '',
      },
      helpfulCount: 0,
      isHelpful: false,
      isFeatured: false,
    })) as ReviewWithDetails[];

  // Calculate average rating
  const averageRating = productReviews.length
    ? Math.round(
        productReviews.reduce((sum, r) => sum + r.rating, 0) /
          productReviews.length
      )
    : 0;

  // Paginated reviews
  const paginatedReviews = productReviews.slice(
    (reviewPage - 1) * reviewsPerPage,
    reviewPage * reviewsPerPage
  );
  const totalReviewPages = Math.ceil(productReviews.length / reviewsPerPage);

  // Show loading state
  if (loadingProductDetails || reviewsLoading) {
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
          <Link to="/products">Browse Bakery</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Product Details */}
        <div className="lg:col-span-3">
          <Card className="mb-8 transition-shadow hover:shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Carousel */}
              <div className="relative">
                <div
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                    isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  title={isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
                >
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={
                      currentProduct.imageUrls[imageIndex] || '/placeholder.jpg'
                    }
                    alt={currentProduct.name}
                    className={`w-full max-w-md h-80 object-cover transition-all duration-300 ${
                      isZoomed ? 'scale-150 transform-gpu' : 'hover:scale-105'
                    } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    style={{ width: '320px', height: '320px' }}
                    loading="lazy"
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                </div>

                {currentProduct.imageUrls.length > 1 && (
                  <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 transform -translate-y-1/2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleImageChange('prev')}
                      disabled={imageIndex === 0}
                      className="bg-white/80 hover:bg-white shadow-md"
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
                      className="bg-white/80 hover:bg-white shadow-md"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Image Counter */}
                {currentProduct.imageUrls.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                    {imageIndex + 1} / {currentProduct.imageUrls.length}
                  </div>
                )}

                {/* Thumbnail Gallery */}
                {currentProduct.imageUrls.length > 1 && (
                  <div className="mt-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {currentProduct.imageUrls.map((imageUrl, index) => (
                        <button
                          key={index}
                          onClick={() => handleThumbnailClick(index)}
                          className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                            index === imageIndex
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          title={`View image ${index + 1}`}
                        >
                          <img
                            src={imageUrl || '/placeholder.jpg'}
                            alt={`${currentProduct.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
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
                    {formatCurrency(currentProduct.price)}
                  </p>
                  {currentProduct.discount > 0 && (
                    <p className="text-lg font-semibold text-green-600">
                      Discount: {currentProduct.discount}%
                    </p>
                  )}
                  <Badge
                    variant={
                      (currentProduct.availableFrom === null ||
                        new Date(currentProduct.availableFrom) <= new Date()) &&
                      (currentProduct.availableTo === null ||
                        new Date(currentProduct.availableTo) >= new Date())
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {(currentProduct.availableFrom === null ||
                      new Date(currentProduct.availableFrom) <= new Date()) &&
                    (currentProduct.availableTo === null ||
                      new Date(currentProduct.availableTo) >= new Date())
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
                      {productReviews.length} review
                      {productReviews.length !== 1 ? 's' : ''}
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
              {loadingSimilarProducts ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : similarProducts && similarProducts.length === 0 ? (
                <p className="text-gray-500">No similar products found.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {similarProducts.slice(0, 6).map((product) => (
                    <SimilarProductItem
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrls: product.imageUrls,
                      }}
                      formatCurrency={formatCurrency}
                    />
                  ))}
                  {currentProduct.categories &&
                    currentProduct.categories.length > 0 &&
                    currentProduct.categories[0] &&
                    !isNaN(currentProduct.categories[0]) &&
                    currentProduct.categories[0] > 0 && (
                      <Button asChild className="mt-4 w-full">
                        <Link
                          to={`/categories/${currentProduct.categories[0]}`}
                        >
                          View All
                        </Link>
                      </Button>
                    )}
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
