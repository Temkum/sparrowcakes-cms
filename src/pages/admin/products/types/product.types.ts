// Product interfaces matching the schema
export interface Product {
  id?: number;
  name: string;
  slug?: string;
  description: string;
  isActive: boolean;
  availability: Date | string; // Can be Date object or ISO string
  categories: number[]; // Array of category IDs as numbers
  images: (File | string)[]; // Can be File objects (for new uploads) or URLs (existing)
  price: number;
  discount: number; // Compare at price
  costPerUnit: number; // Cost per item
  createdAt?: string;
  updatedAt?: string;
}

// For API operations
export interface ProductResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  availability: string; // ISO date string
  categories: number[];
  image_urls: string[]; // URLs of images
  price: number;
  discount: number;
  costPerUnit: number;
  createdAt: string;
  updatedAt: string;
}

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
  created_at: string;
  updated_at: string;
  availability: string;
  categories: Category[];
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
export interface ProductStats {
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

// For pagination
export interface PaginatedProductsResponse {
  data: ProductResponse[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
