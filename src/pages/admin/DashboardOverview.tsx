import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface StatsCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
  color: string;
}

const DashboardOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsCard[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats([
          {
            title: 'Total Users',
            value: '1,234',
            change: '+12%',
            changeType: 'increase',
            icon: Users,
            color: 'bg-blue-500',
          },
          {
            title: 'Total Products',
            value: '856',
            change: '+8%',
            changeType: 'increase',
            icon: Package,
            color: 'bg-green-500',
          },
          {
            title: 'Total Orders',
            value: '2,468',
            change: '+15%',
            changeType: 'increase',
            icon: ShoppingBag,
            color: 'bg-purple-500',
          },
          {
            title: 'Revenue',
            value: '$45,678',
            change: '-3%',
            changeType: 'decrease',
            icon: DollarSign,
            color: 'bg-yellow-500',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: '$299.99', status: 'completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: '$599.99', status: 'pending', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: '$899.99', status: 'processing', date: '2024-01-14' },
    { id: 'ORD-004', customer: 'Sarah Wilson', amount: '$199.99', status: 'shipped', date: '2024-01-14' },
    { id: 'ORD-005', customer: 'Tom Brown', amount: '$1,299.99', status: 'completed', date: '2024-01-13' },
  ];

  const topProducts = [
    { name: 'MacBook Pro 16"', sales: 45, revenue: '$89,999' },
    { name: 'Dell XPS 13', sales: 38, revenue: '$45,999' },
    { name: 'HP Spectre x360', sales: 32, revenue: '$38,999' },
    { name: 'Lenovo ThinkPad X1', sales: 28, revenue: '$33,999' },
    { name: 'ASUS ROG Strix', sales: 25, revenue: '$29,999' },
  ];

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
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{order.id}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-semibold text-gray-900">{order.amount}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
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
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600">{product.sales} sales</p>
                      <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Add New Product</p>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Manage Users</p>
            </div>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">View Reports</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;