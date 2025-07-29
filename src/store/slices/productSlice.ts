import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductState, Product } from '../../types';
import { ProductsResponse, FeaturedProductsResponse, ApiResponse } from '../../types/api';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {},
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response: ProductsResponse = await apiService.getProducts(params) as ProductsResponse;
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit: number = 8, { rejectWithValue }) => {
    try {
      const response: FeaturedProductsResponse = await apiService.getFeaturedProducts(limit) as FeaturedProductsResponse;
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Product> = await apiService.getProductById(id) as ApiResponse<Product>;
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (params: any, { rejectWithValue }) => {
    try {
      const response: ProductsResponse = await apiService.searchProducts(params) as ProductsResponse;
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: any, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Product> = await apiService.createProduct(productData) as ApiResponse<Product>;
      toast.success('Product created successfully!');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Product> = await apiService.updateProduct(id, data) as ApiResponse<Product>;
      toast.success('Product updated successfully!');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.deleteProduct(id);
      toast.success('Product deleted successfully!');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure products is always an array
        state.products = Array.isArray(action.payload.data) ? action.payload.data : [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.products = []; // Reset to empty array on error
      })
      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        // Ensure featuredProducts is always an array
        state.featuredProducts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFeaturedProducts.rejected, (state) => {
        state.featuredProducts = []; // Reset to empty array on error
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Search Products
      .addCase(searchProducts.fulfilled, (state, action) => {
        // Ensure products is always an array
        state.products = Array.isArray(action.payload.data) ? action.payload.data : [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(searchProducts.rejected, (state) => {
        state.products = []; // Reset to empty array on error
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentProduct, setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;