export interface DynamicCategories {
  id: number;
  name: string;
  label: string;
  value: number[];
  onChange: (value: number[]) => void;
  isRequired?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  isActive?: boolean;
  created_at: string;
  updated_at: string;
}

interface CacheEntry {
  data: CategoryResponse[];
  timestamp: number;
}

export interface CategoryState {
  categories: CategoryResponse[];
  loading: boolean;
  error: string | null;
  cache: Map<string, CacheEntry>;
  retryAttempts: number;

  // Actions
  loadCategories: () => Promise<CategoryResponse[]>;
  createCategory: (categoryData: FormData) => Promise<CategoryResponse>;
  updateCategory: (
    id: number,
    categoryData: FormData
  ) => Promise<CategoryResponse>;
  deleteCategory: (id: number) => Promise<void>;
  deleteCategories: (ids: number[]) => Promise<void>;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  isActive: boolean;
  image?: File | null;
  isImageDeleted?: boolean;
}

export interface CategoryResponse extends Required<Omit<Category, 'image'>> {
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  data: CategoryResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  category?: Category | null;
  mode?: 'create' | 'edit';
}
