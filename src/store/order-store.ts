import { create } from 'zustand';
import { orderService } from '@/services/orders.service';
import {
  Order,
  OrderFilterProps,
  OrderStats,
  OrderStatus,
} from '@/types/order';
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
    sortDirection: 'ASC' | 'DESC';
    searchTerm: string;
    status?: OrderStatus;
  };
  stats: OrderStats;
  selectedOrders: number[];

  // Actions
  loadOrders: () => Promise<void>;
  selectAllFiltered: () => Promise<number[]>;
  getAllFilteredOrdersIds: (filter: OrderFilterProps) => Promise<number[]>;
  // CRUD operations
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrder: (id: number, orderData: Partial<Order>) => Promise<Order>;
  deleteOrders: (ids: number[]) => Promise<void>;
  softDeleteOrders: (ids: number[]) => Promise<void>;
  setFilter: (filter: Partial<OrderState['filter']>) => void;
  loadStats: () => Promise<void>;
  resetFilter: () => void;
  exportOrders: (
    format: 'csv' | 'xlsx' | 'pdf',
    selectedIds?: number[]
  ) => Promise<boolean>;
}

const DEFAULT_FILTER = {
  page: 1,
  pageSize: 10,
  sortBy: 'created_at',
  sortDirection: 'DESC' as const,
  searchTerm: '',
};

// Create the store with proper typing
const createOrderStore = (
  set: (
    state: Partial<OrderState> | ((state: OrderState) => Partial<OrderState>)
  ) => void,
  get: () => OrderState
): OrderState => ({
  // State
  orders: [],
  currentOrder: null,
  loading: false,
  submitting: false,
  totalCount: 0,
  selectedOrders: [],
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

  // Actions
  loadOrders: async () => {
    set({ loading: true });
    try {
      const { filter } = get();

      const apiFilter = {
        page: filter.page,
        limit: filter.pageSize,
        search: filter.searchTerm,
        sortBy: filter.sortBy,
        sortOrder: filter.sortDirection,
        status: filter.status,
      };

      const response = await orderService.getOrders(apiFilter);

      set({
        orders: Array.isArray(response.data) ? response.data : response.data,
        totalCount: response.meta.total,
        loading: false,
      });
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      set({ loading: false });
    }
  },

  // In order-store.ts
  exportOrders: async (
    format: 'csv' | 'xlsx' | 'pdf',
    selectedIds: number[] = []
  ) => {
    try {
      set({ loading: true });

      const { filter } = get();
      const blob = await orderService.exportOrders(
        format,
        selectedIds.length > 0 ? selectedIds : undefined,
        filter
      );

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `orders_${new Date().toISOString().split('T')[0]}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export orders');
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // Add this if you want a "select all" feature
  selectAllFiltered: async () => {
    try {
      const ids = await orderService.getAllFilteredOrdersIds(get().filter);
      set({ selectedOrders: ids });
      return ids;
    } catch (error) {
      console.error('Failed to select all:', error);
      return [];
    }
  },

  getAllFilteredOrdersIds: async (filter: OrderFilterProps) => {
    try {
      const response = await orderService.getAllFilteredOrdersIds(filter);
      return response;
    } catch (error) {
      console.error('Error fetching order IDs:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to fetch order IDs'
      );
      return [];
    }
  },

  // In order-store.ts
  setFilter: (newFilter) => {
    set((state) => {
      const updatedFilter = {
        ...state.filter,
        ...newFilter,
      };

      // Handle status filter
      if ('status' in newFilter && newFilter.status === 'all') {
        updatedFilter.status = undefined;
      }

      // Reset to page 1 if any filter changes (except page itself)
      const isFilterChanging = Object.keys(newFilter).some(
        (key) => key !== 'page' && key !== 'pageSize'
      );

      if (isFilterChanging) {
        updatedFilter.page = 1;
      }

      return { filter: updatedFilter };
    });

    // Load orders with new filter
    get().loadOrders();
  },

  resetFilter: () => {
    set({
      filter: { ...DEFAULT_FILTER },
      selectedOrders: [],
    });
    get().loadOrders();
  },

  createOrder: async (orderData: Partial<Order>) => {
    try {
      set({ submitting: true });
      const response = await orderService.createOrder(orderData);

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
      const response = await orderService.updateOrder(id, orderData);

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
      await orderService.deleteOrders(ids);

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
      if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error('No order IDs provided for soft delete');
      }

      await orderService.softDeleteOrders(ids);

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
      const stats = await orderService.getOrderStats();
      set({ stats, loading: false });
    } catch (error) {
      console.error('Error loading order stats:', error);
      set({ loading: false });
    }
  },
});

// Create the store with proper typing
const useOrderStore = create<OrderState>((set, get) => ({
  ...createOrderStore(set, get),
}));

export default useOrderStore;
