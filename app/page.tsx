'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import BrandLogo from '@/components/BrandLogo';
import { sampleCategories, featuredSampleProducts } from '@/lib/sampleCatalog';

const categories = sampleCategories;

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(featuredSampleProducts);
  const [loading, setLoading] = useState(false);

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
        if (products.length > 0) {
          setFeaturedProducts(products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)' }} className="relative overflow-hidden px-4 py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-purple-100 backdrop-blur-sm">
            <span>⚡</span> Trusted rechargeable essentials for homes, offices & businesses
          </div>
          <div className="mb-5 flex justify-center">
            <BrandLogo className="h-20 w-20" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">
            Power Up Your Life
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-purple-200 md:text-2xl">
            Premium rechargeable products delivered to your doorstep in Nigeria. Built for reliability, comfort, and everyday convenience.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/products"
              className="rounded-full bg-white px-8 py-4 text-lg font-bold text-purple-700 shadow-lg transition-all hover:bg-yellow-300 hover:text-purple-900"
            >
              Shop Now 🛒
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-white px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white hover:text-purple-700"
            >
              Chat on WhatsApp 💬
            </a>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 text-left md:grid-cols-4">
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
      <section className="bg-purple-50 px-4 py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {[
            { icon: '✅', title: 'Quality Products', desc: 'Every product is tested and trusted' },
            { icon: '🚚', title: 'Fast Delivery', desc: 'Quick delivery across Nigeria' },
            { icon: '💬', title: 'WhatsApp Support', desc: 'Order easily via WhatsApp' },
          ].map((item) => (
            <div key={item.title} className="transform rounded-[28px] border border-purple-100 bg-white p-7 shadow-[0_14px_40px_rgba(91,33,182,0.06)] transition-transform hover:-translate-y-1">
              <div className="mb-3 text-4xl">{item.icon}</div>
              <h3 className="mb-1 text-lg font-bold text-purple-800">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-purple-500">Popular Categories</p>
          <h2 className="text-3xl font-extrabold text-purple-800 md:text-4xl">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="group flex flex-col items-center gap-3 rounded-[24px] border border-purple-100 bg-white p-5 shadow-[0_8px_25px_rgba(124,58,237,0.05)] transition-all hover:-translate-y-1 hover:border-purple-300 hover:shadow-[0_14px_35px_rgba(124,58,237,0.1)]"
            >
              <span className="text-4xl transition-transform group-hover:scale-110">{cat.icon}</span>
              <span className="text-sm font-bold text-purple-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-purple-50 px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-purple-500">Top picks</p>
              <h2 className="text-3xl font-extrabold text-purple-800 md:text-4xl">⭐ Featured Products</h2>
            </div>
            <Link href="/products" className="font-semibold text-purple-600 transition-colors hover:text-purple-800">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-72 animate-pulse rounded-[28px] bg-white" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <div className="mb-4 text-5xl">🔋</div>
              <p className="text-lg">Products coming soon! Check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
