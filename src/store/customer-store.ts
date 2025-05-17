import { create } from 'zustand';
import { customerService } from '@/services/customers.service';
import { Customer } from '@/types/customer';
import { useAuthStore } from './auth';
import { toast } from 'react-hot-toast';

interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  loading: boolean;
  submitting: boolean;
  filter: {
    page: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    searchTerm: string;
  };
  totalCount: number;
  error?: string;
  loadCustomers: () => Promise<void>;
  createCustomer: (customerData: Partial<Customer>) => Promise<Customer>;
  updateCustomer: (
    id: number,
    customerData: Partial<Customer>
  ) => Promise<Customer>;
  setFilter: (filter: Partial<CustomerState['filter']>) => void;
  fetchCustomers: () => Promise<void>;
}

const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  currentCustomer: null,
  loading: false,
  submitting: false,
  totalCount: 0,
  filter: {
    page: 1,
    pageSize: 10,
    sortBy: 'created_at',
    sortDirection: 'desc',
    searchTerm: '',
  },

  loadCustomers: async () => {
    set({ loading: true });
    try {
      const { filter } = get();
      const response = await customerService.getCustomers({
        page: filter.page,
        limit: filter.pageSize,
        searchTerm: filter.searchTerm?.trim() || '',
        sortBy: filter.sortBy,
        sortDirection: filter.sortDirection.toUpperCase() as 'ASC' | 'DESC',
      });
      console.log('response customer store', response);

      set({
        customers: response.items,
        totalCount: response.total,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        customers: [],
        totalCount: 0,
        error:
          error instanceof Error ? error.message : 'Failed to load customers',
      });
      console.error('Error loading customers:', error);
    }
  },

  createCustomer: async (customerData) => {
    try {
      set({ submitting: true });
      const { token } = useAuthStore.getState();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await customerService.createCustomer(
        customerData,
        token
      );

      const createdCustomer: Customer = response;

      // Ensure we're working with arrays
      set((state) => ({
        customers: Array.isArray(state.customers)
          ? [createdCustomer, ...state.customers]
          : [createdCustomer],
        totalCount: (state.totalCount || 0) + 1,
      }));

      return createdCustomer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  updateCustomer: async (id, customerData): Promise<Customer> => {
    try {
      set({ submitting: true });
      const { token } = useAuthStore.getState();

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await customerService.updateCustomer(
        id,
        customerData,
        token
      );
      const updatedCustomer = response;

      set((state) => ({
        customers: state.customers.map((c) =>
          c.id === id ? (updatedCustomer as unknown as Customer) : c
        ),
      }));

      return updatedCustomer;
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    } finally {
      set({ submitting: false });
    }
  },

  setFilter: (newFilter) =>
    set((state) => ({
      filter: {
        ...state.filter,
        ...newFilter,
      },
    })),

  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const { filter } = get();
      const response = await customerService.getCustomers({
        limit: filter.pageSize,
        sortDirection: filter.sortDirection.toUpperCase() as 'ASC' | 'DESC',
      });
      set({ customers: response.items, loading: false });
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
      set({ loading: false });
    }
  },
}));

export default useCustomerStore;
