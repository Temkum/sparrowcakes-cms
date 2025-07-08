import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, ArrowUp } from 'lucide-react';
import '../../styles/dynamic-categories.css';
// Types
interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  productCount: number;
  color: string;
}

// Mock API function - replace with your actual API call
const fetchCategories = async (
  page: number = 1,
  limit: number = 8
): Promise<{ categories: Category[]; hasMore: boolean }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allCategories: Category[] = [
    {
      id: '1',
      name: 'Wedding Cakes',
      image:
        'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=600&fit=crop',
      description: 'Elegant multi-tiered cakes for your special day',
      productCount: 45,
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: '2',
      name: 'Birthday Cakes',
      image:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      description: 'Colorful and fun cakes to celebrate another year',
      productCount: 78,
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: '3',
      name: 'Cupcakes',
      image:
        'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&h=600&fit=crop',
      description: 'Individual treats perfect for any occasion',
      productCount: 125,
      color: 'from-yellow-500 to-orange-600',
    },
    {
      id: '4',
      name: 'Croissants',
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop',
      description: 'Buttery, flaky pastries baked fresh daily',
      productCount: 32,
      color: 'from-amber-500 to-yellow-600',
    },
    {
      id: '5',
      name: 'Macarons',
      image:
        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=600&fit=crop',
      description: 'Delicate French cookies in vibrant colors',
      productCount: 89,
      color: 'from-teal-500 to-cyan-600',
    },
    {
      id: '6',
      name: 'Donuts',
      image:
        'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop',
      description: 'Glazed, filled, and decorated donuts for every taste',
      productCount: 67,
      color: 'from-orange-500 to-red-600',
    },
    {
      id: '7',
      name: 'Cheesecakes',
      image:
        'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&h=600&fit=crop',
      description: 'Rich and creamy cheesecakes in various flavors',
      productCount: 23,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      id: '8',
      name: 'Muffins',
      image:
        'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&h=600&fit=crop',
      description: 'Moist breakfast treats with seasonal ingredients',
      productCount: 54,
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: '9',
      name: 'Chocolate Cakes',
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
      description: 'Decadent chocolate creations for chocolate lovers',
      productCount: 41,
      color: 'from-amber-800 to-yellow-600',
    },
    {
      id: '10',
      name: 'Fruit Tarts',
      image:
        'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop',
      description: 'Fresh seasonal fruit atop buttery pastry shells',
      productCount: 36,
      color: 'from-green-500 to-lime-600',
    },
    {
      id: '11',
      name: 'Cookies',
      image:
        'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop',
      description: 'Classic cookies baked with love and tradition',
      productCount: 92,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: '12',
      name: 'Bread & Rolls',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
      description: 'Artisanal breads and rolls baked fresh daily',
      productCount: 28,
      color: 'from-yellow-600 to-amber-700',
    },
  ];

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const categories = allCategories.slice(startIndex, endIndex);
  const hasMore = endIndex < allCategories.length;

  return { categories, hasMore };
};

// Modern Banner Component
const BannerCard: React.FC<{ category: Category; onNavigate: () => void }> = ({
  category,
  onNavigate,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black shadow-2xl">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-75 mix-blend-multiply`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-medium">
              Featured Treats
            </span>
          </div>
          <div className="text-white/60 text-sm">
            {category.productCount.toLocaleString()} items
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {category.name}
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-md leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onNavigate}
            className="group bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Category List Item Component
const CategoryItem: React.FC<{
  category: Category;
  isActive: boolean;
  onClick: () => void;
}> = ({ category, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        isActive ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
      }`}
    >
      {/* Background Image */}
      <div className="aspect-[4/3] relative">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60`}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end">
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-white transition-colors">
            {category.name}
          </h3>
          <p className="text-white/80 text-sm">
            {category.productCount.toLocaleString()} items
          </p>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full shadow-lg animate-pulse" />
        )}
      </div>
    </div>
  );
};

// Main Categories Component
const DynamicCategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Load initial categories
  useEffect(() => {
    const loadInitialCategories = async () => {
      try {
        const { categories: initialCategories, hasMore: moreAvailable } =
          await fetchCategories(1, 8);
        setCategories(initialCategories);
        setSelectedCategory(initialCategories[0] || null);
        setHasMore(moreAvailable);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCategories();
  }, []);

  // Load more categories
  const loadMoreCategories = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { categories: newCategories, hasMore: moreAvailable } =
        await fetchCategories(nextPage, 4);
      setCategories((prev) => [...prev, ...newCategories]);
      setHasMore(moreAvailable);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more categories:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Navigate to category products
  const handleNavigateToProducts = () => {
    if (selectedCategory) {
      console.log(
        `Navigating to products for category: ${selectedCategory.name}`
      );
      // Replace with your actual navigation logic
      // e.g., navigate(`/products?category=${selectedCategory.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Browse Our Bakery
          </h1>
          <p className="text-gray-600 text-lg">
            Discover freshly baked goods and sweet treats for every occasion
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Side - Categories List */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Categories
              </h2>

              {/* Categories Grid */}
              <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pr-2">
                  {categories.map((category) => (
                    <CategoryItem
                      key={category.id}
                      category={category}
                      isActive={selectedCategory?.id === category.id}
                      onClick={() => setSelectedCategory(category)}
                    />
                  ))}
                </div>
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={loadMoreCategories}
                    disabled={loadingMore}
                    className="group bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>View More Categories</span>
                        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Selected Category Banner */}
          <div className="lg:col-span-7 xl:col-span-8">
            {selectedCategory && (
              <div className="animate-fade-in">
                <BannerCard
                  category={selectedCategory}
                  onNavigate={handleNavigateToProducts}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicCategoriesSection;
