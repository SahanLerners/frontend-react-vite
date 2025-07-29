import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Package, Eye, Calendar, CreditCard, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { fetchUserOrders, fetchOrderById } from '../store/slices/orderSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const Orders: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const { orders, currentOrder, loading, pagination } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    } else {
      dispatch(fetchUserOrders({ page: currentPage, limit: 10 }));
    }
  }, [dispatch, id, currentPage]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'confirmed':
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Single Order View
  if (id && currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link to="/orders" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
              ← Back to Orders
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order #{currentOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(currentOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(currentOrder.orderStatus)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.orderStatus)}`}>
                      {currentOrder.orderStatus.charAt(0).toUpperCase() + currentOrder.orderStatus.slice(1)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(currentOrder.paymentStatus)}`}>
                    {currentOrder.paymentStatus.charAt(0).toUpperCase() + currentOrder.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {currentOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.image || 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">
                      {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}
                    </p>
                    <p className="text-gray-600">{currentOrder.shippingAddress.address}</p>
                    <p className="text-gray-600">
                      {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-600">{currentOrder.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {currentOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${currentOrder.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {currentOrder.notes && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{currentOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Orders List View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <div className="text-sm text-gray-600">
            {pagination.totalItems} orders found
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CreditCard className="w-4 h-4" />
                            <span className="capitalize">{order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.orderStatus)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
                className="mt-8"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;