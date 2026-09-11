'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-purple-100">
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-52 bg-purple-50 overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🔋
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">Out of Stock</span>
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <span className="text-xs text-purple-500 font-medium uppercase tracking-wide">{product.category}</span>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-800 mt-1 mb-1 text-lg line-clamp-2 hover:text-purple-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-700">
            ₦{product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              !product.inStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-green-500 text-white'
                : 'bg-purple-700 text-white hover:bg-purple-900'
            }`}
          >
            {!product.inStock ? 'Out of Stock' : added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
