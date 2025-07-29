import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryState } from '../../types';
import { CategoriesResponse, ApiResponse } from '../../types/api';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response: CategoriesResponse = await apiService.getCategories(params) as CategoriesResponse;
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: any, { rejectWithValue }) => {
    try {
      const response: ApiResponse<import('../../types').Category> = await apiService.createCategory(categoryData) as ApiResponse<import('../../types').Category>;
      toast.success('Category created successfully!');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<import('../../types').Category> = await apiService.updateCategory(id, data) as ApiResponse<import('../../types').Category>;
      toast.success('Category updated successfully!');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.deleteCategory(id);
      toast.success('Category deleted successfully!');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure categories is always an array
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.categories = []; // Reset to empty array on error
      })
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload);
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;