import React, { useEffect, useState } from 'react';
import useProductStore from '@/store/product-store';
import ProductGrid from '@/components/sparrow/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types/product';
import { UIProduct } from '@/types';

// Helper to map Product (from store) to UIProduct for ProductGrid
function isCategoryObject(cat: unknown): cat is { id: number; name: string } {
  return (
    typeof cat === 'object' && cat !== null && 'id' in cat && 'name' in cat
  );
}
function toUIProduct(product: Product): UIProduct {
  let category = '';
  let categories: { id: number; name: string }[] = [];
  if (Array.isArray(product.categories) && product.categories.length > 0) {
    const catArr = product.categories.reduce<{ id: number; name: string }[]>(
      (acc, cat) => {
        if (isCategoryObject(cat)) acc.push({ id: cat.id, name: cat.name });
        return acc;
      },
      []
    );
    if (catArr.length > 0) {
      category = catArr[0].name || '';
      categories = catArr;
    }
  }
  const imageUrl =
    Array.isArray(product.imageUrls) && product.imageUrls.length > 0
      ? product.imageUrls.find((img) => typeof img === 'string')
      : Array.isArray(product.images) && product.images.length > 0
      ? product.images.find((img) => typeof img === 'string')
      : '/placeholder.svg';
  const images = Array.isArray(product.images)
    ? (product.images.filter((img) => typeof img === 'string') as string[])
    : [];
  let availability: Date | undefined = undefined;
  if (product.availability) {
    if (typeof product.availability === 'string') {
      availability = new Date(product.availability);
    } else {
      availability = product.availability;
    }
  }

  // get the average rating of the product
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : 0;

  // get total number of reviews of the product
  const totalReviews = product.reviews.length;

  return {
    id: product.id,
    title: product.name || '',
    category,
    price: product.price,
    originalPrice: product.price + (product.discount || 0),
    rating: averageRating,
    totalReviews: totalReviews ?? 0,
    reviews: product.reviews ?? [],
    image: imageUrl || '/placeholder.svg',
    display: true,
    quantity: product.quantity,
    description: product.description,
    discount: product.discount,
    costPerUnit: product.costPerUnit,
    slug: product.slug,
    isActive: product.isActive,
    availability,
    categories,
    images,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

const Products: React.FC = () => {
  const {
    products,
    loadingProducts,
    totalPages,
    currentPage,
    filter,
    setFilter,
    loadProducts,
    totalCount,
  } = useProductStore();
  const [search, setSearch] = useState(filter.searchTerm || '');
  const [initialized, setInitialized] = useState(false);

  // Load products on mount and when filter changes
  useEffect(() => {
    if (!initialized) {
      loadProducts();
      setInitialized(true);
    }
  }, [initialized, loadProducts]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filter.searchTerm) {
        setFilter({ ...filter, searchTerm: search, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Pagination handlers
  const handlePrev = () => {
    if (currentPage > 1) setFilter({ ...filter, page: currentPage - 1 });
  };
  const handleNext = () => {
    if (currentPage < totalPages)
      setFilter({ ...filter, page: currentPage + 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">All Products</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Browse our full selection of products. Use the search to filter by name
        or description.
      </p>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-inherit"
        />
      </div>
      {loadingProducts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <ProductGrid products={products.map(toUIProduct)} className="mb-8" />
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages} ({totalCount} products)
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;
