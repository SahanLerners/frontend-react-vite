import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { addToCart } from '../../store/slices/cartSlice';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isCustomer } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (!isCustomer) {
      toast.error('Only customers can add items to cart');
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0] || 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg'}
            alt={product.name}
            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              Featured
            </div>
          )}
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              -{discountPercentage}%
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
            <button className="p-3 bg-white rounded-full hover:bg-gray-50 transition-colors">
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 bg-white rounded-full hover:bg-gray-50 transition-colors">
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4 sm:p-6">
        <div className="mb-2">
          <span className="text-sm text-blue-600 font-medium">{product.brand}</span>
          <span className="text-sm text-gray-500 ml-2">• {product.category}</span>
        </div>
        
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-bold text-blue-600">
                  ${product.discountPrice.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Stock: {product.stock}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
          >
            View Details
          </Link>
          {isAuthenticated && isCustomer && (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;