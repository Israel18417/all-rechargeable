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
    <div className="group h-full overflow-hidden rounded-[28px] border border-purple-100 bg-white shadow-[0_12px_35px_rgba(124,58,237,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(124,58,237,0.12)]">
      <Link href={`/products/detail?id=${encodeURIComponent(product.id)}`} className="block">
        <div className="relative h-60 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🔋</div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">Out of Stock</span>
            </div>
          )}

          {product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-purple-900">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-purple-700">
            {product.category}
          </span>
          <span className="text-xs font-medium text-gray-500">{product.inStock ? 'Available' : 'Unavailable'}</span>
        </div>

        <Link href={`/products/detail?id=${encodeURIComponent(product.id)}`} className="block">
          <h3 className="line-clamp-2 text-lg font-extrabold leading-snug text-gray-800 transition-colors hover:text-purple-700">
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm leading-6 text-gray-500">{product.description}</p>

        <div className="flex items-end justify-between gap-3 pt-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400">From</p>
            <p className="text-2xl font-black text-purple-700">₦{product.price.toLocaleString()}</p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
              !product.inStock
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : added
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-700 text-white hover:bg-purple-900'
            }`}
          >
            {!product.inStock ? 'Sold out' : added ? 'Added!' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
