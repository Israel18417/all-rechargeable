'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

const categories = [
  { name: 'Fans', icon: '🌀' },
  { name: 'Bulbs', icon: '💡' },
  { name: 'Torches', icon: '🔦' },
  { name: 'Power Banks', icon: '🔋' },
  { name: 'Radios', icon: '📻' },
  { name: 'Others', icon: '⚡' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('featured', '==', true),
          where('inStock', '==', true),
          limit(4)
        );
        const snap = await getDocs(q);
        const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)' }} className="text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%)]" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-purple-100 backdrop-blur-sm mb-6">
            <span>⚡</span> Trusted rechargeable essentials for homes, offices & businesses
          </div>
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Power Up Your Life
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Premium rechargeable products delivered to your doorstep in Nigeria. Built for reliability, comfort, and everyday convenience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-purple-700 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-300 hover:text-purple-900 transition-all shadow-lg"
            >
              Shop Now 🛒
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white hover:text-purple-700 transition-all"
            >
              Chat on WhatsApp 💬
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            {[
              { label: 'Products', value: '200+' },
              { label: 'Happy buyers', value: '1.5k+' },
              { label: 'Delivery', value: '24/48h' },
              { label: 'Support', value: '24/7' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-sm text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 px-4 bg-purple-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: '✅', title: 'Quality Products', desc: 'Every product is tested and trusted' },
            { icon: '🚚', title: 'Fast Delivery', desc: 'Quick delivery across Nigeria' },
            { icon: '💬', title: 'WhatsApp Support', desc: 'Order easily via WhatsApp' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 transform hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-purple-800 text-lg mb-1">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="flex flex-col items-center gap-2 bg-white border-2 border-purple-100 rounded-2xl p-4 hover:border-purple-500 hover:shadow-md transition-all group"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-semibold text-purple-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 px-4 bg-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-purple-800">⭐ Featured Products</h2>
            <Link href="/products" className="text-purple-600 font-semibold hover:text-purple-800 transition-colors">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-4">🔋</div>
              <p className="text-lg">Products coming soon! Check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }} className="py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Power Up?</h2>
        <p className="text-purple-200 mb-6 text-lg">Browse our full catalog and find the perfect rechargeable product for you.</p>
        <Link
          href="/products"
          className="bg-yellow-400 text-purple-900 font-bold px-10 py-4 rounded-full text-lg hover:bg-yellow-300 transition-all shadow-lg inline-block"
        >
          Browse All Products
        </Link>
      </section>
    </div>
  );
}
