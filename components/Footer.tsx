'use client';

import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  const { settings } = useSettings();
  
  return (
    <footer style={{ background: 'linear-gradient(135deg, #4c1d95, #5b21b6)' }} className="text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
            <BrandLogo className="h-9 w-9" />
            <span className="uppercase tracking-tight">All Rechargeable</span>
          </h3>
          <p className="text-purple-200 text-sm leading-relaxed">
            Your number one destination for quality rechargeable products. Power up your life!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-3 text-yellow-300">Quick Links</h4>
          <ul className="space-y-2 text-purple-200">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/cart" className="hover:text-white transition-colors">My Cart</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-lg mb-3 text-yellow-300">Contact Us</h4>
          <ul className="space-y-2 text-purple-200 text-sm">
            <li className="flex items-center gap-2">
              <span>📱</span>
              <a href={`https://wa.me/${settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} className="hover:text-white transition-colors">
                WhatsApp Us
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span>📸</span>
              <a href={settings?.instagramUrl || "https://www.instagram.com/all_rechargeableplus"} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                @all_rechargeableplus
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-purple-700 text-center py-4 text-purple-300 text-sm">
        © {new Date().getFullYear()} All Rechargeable Plus. All rights reserved.
      </div>
    </footer>
  );
}
