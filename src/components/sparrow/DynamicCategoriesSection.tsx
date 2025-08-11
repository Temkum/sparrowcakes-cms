import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Star, MessageCircle } from 'lucide-react';
import '@/styles/dynamic-categories.css';
import useCategoriesStore from '@/store/categories-store';
import { DynamicCategories } from '@/types/category';

const Categories = () => {
  const { dynamicCategories, loading, error, loadUICategories } =
    useCategoriesStore();
  const [selectedCategory, setSelectedCategory] =
    useState<DynamicCategories | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [imageLoading, setImageLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch categories from Zustand store
  useEffect(() => {
    const initializeCategories = async () => {
      try {
        // Always attempt to load categories on component mount
        console.log('Initializing categories...');
        const result = await loadUICategories();
        console.log('Categories loaded:', result);

        if (result && result.length > 0) {
          setSelectedCategory(result[0]); // Select first category by default
        }
        setHasInitialized(true);
      } catch (error) {
        console.error('Failed to load Categories:', error);
        setHasInitialized(true);
      }
    };

    // Only initialize once when component mounts
    if (!hasInitialized) {
      initializeCategories();
    }
  }, [hasInitialized, loadUICategories]);

  // Separate effect to handle category selection when data changes
  useEffect(() => {
    if (dynamicCategories.length > 0 && !selectedCategory && hasInitialized) {
      console.log('Setting first category as selected');
      setSelectedCategory(dynamicCategories[0]);
    }
  }, [dynamicCategories, selectedCategory, hasInitialized]);

  const handleCategorySelect = (category: DynamicCategories) => {
    if (selectedCategory?.id === category.id) return;

    setImageLoading(true);
    setSelectedCategory(category);

    // Simulate image loading delay
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

  // Show loading state while initializing or while store is loading
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
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02]"
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
          {/* Categories List - Left Side */}
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

          {/* Category Details - Right Side */}
          <div className="lg:col-span-3">
            {selectedCategory && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                {/* Category Image */}
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
                        <p className="text-green-200 text-lg">
                          {selectedCategory.products.length} available products
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Category Description */}
                <div className="p-6 md:p-8">
                  <div
                    className="text-gray-700 text-lg leading-relaxed mb-8"
                    dangerouslySetInnerHTML={{
                      __html: selectedCategory.description,
                    }}
                  />

                  {/* Reviews Section Placeholder */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <MessageCircle className="w-7 h-7 text-green-500" />
                      Customer Reviews
                    </h3>

                    <div className="bg-gradient-to-br from-green-50 to-green-50 rounded-xl p-8 text-center border-2 border-dashed border-green-200">
                      <Star className="w-12 h-12 text-green-300 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-700 mb-2">
                        Reviews Coming Soon
                      </h4>
                      <p className="text-gray-600 max-w-md mx-auto">
                        We're working on bringing you authentic customer reviews
                        for this category. Check back soon to see what others
                        are saying about our{' '}
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
