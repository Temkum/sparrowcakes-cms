export interface Customer {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  address?: string | null;
  postal_code?: string | null;
  country?: string | null;
  state?: string | null;
  city: string | null;
  occupation?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
  customer?: Customer | null;
}

export interface CustomerFilterProps {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export interface PaginatedCustomersResponse {
  items: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
}
