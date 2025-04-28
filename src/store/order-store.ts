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
  updateOrder: (id: string, orderData: Partial<Order>) => Promise<Order>;
  deleteOrders: (ids: string[]) => Promise<void>;
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

        const response = await orderService.getOrders(
          {
            page: filter.page,
            limit: filter.pageSize,
            searchTerm: filter.searchTerm,
            sortBy: filter.sortBy,
            sortDirection: filter.sortDirection.toUpperCase() as 'ASC' | 'DESC',
            status: filter.status,
          },
          token
        );

        set({
          orders: response,
          totalCount: response.length,
          loading: false,
        });
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error('Failed to load orders');
        set({ loading: false });

        if (
          error instanceof Error &&
          error.message === 'No authentication token found'
        ) {
          window.location.href = '/login';
        }
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

        set((state) => ({
          orders: [response, ...state.orders],
          totalCount: state.totalCount + 1,
        }));

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

        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? response : o)),
        }));

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
          orders: state.orders.filter(
            (order) => !ids.includes(String(order.id))
          ),
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

    setFilter: (newFilter) =>
      set((state) => ({
        filter: {
          ...state.filter,
          ...newFilter,
        },
      })),

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
