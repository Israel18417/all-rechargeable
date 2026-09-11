'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }} className="text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-2xl">⚡</span>
          <span>All Rechargeable<span className="text-yellow-300">+</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-yellow-300 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-yellow-300 transition-colors">Products</Link>
          <Link href="/about" className="hover:text-yellow-300 transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-yellow-300 transition-colors">Contact</Link>
        </div>

        {/* Cart Icon */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative flex items-center gap-1 bg-white text-purple-700 font-semibold px-4 py-2 rounded-full hover:bg-yellow-300 hover:text-purple-900 transition-all shadow">
            <span>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-purple-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-purple-900 px-4 py-4 flex flex-col gap-4 font-medium text-lg">
          <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300">Home</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300">Products</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300">About Us</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300">Contact</Link>
        </div>
      )}
    </nav>
  );
}
