import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Star, MessageCircle } from 'lucide-react';
import '@/styles/dynamic-categories.css';
import useCategoriesStore from '@/store/categories-store';
import { DynamicCategories } from '@/types/category';
import { useReviewsStore } from '@/store/reviews-store';
import { ReviewWithDetails } from '@/components/sparrow/ReviewsList';

// Define the Product type locally to match what's in the category types
type CategoryProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
};

const Categories = () => {
  const { dynamicCategories, loading, error, loadUICategories } =
    useCategoriesStore();
  const {
    uiReviews,
    fetchReviewsForUI,
    loading: reviewsLoading,
  } = useReviewsStore();
  const [selectedCategory, setSelectedCategory] =
    useState<DynamicCategories | null>(null);
  const [selectedReview, setSelectedReview] =
    useState<ReviewWithDetails | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [imageLoading, setImageLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch categories from Zustand store
  useEffect(() => {
    const initializeCategories = async () => {
      try {
        const result = await loadUICategories();

        if (result && result.length > 0) {
          setSelectedCategory(result[0]);
        }
        setHasInitialized(true);
      } catch (error) {
        console.error('Failed to load Categories:', error);
        setHasInitialized(true);
      }
    };

    if (!hasInitialized) {
      initializeCategories();
    }
  }, [hasInitialized, loadUICategories]);

  // Fetch reviews
  useEffect(() => {
    fetchReviewsForUI();
  }, [fetchReviewsForUI]);

  // Set default category when data changes
  useEffect(() => {
    if (dynamicCategories.length > 0 && !selectedCategory && hasInitialized) {
      setSelectedCategory(dynamicCategories[0]);
    }
  }, [dynamicCategories, selectedCategory, hasInitialized]);

  // Select a random 5-star review when category changes
  useEffect(() => {
    if (selectedCategory && uiReviews.length > 0) {
      const productIds = selectedCategory.products.map(
        (p: CategoryProduct) => p.id
      );
      const fiveStarReviews = uiReviews.filter(
        (r) => r.rating === 5 && productIds.includes(r.product?.id || 0)
      );

      if (fiveStarReviews.length > 0) {
        const randomIndex = Math.floor(Math.random() * fiveStarReviews.length);
        const selectedReviewData = fiveStarReviews[randomIndex];
        // Convert ReviewResponseProps to ReviewWithDetails format
        const convertedReview: ReviewWithDetails = {
          ...selectedReviewData,
          productId: selectedReviewData.product?.id,
          customerId: selectedReviewData.customer?.id,
          isActive: selectedReviewData.display ?? true,
          createdAt: selectedReviewData.created_at,
          updatedAt: selectedReviewData.updated_at,
          customer: {
            ...selectedReviewData.customer,
            occupation: selectedReviewData.customer?.occupation ?? '',
          },
          helpfulCount: 0,
          isHelpful: false,
          isFeatured: false,
        };
        setSelectedReview(convertedReview);
      } else {
        setSelectedReview(null);
      }
    }
  }, [selectedCategory, uiReviews]);

  const handleCategorySelect = (category: DynamicCategories) => {
    if (selectedCategory?.id === category.id) return;

    setImageLoading(true);
    setSelectedCategory(category);
    setTimeout(() => setImageLoading(false), 300);
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, dynamicCategories.length));
  };

  const handleRetry = async () => {
    setHasInitialized(false);
    setSelectedCategory(null);
  };

  const hasMore = visibleCount < dynamicCategories.length;
  const visibleCategories = dynamicCategories.slice(0, visibleCount);

  if (!hasInitialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (hasInitialized && dynamicCategories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md">
          <div className="text-gray-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Categories Found
          </h2>
          <p className="text-gray-600 mb-4">
            There are no Categories available at the moment.
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-600 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h4 className="text-2xl md:text-3xl font-bold bg-gradient-to-r mt-2 mb-4">
            Our Categories
          </h4>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our delicious range of cakes and treats, crafted with love
            for every occasion
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-500 rounded-full"></div>
                Browse Categories
              </h2>

              <div className="space-y-3 max-h-82 overflow-y-auto custom-scrollbar">
                {visibleCategories.map(
                  (category: DynamicCategories, index: number) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                        selectedCategory?.id === category.id
                          ? 'bg-gradient-to-r from-green-500 to-green-500 text-white shadow-lg'
                          : 'bg-white/60 hover:bg-white/80 text-gray-700'
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: 'fadeInUp 0.5s ease-out forwards',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-sm mb-1 group-hover:text-green-600 transition-colors">
                            {selectedCategory?.id === category.id ? (
                              <span className="text-white">
                                {category.name}
                              </span>
                            ) : (
                              category.name
                            )}
                          </h3>
                          <p
                            className={`text-sm ${
                              selectedCategory?.id === category.id
                                ? 'text-green-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {category.products.length || 0} products
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 transition-all duration-300 ${
                            selectedCategory?.id === category.id
                              ? 'rotate-90 text-white'
                              : 'group-hover:translate-x-1 text-green-500'
                          }`}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>

              {hasMore && (
                <button
                  onClick={handleViewMore}
                  className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-green-500 to-green-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>View More</span>
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedCategory && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                  {imageLoading ? (
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-100 flex items-center justify-center">
                      <div className="animate-pulse text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                        <p className="text-gray-500">Loading image...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={selectedCategory.imageUrl}
                        alt={selectedCategory.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">
                          {selectedCategory.name}
                        </h2>
                        <p className="text-white text-lg">
                          {selectedCategory.products.length} available products
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <div
                    className="text-gray-700 text-lg leading-relaxed mb-8"
                    dangerouslySetInnerHTML={{
                      __html: selectedCategory.description,
                    }}
                  />

                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <MessageCircle className="w-7 h-7 text-green-500" />
                      Customer Reviews
                    </h3>

                    {reviewsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading review...</p>
                      </div>
                    ) : selectedReview ? (
                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                            {selectedReview.customer.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {selectedReview.customer.name}
                              </h4>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">
                                {new Date(
                                  selectedReview.createdAt
                                ).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex mb-2">
                              {[1, 2, 3, 4, 5].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {selectedReview.comment}
                            </p>
                            {selectedReview.product && (
                              <span className="inline-block mt-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                {selectedReview.product.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-green-50 to-green-50 rounded-xl p-8 text-center border-2 border-dashed border-green-200">
                        <Star className="w-12 h-12 text-green-300 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-700 mb-2">
                          No reviews yet
                        </h4>
                        <p className="text-gray-600 max-w-md mx-auto">
                          Be the first to leave a review for our{' '}
                          {selectedCategory.name.toLowerCase()}!
                        </p>
                        <div className="mt-6 flex justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-6 h-6 text-yellow-300 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
