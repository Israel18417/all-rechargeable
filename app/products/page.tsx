'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { sampleCategories, sampleProducts } from '@/lib/sampleCatalog';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [filtered, setFiltered] = useState<Product[]>(sampleProducts);
  const [categories, setCategories] = useState<string[]>(['All', ...sampleCategories.map(cat => cat.name)]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
        const snap = await getDocs(q);
        const dbCategories = snap.docs.map(doc => doc.data().name as string).filter(Boolean);
        const categoryList = dbCategories.length > 0 ? dbCategories : sampleCategories.map(cat => cat.name);
        setCategories(['All', ...categoryList]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['All', ...sampleCategories.map(cat => cat.name)]);
      }
    };

    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('inStock', '==', true), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        if (data.length > 0) {
          setProducts(data);
          setFiltered(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categories.length > 1 && !categories.includes(activeCategory)) {
      setActiveCategory('All');
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [products, activeCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-purple-800 mb-2">Our Products</h1>
        <p className="text-gray-500">Discover our range of quality rechargeable products</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-xl mx-auto">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-purple-200 rounded-full focus:outline-none focus:border-purple-500 text-gray-700"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
              activeCategory === cat
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🔋</div>
          <p className="text-xl font-semibold">No products found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-purple-600">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
