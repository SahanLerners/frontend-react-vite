import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { UsersResponse } from '../../types/api';
import apiService from '../../services/api';
import toast from 'react-hot-toast';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response: UsersResponse = await apiService.getUsers(params) as UsersResponse;
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      await apiService.updateUserStatus(id, { status });
      toast.success('User status updated successfully!');
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure users is always an array
        state.users = Array.isArray(action.payload.data) ? action.payload.data : [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.users = []; // Reset to empty array on error
      })
      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const user = state.users.find(u => u._id === id);
        if (user) {
          user.status = status as 'active' | 'inactive';
        }
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;