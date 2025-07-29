import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  FolderOpen,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

// Admin Components
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import OrderManagement from './OrderManagement';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, current: location.pathname === '/admin' },
    { name: 'Users', href: '/admin/users', icon: Users, current: location.pathname === '/admin/users' },
    { name: 'Products', href: '/admin/products', icon: Package, current: location.pathname === '/admin/products' },
    { name: 'Categories', href: '/admin/categories', icon: FolderOpen, current: location.pathname === '/admin/categories' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, current: location.pathname === '/admin/orders' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: location.pathname === '/admin/analytics' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="analytics" element={<div className="p-8">Analytics - Coming Soon</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;