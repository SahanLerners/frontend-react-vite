import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react';
import { AppDispatch } from '../../store/store';
import apiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

interface StatsCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
  color: string;
}

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  userGrowth: number;
  productGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
  };
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
  totalRevenue: number;
}
const DashboardOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [productStats, orderStats, userStats] = await Promise.all([
          apiService.getProductStats(),
          apiService.getOrderStats(),
          apiService.getUserStats(),
        ]);

        const dashboardStats: DashboardStats = {
          totalUsers: userStats.data.totalUsers || 0,
          totalProducts: productStats.data.totalProducts || 0,
          totalOrders: orderStats.data.totalOrders || 0,
          totalRevenue: orderStats.data.totalRevenue || 0,
          userGrowth: userStats.data.growthPercentage || 0,
          productGrowth: productStats.data.growthPercentage || 0,
          orderGrowth: orderStats.data.orderGrowthPercentage || 0,
          revenueGrowth: orderStats.data.revenueGrowthPercentage || 0,
        };

        setStats([
          {
            title: 'Total Users',
            value: dashboardStats.totalUsers.toLocaleString(),
            change: `${dashboardStats.userGrowth >= 0 ? '+' : ''}${dashboardStats.userGrowth.toFixed(1)}%`,
            changeType: dashboardStats.userGrowth >= 0 ? 'increase' : 'decrease',
            icon: Users,
            color: 'bg-blue-500',
          },
          {
            title: 'Total Products',
            value: dashboardStats.totalProducts.toLocaleString(),
            change: `${dashboardStats.productGrowth >= 0 ? '+' : ''}${dashboardStats.productGrowth.toFixed(1)}%`,
            changeType: dashboardStats.productGrowth >= 0 ? 'increase' : 'decrease',
            icon: Package,
            color: 'bg-green-500',
          },
          {
            title: 'Total Orders',
            value: dashboardStats.totalOrders.toLocaleString(),
            change: `${dashboardStats.orderGrowth >= 0 ? '+' : ''}${dashboardStats.orderGrowth.toFixed(1)}%`,
            changeType: dashboardStats.orderGrowth >= 0 ? 'increase' : 'decrease',
            icon: ShoppingBag,
            color: 'bg-purple-500',
          },
          {
            title: 'Revenue',
            value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
            change: `${dashboardStats.revenueGrowth >= 0 ? '+' : ''}${dashboardStats.revenueGrowth.toFixed(1)}%`,
            changeType: dashboardStats.revenueGrowth >= 0 ? 'increase' : 'decrease',
            icon: DollarSign,
            color: 'bg-yellow-500',
          },
        ]);

        // Set recent orders and top products from API response
        setRecentOrders(orderStats.data.recentOrders || []);
        setTopProducts(productStats.data.topProducts || []);

      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600">{product.totalSold} sales</p>
                      <p className="text-sm font-semibold text-gray-900">${product.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardOverview;