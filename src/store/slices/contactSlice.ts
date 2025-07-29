import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import apiService from '../../services/api.ts';
import { ContactForm } from '../../types';
import toast from 'react-hot-toast';

interface ContactState {
    contact: {
        name: string;
        email: string;
        subject: string;
        message: string;
    };
    loading: boolean;
    error: string | null;
}

const initialState: ContactState = {
    contact: {
        name: '',
        email: '',
        subject: '',
        message: '',
    },
    loading: false,
    error: null,
};

export const sendContactMessage = createAsyncThunk(
    'contact',
    async (data: ContactForm, { rejectWithValue }) => {
        try {
            const response = await apiService.sendContactMessage(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send contact message');
        }
    }
);

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        updateContact: (state, action) => {
            state.contact = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendContactMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendContactMessage.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                toast.success('Message sent successfully! We\'ll get back to you soon.');
            })
            .addCase(sendContactMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error('Failed to send message. Please try again.');
            });
    },
});

export const { updateContact } = contactSlice.actions;
export default contactSlice.reducer;