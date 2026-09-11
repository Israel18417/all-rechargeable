'use client';

import { useSettings } from '@/context/SettingsContext';

export default function ContactPage() {
  const { settings } = useSettings();
  const whatsappNumber = settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-purple-800 mb-3">Contact Us</h1>
        <p className="text-gray-500 text-lg">We&apos;re here to help! Reach us through any of the channels below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-green-400 transition-all group"
        >
          <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">💬</span>
          <h3 className="font-bold text-green-700 text-xl mb-1">WhatsApp</h3>
          <p className="text-gray-500 text-sm">Chat with us directly to place orders or ask questions</p>
          <span className="mt-3 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Chat Now
          </span>
        </a>

        {/* Instagram */}
        <a
          href={settings?.instagramUrl || "https://www.instagram.com/all_rechargeableplus"}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-purple-400 transition-all group"
        >
          <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">📸</span>
          <h3 className="font-bold text-purple-700 text-xl mb-1">Instagram</h3>
          <p className="text-gray-500 text-sm">Follow us for product updates and deals</p>
          <span className="mt-3 bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
            @all_rechargeableplus
          </span>
        </a>
      </div>

      {/* FAQ */}
      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
        <h2 className="text-2xl font-extrabold text-purple-800 mb-5">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How do I place an order?', a: 'Add items to your cart, then click "Order via WhatsApp". Your order details will be sent to us automatically.' },
            { q: 'Do you deliver across Nigeria?', a: 'Yes! We deliver to all states in Nigeria. Delivery time varies by location.' },
            { q: 'What payment methods do you accept?', a: 'We accept bank transfers and cash on delivery (where available). Details will be shared on WhatsApp after ordering.' },
            { q: 'Can I return a product?', a: 'Yes, we accept returns within 7 days if the product is faulty. Contact us on WhatsApp for assistance.' },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-purple-100 pb-4 last:border-none last:pb-0">
              <h4 className="font-bold text-purple-700 mb-1">{faq.q}</h4>
              <p className="text-gray-500 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
