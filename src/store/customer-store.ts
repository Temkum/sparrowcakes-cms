import { create } from 'zustand';
import { customerService } from '@/services/customers.service';
import { Customer } from '@/types/customer';
import { useAuthStore } from './auth';

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
  loadCustomers: () => Promise<void>;
  createCustomer: (customerData: Partial<Customer>) => Promise<Customer>;
  updateCustomer: (
    id: number,
    customerData: Partial<Customer>
  ) => Promise<Customer>;
  setFilter: (filter: Partial<CustomerState['filter']>) => void;
}

const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [], // Initialize as empty array
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
    try {
      set({ loading: true });
      const filter = get().filter;
      const response = await customerService.getCustomers(
        filter.page,
        filter.pageSize,
        filter.searchTerm,
        filter.sortBy,
        filter.sortDirection
      );

      if (response && response) {
        set({
          customers: response,
          totalCount: response.total || 0,
          loading: false,
        });
      } else {
        set({ customers: [], totalCount: 0, loading: false });
      }
    } catch (error) {
      console.error('Failed to load customers:', error);
      set({ customers: [], totalCount: 0, loading: false });
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

      console.log('Created customer:', response);

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

  updateCustomer: async (id, customerData) => {
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
      const updatedCustomer = response.data;
      set((state) => ({
        customers: state.customers.map((c) =>
          c.id === id ? updatedCustomer : c
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

  setFilter: (filter) => {
    set((state) => ({
      filter: { ...state.filter, ...filter },
    }));
  },
}));

export default useCustomerStore;
