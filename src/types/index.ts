export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'customer';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  specifications?: Record<string, any>;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    search?: string;
  };
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  specifications?: Record<string, any>;
  featured: boolean;
}