// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Auth API Responses
export interface LoginResponse {
  user: import('./index').User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: import('./index').User;
  accessToken: string;
  refreshToken: string;
}

// Product API Responses
export interface ProductsResponse {
  data: import('./index').Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FeaturedProductsResponse {
  data: import('./index').Product[];
}

// Cart API Responses
export interface CartResponse {
  data: import('./index').Cart;
}

// Order API Responses
export interface OrdersResponse {
  data: import('./index').Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// Category API Responses
export interface CategoriesResponse {
  data: import('./index').Category[];
}

// User API Responses
export interface UsersResponse {
  data: import('./index').User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}