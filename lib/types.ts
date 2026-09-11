// lib/types.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Settings {
  id?: string;
  whatsappNumber: string;
  contactEmail: string;
  instagramUrl: string;
  heroTitle: string;
  heroSubtitle: string;
}
