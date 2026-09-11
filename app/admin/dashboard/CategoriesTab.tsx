'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/lib/types';

export default function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const snap = await getDocs(q);
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), { ...form });
        setMessage('✅ Category updated!');
      } else {
        await addDoc(collection(db, 'categories'), { ...form, createdAt: serverTimestamp() });
        setMessage('✅ Category added!');
      }
      setForm({ name: '', icon: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setMessage('❌ Error saving category.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, icon: cat.icon });
    setEditingId(cat.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      setMessage('🗑️ Category deleted.');
      fetchCategories();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
      <h2 className="text-xl font-extrabold text-purple-800 mb-6">🏷️ Manage Categories</h2>
      
      {message && (
        <div className="mb-6 px-4 py-3 rounded-xl font-medium bg-purple-50 text-purple-700 border border-purple-100">
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            placeholder="e.g. Fans"
            className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700"
          />
        </div>
        <div className="w-full md:w-32">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Emoji Icon</label>
          <input
            type="text"
            value={form.icon}
            onChange={e => setForm({ ...form, icon: e.target.value })}
            required
            placeholder="🌀"
            className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 text-center text-xl"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full md:w-auto py-3 px-6 bg-purple-700 hover:bg-purple-900 text-white font-extrabold rounded-xl transition-all disabled:opacity-50 h-[52px]"
        >
          {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setForm({ name: '', icon: '' }); }}
            className="w-full md:w-auto py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-xl transition-all h-[52px]"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List */}
      <div className="border border-purple-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-purple-400 animate-pulse">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No categories found. Add one above!</div>
        ) : (
          <ul className="divide-y divide-purple-50">
            {categories.map(cat => (
              <li key={cat.id} className="p-4 flex items-center justify-between hover:bg-purple-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-white w-10 h-10 flex items-center justify-center rounded-lg shadow-sm border border-purple-100">{cat.icon}</span>
                  <span className="font-bold text-gray-700">{cat.name}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(cat)} className="text-purple-600 hover:text-purple-800 text-sm font-semibold px-3 py-1 bg-purple-100 rounded-lg">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold px-3 py-1 bg-red-100 rounded-lg">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
