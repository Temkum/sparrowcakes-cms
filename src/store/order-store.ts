import { create } from 'zustand';
import { orderService } from '@/services/orders.service';
import { Order, OrderStats, OrderStatus } from '@/types/order';
import { toast } from 'react-hot-toast';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  submitting: boolean;
  totalCount: number;
  filter: {
    page: number;
    pageSize: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    searchTerm: string;
    status?: OrderStatus;
  };
  stats: OrderStats;

  // Actions
  loadOrders: () => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrder: (id: number, orderData: Partial<Order>) => Promise<Order>;
  deleteOrders: (ids: number[]) => Promise<void>;
  softDeleteOrders: (ids: number[]) => Promise<void>;
  setFilter: (filter: Partial<OrderState['filter']>) => void;
  loadStats: () => Promise<void>;
  resetFilter: () => void;
}

const DEFAULT_FILTER = {
  page: 1,
  pageSize: 10,
  sortBy: 'created_at',
  sortDirection: 'desc' as const,
  searchTerm: '',
};

const useOrderStore = create<OrderState>((set, get) => {
  const getAuthToken = (): string => {
    const persistedState = JSON.parse(
      localStorage.getItem('auth-storage') || '{}'
    );
    return persistedState.state?.token || '';
  };

  return {
    orders: [],
    currentOrder: null,
    loading: false,
    submitting: false,
    totalCount: 0,
    filter: { ...DEFAULT_FILTER },
    stats: {
      totalOrders: 0,
      activeOrders: 0,
      newOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      weeklyOrders: [],
      monthlyOrders: [],
      yearlyOrders: [],
      topProducts: [],
      topCustomers: [],
    },

    loadOrders: async () => {
      set({ loading: true });
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const { filter } = get();
        const cleanFilter = {
          page: filter.page,
          limit: filter.pageSize,
          search: filter.searchTerm?.trim() || undefined,
          sortBy: filter.sortBy,
          sortOrder: filter.sortDirection.toUpperCase() as 'ASC' | 'DESC',
          status: filter.status,
        };

        const response = await orderService.getOrders(cleanFilter, token);
        const { data: ordersArray, meta } = response;

        set({
          orders: ordersArray,
          totalCount: meta.total,
          loading: false,
        });
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to load orders'
        );
        set({ loading: false });
      }
    },

    setFilter: (newFilter) => {
      set((state) => {
        // Create a new filter object
        const updatedFilter = {
          ...state.filter,
          ...newFilter,
        };

        // Handle special case for 'all' status
        if (newFilter.status === 'all') {
          updatedFilter.status = undefined;
        }

        // Ensure search term is always a string
        updatedFilter.searchTerm =
          newFilter.searchTerm ?? state.filter.searchTerm;

        // Reset to page 1 if filter criteria change (except page itself)
        if (
          newFilter.page === undefined &&
          (newFilter.status !== undefined ||
            newFilter.searchTerm !== undefined ||
            newFilter.sortBy !== undefined ||
            newFilter.sortDirection !== undefined ||
            newFilter.pageSize !== undefined)
        ) {
          updatedFilter.page = 1;
        }

        return { filter: updatedFilter };
      });

      // Trigger a new load after filter update
      get().loadOrders();
    },

    resetFilter: () => {
      set({ filter: { ...DEFAULT_FILTER } });
      get().loadOrders();
    },

    createOrder: async (orderData: Partial<Order>) => {
      try {
        set({ submitting: true });
        const token = getAuthToken();

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await orderService.createOrder(orderData, token);

        await get().loadOrders();
        await get().loadStats();
        toast.success('Order created successfully');

        return response;
      } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
      } finally {
        set({ submitting: false });
      }
    },

    updateOrder: async (id: number, orderData: Partial<Order>) => {
      try {
        set({ submitting: true });
        const token = getAuthToken();

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await orderService.updateOrder(id, orderData, token);

        await get().loadOrders();
        await get().loadStats();
        toast.success('Order updated successfully');

        return response;
      } catch (error) {
        console.error('Failed to update order:', error);
        throw error;
      } finally {
        set({ submitting: false });
      }
    },

    deleteOrders: async (ids: number[]) => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        await orderService.deleteOrders(ids, token);

        set((state) => ({
          orders: state.orders.filter((order) => !ids.includes(order.id)),
          totalCount: state.totalCount - ids.length,
        }));

        toast.success(
          `Successfully deleted ${ids.length} order${ids.length > 1 ? 's' : ''}`
        );
      } catch (error) {
        console.error('Failed to delete orders:', error);
        toast.error('Failed to delete orders');
      }
    },

    softDeleteOrders: async (ids: number[]) => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        if (!Array.isArray(ids) || ids.length === 0) {
          throw new Error('No order IDs provided for soft delete');
        }

        await orderService.softDeleteOrders(ids, token);

        // Refresh orders and stats to get latest data
        await get().loadOrders();
        await get().loadStats();

        toast.success(
          `Successfully soft deleted ${ids.length} order${
            ids.length > 1 ? 's' : ''
          }`
        );
      } catch (error) {
        console.error('Failed to soft delete orders:', error);
        toast.error('Failed to soft delete orders');
      }
    },

    loadStats: async () => {
      set({ loading: true });
      try {
        const token = getAuthToken();
        const stats = await orderService.getOrderStats(token);
        set({ stats, loading: false });
      } catch (error) {
        console.error('Error loading order stats:', error);
        set({ loading: false });
      }
    },
  };
});

export default useOrderStore;
