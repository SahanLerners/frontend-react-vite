import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { OrderState } from '../../types';
import { ApiResponse, OrdersResponse } from '../../types/api';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response: ApiResponse<import('../../types').Order> = await apiService.createOrder(orderData) as ApiResponse<import('../../types').Order>;
      toast.success('Order placed successfully!');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response: OrdersResponse = await apiService.getUserOrders(params) as OrdersResponse;
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<import('../../types').Order> = await apiService.getOrderById(id) as ApiResponse<import('../../types').Order>;
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response: OrdersResponse = await apiService.getAllOrders(params) as OrdersResponse;
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<import('../../types').Order> = await apiService.updateOrderStatus(id, data) as ApiResponse<import('../../types').Order>;
      toast.success('Order status updated successfully!');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure orders is always an array
        state.orders = Array.isArray(action.payload.data) ? action.payload.data : [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.orders = []; // Reset to empty array on error
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        // Ensure orders is always an array
        state.orders = Array.isArray(action.payload.data) ? action.payload.data : [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchAllOrders.rejected, (state) => {
        state.orders = []; // Reset to empty array on error
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;