# Techno Computers Frontend

A modern React TypeScript frontend for the Techno Computers e-commerce platform.

## 🚀 Overview

This frontend application provides a comprehensive e-commerce experience with customer shopping features and admin management capabilities. Built with React 18, TypeScript, and modern development practices.

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: Detailed product pages with image galleries and specifications
- **Shopping Cart**: Real-time cart management with quantity updates
- **Checkout Process**: Secure checkout with shipping address and payment options
- **Order Management**: View order history and track order status
- **User Profile**: Account management and profile updates

### 👨‍💼 Admin Features
- **Dashboard**: Analytics overview with key metrics and charts
- **User Management**: Manage customer accounts and admin users
- **Product Management**: Full CRUD operations for product inventory
- **Category Management**: Organize products into categories
- **Order Management**: Process orders and update delivery status

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with enhanced IDE support
- **Redux Toolkit** - Efficient state management with RTK Query
- **React Router v6** - Client-side routing with nested routes
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Hook Form** - Performant forms with easy validation
- **Yup** - Schema validation for forms
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool and development server

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   └── common/          # Shared components (Header, Footer, etc.)
├── pages/               # Page components
│   ├── admin/           # Admin dashboard pages
│   └── auth/            # Authentication pages
├── store/               # Redux store configuration
│   └── slices/          # Redux slices for different features
├── services/            # API service layer
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
└── assets/              # Static assets (images, fonts, etc.)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

## 🏗️ Architecture

### State Management
The application uses Redux Toolkit for state management with the following slices:
- `authSlice` - User authentication and profile
- `productSlice` - Product catalog and details
- `cartSlice` - Shopping cart management
- `orderSlice` - Order history and tracking
- `categorySlice` - Product categories
- `userSlice` - User management (admin)

### API Integration
- Centralized API service using Axios
- Automatic token refresh and error handling
- Request/response interceptors for common operations
- Type-safe API calls with TypeScript interfaces

## 🎨 UI/UX Design

### Design System
- **Colors**: Custom brand palette with semantic color tokens
- **Typography**: Hierarchical text styles with consistent spacing
- **Components**: Reusable components following atomic design principles
- **Icons**: Lucide React icons for consistency and performance
- **Animations**: Subtle transitions and micro-interactions

### Responsive Design
- Mobile-first approach with progressive enhancement
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Flexible grid system using CSS Grid and Flexbox
- Touch-friendly interface elements for mobile devices

## 🔐 Authentication & Security

### Authentication Flow
1. User login with email/password
2. JWT token storage in localStorage
3. Automatic token refresh before expiration
4. Role-based route protection
5. Secure logout with token cleanup

### Protected Routes
- Customer routes require authentication
- Admin routes require admin role
- Automatic redirect to login for unauthorized access
- Persistent login state across browser sessions

**Happy coding! 🚀**