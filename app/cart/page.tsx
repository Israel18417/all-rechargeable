'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { settings } = useSettings();

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    const itemsList = items
      .map(item => `• ${item.product.name} x${item.quantity} — ₦${(item.product.price * item.quantity).toLocaleString()}`)
      .join('\n');

    const message = `Hello All Rechargeable+! 👋\n\nI'd like to place an order:\n\n${itemsList}\n\n*Total: ₦${totalPrice.toLocaleString()}*\n\nPlease confirm my order and delivery details. Thank you!`;

    const waNumber = settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-3xl font-extrabold text-purple-800 mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started!</p>
        <Link
          href="/products"
          className="bg-purple-700 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-purple-900 transition-all"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-purple-800">
          🛒 Your Cart <span className="text-lg font-normal text-gray-400">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
        </h1>
        <button onClick={clearCart} className="text-red-400 hover:text-red-600 text-sm font-semibold transition-colors">
          Clear Cart 🗑️
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 flex items-center gap-4">
            {/* Image */}
            <div className="relative w-20 h-20 bg-purple-50 rounded-xl overflow-hidden flex-shrink-0">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🔋</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
              <p className="text-purple-600 font-semibold">₦{product.price.toLocaleString()} each</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold hover:bg-purple-200 transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="w-8 text-center font-bold text-gray-700">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold hover:bg-purple-200 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <div className="text-right flex-shrink-0">
              <p className="font-extrabold text-purple-700">₦{(product.price * quantity).toLocaleString()}</p>
              <button
                onClick={() => removeFromCart(product.id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
        <h2 className="text-xl font-extrabold text-purple-800 mb-4">Order Summary</h2>
        <div className="space-y-2 mb-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-sm text-gray-600">
              <span>{product.name} × {quantity}</span>
              <span>₦{(product.price * quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-purple-200 pt-3 mb-6 flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-2xl font-extrabold text-purple-700">₦{totalPrice.toLocaleString()}</span>
        </div>

        <button
          onClick={handleWhatsAppOrder}
          className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-extrabold text-xl rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <span>💬</span>
          <span>Order via WhatsApp</span>
        </button>
        <p className="text-center text-gray-400 text-xs mt-3">
          Clicking this will open WhatsApp with your order details pre-filled
        </p>
      </div>
    </div>
  );
}
