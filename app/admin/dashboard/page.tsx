'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';
import { Product, Category } from '@/lib/types';
import { sampleCategories } from '@/lib/sampleCatalog';
import SettingsTab from './SettingsTab';
import CategoriesTab from './CategoriesTab';
import BrandLogo from '@/components/BrandLogo';


const emptyForm = {
  name: '',
  price: '',
  description: '',
  category: 'Fans',
  inStock: true,
  featured: false,
  imageUrl: '',
};

export default function AdminDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'settings' | 'categories'>('products');
  const categoryOptions = categories.length > 0 ? categories : sampleCategories.map((cat, index) => ({ id: `seed-${index}`, ...cat }));

  const fillQuickSample = () => {
    setForm({
      name: 'Rechargeable Standing Fan',
      price: '21000',
      description: 'Strong airflow rechargeable standing fan built for comfort, convenience, and long battery life.',
      category: categoryOptions[0]?.name || 'Fans',
      inStock: true,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    });
    setImagePreview('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80');
  };

  // Auth guard
  useEffect(() => {
    const localAdminSession = localStorage.getItem('all-rechargeable-admin') === 'true';
    const unsub = onAuthStateChanged(auth, user => {
      if (!user && !localAdminSession) {
        router.push('/admin/login');
        return;
      }

      fetchProducts();
      fetchCategories();
    });
    return () => unsub();
  }, [router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const snap = await getDocs(q);
      const dbCategories = snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));

      if (dbCategories.length === 0) {
        const fallback = sampleCategories.map((cat, index) => ({ id: `sample-${index}`, ...cat } as Category));
        setCategories(fallback);
        return;
      }

      setCategories(dbCategories);
    } catch (err) {
      console.error(err);
      setCategories(sampleCategories.map((cat, index) => ({ id: `sample-${index}`, ...cat } as Category)));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Please choose an image file.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ Image must be 5 MB or smaller.');
      e.target.value = '';
      return;
    }
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);
    if (!name || !description || !Number.isFinite(price) || price < 0) {
      setMessage('❌ Enter a valid product name, description, and price.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      let imageUrl = form.imageUrl;

      // Upload image if new file selected
      if (imageFile) {
        const safeFileName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-');
        const storageRef = ref(storage, `products/${Date.now()}_${safeFileName}`);
        await uploadBytes(storageRef, imageFile, { contentType: imageFile.type });
        imageUrl = await getDownloadURL(storageRef);
      }

      const productData = {
        name,
        price,
        description,
        category: form.category.trim() || 'Others',
        inStock: form.inStock,
        featured: form.featured,
        imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
        setMessage('✅ Product updated successfully!');
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        setMessage('✅ Product added successfully!');
      }

      resetForm();
      await fetchProducts();
      setActiveTab('products');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error saving product. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      category: product.category,
      inStock: product.inStock,
      featured: product.featured,
      imageUrl: product.imageUrl,
    });
    setImagePreview(product.imageUrl || '');
    setEditingId(product.id);
    setActiveTab('add');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setMessage('🗑️ Product deleted.');
      setDeleteConfirm(null);
      await fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error deleting product. Please try again.');
    }
  };

  const toggleStock = async (product: Product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), { inStock: !product.inStock });
      await fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage('❌ Could not update stock status.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const resetForm = () => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('all-rechargeable-admin');
    await signOut(auth);
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)' }} className="text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 font-bold text-xl">
          <BrandLogo className="h-9 w-9" />
          <span className="uppercase tracking-tight">All Rechargeable Plus</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-purple-200 hover:text-white text-sm">View Store ↗</a>
          <button onClick={handleLogout} className="bg-white text-purple-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-50 hover:text-red-600 transition-all">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: products.length, icon: '📦' },
            { label: 'In Stock', value: products.filter(p => p.inStock).length, icon: '✅' },
            { label: 'Out of Stock', value: products.filter(p => !p.inStock).length, icon: '❌' },
            { label: 'Featured', value: products.filter(p => p.featured).length, icon: '⭐' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 text-center">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-purple-700">{stat.value}</div>
              <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Toast */}
        {message && (
          <div className="mb-6 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-xl font-medium">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => { setActiveTab('products'); resetForm(); }}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'}`}
          >
            📦 All Products
          </button>
          <button
            onClick={() => { setActiveTab('add'); setShowForm(true); if (!editingId) resetForm(); }}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${activeTab === 'add' ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'}`}
          >
            ➕ {editingId ? 'Edit Product' : 'Add Product'}
          </button>
          <button
            onClick={() => { setActiveTab('categories'); }}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${activeTab === 'categories' ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'}`}
          >
            🏷️ Categories
          </button>
          <button
            onClick={() => { setActiveTab('settings'); }}
            className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'}`}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Products Table */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-purple-400 animate-pulse">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-3">📦</div>
                <p className="text-gray-400">No products yet. Add your first product!</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="mt-4 bg-purple-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-900 transition-all"
                >
                  Add Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)' }} className="text-white">
                    <tr>
                      <th className="text-left px-4 py-3">Image</th>
                      <th className="text-left px-4 py-3">Product</th>
                      <th className="text-left px-4 py-3">Category</th>
                      <th className="text-left px-4 py-3">Price</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3">Featured</th>
                      <th className="text-left px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-50">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-purple-50">
                            {product.imageUrl ? (
                              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">🔋</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800 max-w-[180px] truncate">{product.name}</p>
                          <p className="text-gray-400 text-xs max-w-[180px] truncate">{product.description}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{product.category}</td>
                        <td className="px-4 py-3 font-bold text-purple-700">₦{product.price.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleStock(product)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${product.inStock ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                          >
                            {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-lg ${product.featured ? 'opacity-100' : 'opacity-30'}`}>⭐</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-purple-200 transition-all"
                            >
                              ✏️ Edit
                            </button>
                            {deleteConfirm === product.id ? (
                              <div className="flex gap-1">
                                <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">Confirm</button>
                                <button onClick={() => setDeleteConfirm(null)} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-semibold">Cancel</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(product.id)}
                                className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all"
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Form */}
        {activeTab === 'add' && (
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-purple-800">
                {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
              {!editingId && (
                <button
                  type="button"
                  onClick={fillQuickSample}
                  className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-700 transition-colors hover:bg-purple-100"
                >
                  Quick sample
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="e.g. Rechargeable Standing Fan"
                    className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 text-gray-700 focus:border-purple-500 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-400">Use a clear product name buyers will recognize.</p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Price (₦) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    required
                    min="0"
                    placeholder="e.g. 15000"
                    className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 text-gray-700 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Category *</label>
                  <select
                    value={form.category || categoryOptions[0]?.name || 'Fans'}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border-2 border-purple-100 px-4 py-3 text-gray-700 focus:border-purple-500 focus:outline-none"
                  >
                    {categoryOptions.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-xl border-2 border-dashed border-purple-300 px-4 py-3 text-sm font-medium text-purple-600 transition-all hover:border-purple-500 hover:bg-purple-50"
                  >
                    {imagePreview ? '📷 Change Image' : '📷 Upload Image'}
                  </button>
                  {imagePreview && (
                    <div className="relative mt-3 h-20 w-20 overflow-hidden rounded-lg border border-purple-100 bg-purple-50">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Describe the product, battery life, charging time, and key benefits."
                  className="w-full resize-none rounded-xl border-2 border-purple-100 px-4 py-3 text-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, inStock: !form.inStock })}
                    className={`relative h-6 w-12 rounded-full transition-all ${form.inStock ? 'bg-green-500' : 'bg-gray-300'}`}
                    aria-label="Toggle stock status"
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${form.inStock ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="font-semibold text-gray-700">In Stock</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                    className={`relative h-6 w-12 rounded-full transition-all ${form.featured ? 'bg-yellow-400' : 'bg-gray-300'}`}
                    aria-label="Toggle featured status"
                  >
                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${form.featured ? 'left-7' : 'left-1'}`} />
                  </button>
                  <span className="font-semibold text-gray-700">⭐ Featured on Homepage</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-purple-700 py-4 text-lg font-extrabold text-white transition-all hover:bg-purple-900 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? '✏️ Update Product' : '➕ Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('products');
                  }}
                  className="rounded-xl bg-gray-100 px-6 py-4 font-bold text-gray-600 transition-all hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && <CategoriesTab />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
