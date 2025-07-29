import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { ApiResponse, LoginResponse } from '../types/api';

const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
    );

    // Response interceptor
    this.api.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const refreshToken = localStorage.getItem('refreshToken');
              if (refreshToken) {
                const response = await this.api.post('/auth/refresh-token', {
                  refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                return this.api(originalRequest);
              }
            } catch (refreshError) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }

          // Show error toast for API errors
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else if (error.message) {
            toast.error(error.message);
          }

          return Promise.reject(error);
        }
    );
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }

  // Authentication
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<LoginResponse>> {
    return this.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
  }

  async register(userData: any) {
    return this.post('/auth/register', userData);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async updateProfile(data: any) {
    return this.put('/auth/profile', data);
  }

  async changePassword(data: any) {
    return this.post('/auth/change-password', data);
  }

  // Products
  async getProducts(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.get(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getFeaturedProducts(limit?: number) {
    return this.get(`/products/featured${limit ? `?limit=${limit}` : ''}`);
  }

  async getProductById(id: string) {
    return this.get(`/products/${id}`);
  }

  async searchProducts(params: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/products/search?${queryString}`);
  }

  async createProduct(data: any) {
    return this.post('/products', data);
  }

  async updateProduct(id: string, data: any) {
    return this.put(`/products/${id}`, data);
  }

  async deleteProduct(id: string) {
    return this.delete(`/products/${id}`);
  }

  // Categories
  async getCategories(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.get(`/categories${queryString ? `?${queryString}` : ''}`);
  }

  async createCategory(data: any) {
    return this.post('/categories', data);
  }

  async updateCategory(id: string, data: any) {
    return this.put(`/categories/${id}`, data);
  }

  async deleteCategory(id: string) {
    return this.delete(`/categories/${id}`);
  }

  // Cart
  async getCart() {
    return this.get('/cart');
  }

  async addToCart(data: { productId: string; quantity: number }) {
    return this.post('/cart/add', data);
  }

  async updateCartItem(productId: string, data: { quantity: number }) {
    return this.put(`/cart/item/${productId}`, data);
  }

  async removeFromCart(productId: string) {
    return this.delete(`/cart/item/${productId}`);
  }

  async clearCart() {
    return this.delete('/cart/clear');
  }

  // Orders
  async createOrder(data: any) {
    return this.post('/orders', data);
  }

  async getUserOrders(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.get(`/orders/my-orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrderById(id: string) {
    return this.get(`/orders/${id}`);
  }

  async getAllOrders(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.get(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async updateOrderStatus(id: string, data: any) {
    return this.put(`/orders/${id}/status`, data);
  }

  // Users (Admin)
  async getUsers(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.get(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUserById(id: string) {
    return this.get(`/users/${id}`);
  }

  async updateUserStatus(id: string, data: { status: string }) {
    return this.put(`/users/${id}/status`, data);
  }

  // Contact
  async sendContactMessage(data: any) {
    return this.post('/contact', data);
  }
}

export default new ApiService();