'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { sampleProducts } from '@/lib/sampleCatalog';

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const [product, setProduct] = useState<Product | null>(() => {
    const productId = searchParams.get('id');
    if (!productId) return null;
    return sampleProducts.find((item) => item.id === productId) ?? null;
  });
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(() => {
    const productId = searchParams.get('id');
    if (!productId) return [];
    const selected = sampleProducts.find((item) => item.id === productId);
    if (!selected) return [];
    return sampleProducts.filter((item) => item.category === selected.category && item.id !== selected.id).slice(0, 4);
  });
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = searchParams.get('id');
        if (!productId) {
          router.push('/products');
          return;
        }

        const sampleMatch = sampleProducts.find((item) => item.id === productId);
        if (sampleMatch) {
          setProduct(sampleMatch);
          setRelatedProducts(
            sampleProducts
              .filter((item) => item.category === sampleMatch.category && item.id !== sampleMatch.id)
              .slice(0, 4)
          );
        }

        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const currentProduct = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(currentProduct);

          const q = query(
            collection(db, 'products'),
            where('category', '==', currentProduct.category),
            where('inStock', '==', true)
          );
          const relatedSnap = await getDocs(q);
          const related = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as Product))
            .filter(p => p.id !== currentProduct.id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else if (!sampleMatch) {
          router.push('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [searchParams, router]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `Hello! I'd like to order:\n- ${product.name} — ₦${product.price.toLocaleString()}\n\nPlease confirm availability.`;
    const waNumber = settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-xl font-semibold text-purple-600">Loading product...</div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="transition-colors hover:text-purple-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="transition-colors hover:text-purple-600">Products</Link>
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-[32px] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-purple-100 shadow-[0_18px_50px_rgba(124,58,237,0.08)]">
          <div className="relative h-[420px] md:h-[560px]">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-8xl">🔋</div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">Out of Stock</span>
              </div>
            )}
            {product.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-purple-900">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-700">
              {product.category}
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600">
              {product.inStock ? 'Ready to ship' : 'Unavailable'}
            </span>
          </div>

          <h1 className="mb-3 text-3xl font-black text-gray-800 md:text-5xl">{product.name}</h1>
          <p className="mb-6 text-base leading-7 text-gray-600">{product.description}</p>

          <div className="mb-6 flex items-end gap-3">
            <span className="text-4xl font-black text-purple-700 md:text-5xl">₦{product.price.toLocaleString()}</span>
            <span className="mb-1 text-sm text-gray-400 line-through">₦{(product.price * 1.15).toLocaleString()}</span>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Battery', value: 'Long life' },
              { label: 'Power', value: 'Fast charge' },
              { label: 'Support', value: 'WhatsApp order' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-purple-100 bg-purple-50/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-purple-400">{stat.label}</p>
                <p className="mt-1 text-sm font-bold text-gray-700">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 rounded-full py-4 text-lg font-bold transition-all ${
                !product.inStock
                  ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                  : added
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-700 text-white hover:bg-purple-900'
              }`}
            >
              {!product.inStock ? 'Out of Stock' : added ? '✓ Added to Cart' : '🛒 Add to Cart'}
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="flex-1 rounded-full bg-green-500 py-4 text-lg font-bold text-white transition-all hover:bg-green-600"
            >
              💬 Order on WhatsApp
            </button>
          </div>

          <Link href="/cart" className="mt-4 text-center text-sm font-bold text-purple-600 transition-colors hover:text-purple-800">
            View Cart →
          </Link>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-purple-100 pt-14">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-purple-500">Recommended</p>
            <h2 className="text-3xl font-extrabold text-purple-800 md:text-4xl">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map(relProduct => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-purple-600">Loading product...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
