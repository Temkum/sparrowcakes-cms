import { Review } from '../review';

// Product interface for frontend use (camelCase)
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  availability: Date | string;
  categories: number[];
  images: (File | string)[];
  imageUrls: string[];
  price: number;
  discount: number;
  costPerUnit: number;
  createdAt?: string;
  updatedAt?: string;
  quantity?: number;
  reviews: Review[];
  totalReviews: number;
}

// API response interface (snake_case)
export interface ProductAPIResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  cost_per_unit: number;
  discount: number;
  quantity: number;
  image_urls: string[];
  is_active: boolean;
  reviews: Review[];
  created_at: string;
  updated_at: string;
  availability: string;
  categories: Category[];
  totalReviews: number;
}

export interface ProductStatsUI {
  totalProducts: number;
  productInventory: number;
  averagePrice: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  averagePrice: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ProductFilter {
  searchTerm?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// For API requests
export interface CreateProductRequest {
  name: string;
  slug?: string;
  description: string;
  isActive: boolean;
  availability: string; // ISO date string
  categories: number[];
  images: File[]; // For create, we require actual File objects
  price: number;
  discount: number;
  costPerUnit: number;
}

export interface UpdateProductRequest {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  availability?: string; // ISO date string
  categories?: number[];
  images?: (File | string)[]; // Can be File objects or URLs
  price?: number;
  discount?: number;
  costPerUnit?: number;
}

// For product statistics
export interface ProductStatsOld {
  total: number;
  active: number;
  inactive: number;
  outOfStock: number;
  lowStock: number; // Products with inventory below threshold
}

// For product filter/search
export interface ProductFilters {
  search?: string;
  categories?: number[];
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Category interface
export interface Category {
  id: number;
  name: string;
  slug: string;
}

// For pagination
export interface PaginatedProductsResponse {
  items: ProductAPIResponse[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface BulkDeletionError extends Error {
  responseData?: unknown;
  status?: number;
}
