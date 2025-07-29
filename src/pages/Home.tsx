import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, Star, Shield, Truck, Headphones } from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { fetchFeaturedProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredProducts, loading } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts(8));
    dispatch(fetchCategories({ status: 'active' }));
  }, [dispatch]);

  const features = [
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'All products come with manufacturer warranty and quality assurance',
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free delivery on orders over $500. Express delivery available',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Professional customer support available round the clock',
    },
    {
      icon: Star,
      title: 'Best Prices',
      description: 'Competitive pricing with regular discounts and special offers',
    },
  ];

  // Ensure arrays are safe
  const safeFeaturedProducts = Array.isArray(featuredProducts) ? featuredProducts : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your Gateway to
                <span className="block text-blue-300">Premium Tech</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Discover the latest computers, laptops, and accessories at unbeatable prices. 
                From gaming rigs to professional workstations, we have everything you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products?featured=true"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  Featured Products
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg"
                alt="Gaming Setup"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-blue-900 p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-gray-600">Products Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Techno Computers?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best technology solutions with exceptional service and support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Explore our wide range of technology categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {safeCategories.slice(0, 5).map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <span className="text-2xl group-hover:text-white">💻</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-gray-600">Discover our handpicked selection of premium products</p>
            </div>
            <Link
              to="/products?featured=true"
              className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {safeFeaturedProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products?featured=true"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View All Featured Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, special offers, and tech news.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;