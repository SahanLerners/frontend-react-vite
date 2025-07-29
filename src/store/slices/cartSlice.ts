import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartState } from '../../types';
import { CartResponse } from '../../types/api';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response: CartResponse = await apiService.getCart() as CartResponse;
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response: CartResponse = await apiService.addToCart(data) as CartResponse;
      toast.success('Product added to cart!');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response: CartResponse = await apiService.updateCartItem(productId, { quantity }) as CartResponse;
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: string, { rejectWithValue }) => {
    try {
      await apiService.removeFromCart(productId);
      toast.success('Product removed from cart!');
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.clearCart();
      toast.success('Cart cleared!');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (state.cart) {
          state.cart.items = state.cart.items.filter(
            item => item.productId._id !== action.payload
          );
          state.cart.totalItems = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
          state.cart.totalAmount = state.cart.items.reduce((sum, item) => sum + item.total, 0);
        }
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;