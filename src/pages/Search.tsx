import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, Grid, List, X } from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { searchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const Search: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'relevance',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  });

  const { products, loading, pagination } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);

  const brands = ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Samsung', 'LG', 'Sony'];

  useEffect(() => {
    dispatch(fetchCategories({ status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      const params = {
        q: query,
        page: searchParams.get('page') || '1',
        limit: '12',
        ...Object.fromEntries(
          Object.entries(localFilters).filter(([value]) => value !== '')
        ),
      };
      dispatch(searchProducts(params));
    }
  }, [dispatch, searchParams, localFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      params.set('page', '1');
      Object.entries(localFilters).forEach(([key, value]) => {
        if (value !== '') {
          params.set(key, value.toString());
        }
      });
      setSearchParams(params);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value !== '') {
        params.set(key, value.toString());
      }
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setLocalFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const currentQuery = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
              />
              <SearchIcon className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {currentQuery && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Search Results for "{currentQuery}"
              </h1>
              <p className="text-gray-600">
                {pagination.totalItems} products found
              </p>
            </div>
          )}
        </div>

        {currentQuery && (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                {(localFilters.category || localFilters.brand || localFilters.minPrice || localFilters.maxPrice) && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={localFilters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                      </label>
                      <select
                        value={localFilters.brand}
                        onChange={(e) => handleFilterChange('brand', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Brands</option>
                        {brands.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={localFilters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          placeholder="Min"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          value={localFilters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          placeholder="Max"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <select
                        value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
                        onChange={(e) => {
                          const [sortBy, sortOrder] = e.target.value.split('-');
                          handleFilterChange('sortBy', sortBy);
                          handleFilterChange('sortOrder', sortOrder);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="relevance-desc">Most Relevant</option>
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                      </select>
                    </div>

                    <button
                      onClick={applyFilters}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1">
                {loading ? (
                  <LoadingSpinner size="lg" className="py-12" />
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <SearchIcon className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                      {currentQuery 
                        ? `No results found for "${currentQuery}". Try different keywords or adjust your filters.`
                        : 'Enter a search term to find products.'
                      }
                    </p>
                    {currentQuery && (
                      <button
                        onClick={clearAllFilters}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                        : 'grid-cols-1'
                    }`}>
                      {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>

                    {pagination.totalPages > 1 && (
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                        className="mt-8"
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {!currentQuery && (
          <div className="text-center py-12">
            <SearchIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Products</h2>
            <p className="text-gray-600 mb-8">Enter keywords to find the products you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;