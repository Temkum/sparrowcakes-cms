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
}

const useOrderStore = create<OrderState>((set, get) => {
  const getAuthToken = () => {
    const persistedState = JSON.parse(
      localStorage.getItem('auth-storage') || '{}'
    );
    return persistedState.state?.token || null;
  };

  return {
    orders: [],
    currentOrder: null,
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
        const { filter } = get();
        const token = getAuthToken();

        if (!token) {
          throw new Error('No authentication token found');
        }

        // Clean filter values before sending to API
        const cleanFilter = {
          page: filter.page,
          limit: filter.pageSize,
          searchTerm: filter.searchTerm?.trim() || undefined,
          sortBy: filter.sortBy,
          sortDirection: filter.sortDirection.toUpperCase() as 'ASC' | 'DESC',
          status: filter.status,
        };

        const response = await orderService.getOrders(cleanFilter, token);

        // Apply client-side filtering if API doesn't support it fully
        // This is a fallback if the API doesn't handle filtering properly
        let filteredOrders = [...response];

        // Apply status filter if set
        if (filter.status) {
          filteredOrders = filteredOrders.filter(
            (order) => order.status === filter.status
          );
        }

        // Apply search filter if set
        if (filter.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase();
          filteredOrders = filteredOrders.filter(
            (order) =>
              order.order_number.toLowerCase().includes(searchLower) ||
              (order.customer?.name &&
                order.customer.name.toLowerCase().includes(searchLower)) ||
              String(order.id).includes(searchLower) ||
              (order.notes && order.notes.toLowerCase().includes(searchLower))
          );
        }

        // Apply sorting
        filteredOrders.sort((a, b) => {
          const sortField = filter.sortBy as keyof Order;
          let aValue = a[sortField];
          let bValue = b[sortField];

          // Handle special cases for complex fields
          if (sortField === 'customer' && a.customer && b.customer) {
            aValue = a.customer.name;
            bValue = b.customer.name;
          }

          // Compare values based on their types
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return filter.sortDirection === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          // Handle dates
          if (aValue instanceof Date && bValue instanceof Date) {
            return filter.sortDirection === 'asc'
              ? aValue.getTime() - bValue.getTime()
              : bValue.getTime() - aValue.getTime();
          }

          // Default numeric comparison
          if (aValue !== undefined && bValue !== undefined) {
            return filter.sortDirection === 'asc'
              ? Number(aValue) - Number(bValue)
              : Number(bValue) - Number(aValue);
          }

          return 0;
        });

        set({
          orders: filteredOrders,
          totalCount: response.length,
          loading: false,
        });
      } catch (error) {
        console.error('Error loading orders:', error);
        set({ loading: false });
        throw error;
      }
    },

    createOrder: async (orderData) => {
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

    updateOrder: async (id, orderData) => {
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

    deleteOrders: async (ids) => {
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
        throw error;
      }
    },

    softDeleteOrders: async (ids: number[]): Promise<void> => {
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
        throw error;
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
    },

    loadStats: async () => {
      set({ loading: true });
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const stats = await orderService.getOrderStats(token);
        set({ stats, loading: false });
      } catch (error) {
        console.error('Error loading order stats:', error);
        toast.error('Failed to load order statistics');
        set({ loading: false });
      }
    },
  };
});

export default useOrderStore;
