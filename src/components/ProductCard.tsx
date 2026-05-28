'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, MapPin, BadgeCheck } from 'lucide-react';

export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  image: string;
  seller: string;
  location?: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  verified?: boolean;
  tenantId: string;
}

interface ProductCardProps {
  product: ProductCardData;
  index?: number;
}

const conditionColors = {
  new: { bg: 'bg-emerald-900/30', text: 'text-emerald-300', label: 'New' },
  'like-new': {
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
    label: 'Like New',
  },
  good: { bg: 'bg-yellow-900/30', text: 'text-yellow-300', label: 'Good' },
  fair: { bg: 'bg-orange-900/30', text: 'text-orange-300', label: 'Fair' },
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  const condition = conditionColors[product.condition];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
      },
    },
  };

  const hoverVariants = {
    rest: { y: 0, boxShadow: 'var(--shadow-normal)' },
    hover: {
      y: -8,
      boxShadow:
        '0 20px 60px -10px rgba(0, 0, 0, 0.6), 0 0 40px rgba(59, 130, 246, 0.1)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <Link href={`/${product.tenantId}/product/${product.id}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          variants={hoverVariants}
          initial="rest"
          animate={isHovering ? 'hover' : 'rest'}
          className="relative h-full rounded-xl overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 group cursor-pointer transition-all"
        >
          {/* Image Container */}
          <div className="relative w-full aspect-video bg-gray-950 overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              animate={isHovering ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/80" />

            {/* Condition badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-semibold ${condition.bg} ${condition.text} backdrop-blur-sm border border-opacity-20 border-white`}
            >
              {condition.label}
            </motion.div>

            {/* Favorite button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}
              className="absolute top-3 right-3 bg-gray-900/60 hover:bg-gray-900/80 backdrop-blur-sm text-white p-2 rounded-full transition-all border border-gray-700"
            >
              <Heart
                className="w-4 h-4"
                fill={isFavorite ? 'currentColor' : 'none'}
                color={isFavorite ? '#ef4444' : 'currentColor'}
              />
            </motion.button>

            {/* Price overlay - appears on hover */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isHovering ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"
            >
              <div className="text-2xl font-bold text-cyan-400">₹{product.price.toLocaleString()}</div>
            </motion.div>
          </div>

          {/* Content Container */}
          <div className="p-4">
            {/* Title */}
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-3 group-hover:text-cyan-300 transition-colors">
              {product.title}
            </h3>

            {/* Seller info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
                <span className="text-xs text-gray-300 truncate flex items-center gap-1">
                  {product.seller}
                  {product.verified && (
                    <BadgeCheck className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  )}
                </span>
              </div>
            </div>

            {/* Location */}
            {product.location && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{product.location}</span>
              </div>
            )}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isHovering ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 border-t border-gray-700"
            >
              <button className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg transition-all shadow-lg hover:shadow-cyan-500/30">
                View Details
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}
