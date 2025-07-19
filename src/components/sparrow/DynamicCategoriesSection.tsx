import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Star, MessageCircle } from 'lucide-react';
import '@/styles/dynamic-categories.css';
// Mock data structure matching your backend format
const mockCategories = [
  {
    id: 141,
    name: 'Fondant Cakes',
    slug: 'fondant-cakes',
    description: '<p>Beautiful custom fondant cakes for special occasions</p>',
    imageUrl:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
    productCount: 5,
    products: [],
  },
  {
    id: 142,
    name: 'Wedding Cakes',
    slug: 'wedding-cakes',
    description: '<p>Elegant multi-tier wedding cakes</p>',
    imageUrl:
      'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&h=400&fit=crop',
    productCount: 8,
    products: [],
  },
  {
    id: 143,
    name: 'Birthday Cakes',
    slug: 'birthday-cakes',
    description: '<p>Fun and colorful birthday celebration cakes</p>',
    imageUrl:
      'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500&h=400&fit=crop',
    productCount: 12,
    products: [],
  },
  {
    id: 144,
    name: 'Cupcakes',
    slug: 'cupcakes',
    description: '<p>Individual portion cupcakes with various flavors</p>',
    imageUrl:
      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500&h=400&fit=crop',
    productCount: 15,
    products: [],
  },
  {
    id: 145,
    name: 'Chocolate Cakes',
    slug: 'chocolate-cakes',
    description: '<p>Rich and decadent chocolate cakes</p>',
    imageUrl:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&h=400&fit=crop',
    productCount: 7,
    products: [],
  },
  {
    id: 146,
    name: 'Fruit Cakes',
    slug: 'fruit-cakes',
    description: '<p>Fresh fruit-topped seasonal cakes</p>',
    imageUrl:
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=400&fit=crop',
    productCount: 6,
    products: [],
  },
  {
    id: 147,
    name: 'Custom Designs',
    slug: 'custom-designs',
    description: '<p>Unique custom cake designs for any occasion</p>',
    imageUrl:
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&h=400&fit=crop',
    productCount: 3,
    products: [],
  },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);

  // Simulate fetching data from Zustand store
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCategories(mockCategories);
      setSelectedCategory(mockCategories[0]); // Select first category by default
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    if (selectedCategory?.id === category.id) return;

    setImageLoading(true);
    setSelectedCategory(category);

    // Simulate image loading delay
    setTimeout(() => setImageLoading(false), 300);
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, categories.length));
  };

  const hasMore = visibleCount < categories.length;
  const visibleCategories = categories.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Our Categories
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our delicious range of cakes and treats, crafted with love
            for every occasion
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Categories List - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Browse Categories
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {visibleCategories.map((category, index) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                      selectedCategory?.id === category.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/60 hover:bg-white/80 text-gray-700'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 transition-colors">
                          {selectedCategory?.id === category.id ? (
                            <span className="text-white">{category.name}</span>
                          ) : (
                            category.name
                          )}
                        </h3>
                        <p
                          className={`text-sm ${
                            selectedCategory?.id === category.id
                              ? 'text-purple-100'
                              : 'text-gray-500'
                          }`}
                        >
                          {category.productCount} products
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          selectedCategory?.id === category.id
                            ? 'rotate-90 text-white'
                            : 'group-hover:translate-x-1 text-purple-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <button
                  onClick={handleViewMore}
                  className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
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
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <div className="animate-pulse text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
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
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">
                          {selectedCategory.name}
                        </h2>
                        <p className="text-purple-200 text-lg">
                          {selectedCategory.productCount} available products
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
                      <MessageCircle className="w-7 h-7 text-purple-500" />
                      Customer Reviews
                    </h3>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 text-center border-2 border-dashed border-purple-200">
                      <Star className="w-12 h-12 text-purple-300 mx-auto mb-4" />
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
