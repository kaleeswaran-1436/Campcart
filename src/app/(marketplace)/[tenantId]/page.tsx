'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTenant } from '@/context/TenantContext';
import { ProductCard, ProductCardData } from '@/components/ProductCard';
import { Zap, Search, TrendingUp } from 'lucide-react';

interface MarketplacePageProps {
  params: Promise<{
    tenantId: string;
  }>;
}

// Mock products data - replace with API call
const MOCK_PRODUCTS: ProductCardData[] = [
  {
    id: '1',
    title: 'MacBook Pro 14" 2023 - M2 Pro',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    seller: 'Alex Kumar',
    location: 'Campus Hostel A',
    condition: 'like-new',
    verified: true,
    tenantId: 'srm',
  },
  {
    id: '2',
    title: 'Sony WH-1000XM5 Headphones',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    seller: 'Priya Singh',
    location: 'North Campus',
    condition: 'good',
    verified: true,
    tenantId: 'srm',
  },
  {
    id: '3',
    title: 'iPad Air 5 256GB - WiFi',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1561588185-af778394ac66?w=500&h=500&fit=crop',
    seller: 'Rahul Patel',
    location: 'East Campus',
    condition: 'new',
    verified: false,
    tenantId: 'srm',
  },
  {
    id: '4',
    title: 'Canon EOS 5D Mark IV DSLR',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1610933752979-e81e7f85a001?w=500&h=500&fit=crop',
    seller: 'Isha Desai',
    location: 'Photography Club',
    condition: 'good',
    verified: true,
    tenantId: 'srm',
  },
  {
    id: '5',
    title: 'Desk Lamp with USB Charging',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop',
    seller: 'Vikram Sinha',
    location: 'South Campus',
    condition: 'like-new',
    verified: true,
    tenantId: 'srm',
  },
  {
    id: '6',
    title: 'Gaming Mechanical Keyboard RGB',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1587829191301-795b74cbb3b6?w=500&h=500&fit=crop',
    seller: 'Arjun Kumar',
    location: 'Boys Hostel Wing B',
    condition: 'good',
    verified: false,
    tenantId: 'srm',
  },
];

export default function MarketplacePage({ params }: MarketplacePageProps) {
  const { campus, tenantId, loading } = useTenant();
  const [param, setParam] = React.useState<{ tenantId: string } | null>(null);
  const [products, setProducts] = useState<ProductCardData[]>(MOCK_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<ProductCardData[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Handle async params
  React.useEffect(() => {
    params.then(setParam);
  }, [params]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    // Simulate search delay for UX
    const timer = setTimeout(() => {
      if (query.trim()) {
        const filtered = products.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.seller.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(products);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-gray-700 border-t-cyan-400 rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-2xl">
          {/* Campus Logo / Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-600/30 rounded-full backdrop-blur-md"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">
              {campus?.name || 'CampCart Marketplace'}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent leading-tight"
          >
            Buy & Sell<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Campus Style
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-gray-300 mb-8 max-w-xl mx-auto"
          >
            Discover verified student sellers on your campus. Trade safely with peers you know.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative max-w-xl mx-auto mb-12"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for products, sellers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-6 py-4 bg-gray-800/50 border border-gray-700 hover:border-cyan-600/50 focus:border-cyan-500 rounded-xl text-white placeholder-gray-500 transition-all duration-300 pr-12 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />

              {/* Search glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-600/0 to-blue-600/0 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300 -z-10" />
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
            >
              Start Selling
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-700 transition-all"
            >
              Browse All
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
              Trending Now
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {searchQuery ? `Results for "${searchQuery}"` : 'Featured Products'}
          </h2>
          <p className="text-gray-400 mt-2">
            {filteredProducts.length} items{' '}
            {searchQuery ? 'found' : 'available'}
          </p>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg mb-2">No products found</p>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or browse all products
            </p>
          </motion.div>
        )}
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="border-y border-gray-800 px-4 py-12 mt-20"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '12K+', label: 'Active Users' },
            { value: '50K+', label: 'Products Listed' },
            { value: '₹10Cr+', label: 'Total Transactions' },
            { value: '98%', label: 'Seller Rating' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
