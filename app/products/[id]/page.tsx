'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const currentProduct = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(currentProduct);
          
          // Fetch related products in the same category
          const q = query(
            collection(db, 'products'),
            where('category', '==', currentProduct.category),
            where('inStock', '==', true)
          );
          const relatedSnap = await getDocs(q);
          const related = relatedSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as Product))
            .filter(p => p.id !== currentProduct.id)
            .slice(0, 4); // Limit to 4 related products
          setRelatedProducts(related);

        } else {
          router.push('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id, router]);

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-purple-600 text-xl animate-pulse">Loading product...</div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-purple-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-purple-600">Products</Link>
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative h-80 md:h-96 bg-purple-50 rounded-3xl overflow-hidden shadow-md">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🔋</div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          <span className="text-sm text-purple-500 font-medium uppercase tracking-wide mb-2">{product.category}</span>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-3">{product.name}</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">{product.description}</p>
          <div className="text-4xl font-extrabold text-purple-700 mb-6">
            ₦{product.price.toLocaleString()}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-4 rounded-full font-bold text-lg transition-all ${
                !product.inStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-700 text-white hover:bg-purple-900'
              }`}
            >
              {!product.inStock ? 'Out of Stock' : added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="flex-1 py-4 rounded-full font-bold text-lg bg-green-500 text-white hover:bg-green-600 transition-all"
            >
              💬 Order via WhatsApp
            </button>
          </div>

          <Link href="/cart" className="mt-4 text-center text-purple-600 font-semibold hover:text-purple-800 transition-colors">
            View Cart →
          </Link>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-purple-100 pt-16">
          <h2 className="text-3xl font-extrabold text-purple-800 mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relProduct => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
