'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSettings } from '@/context/SettingsContext';
import type { Settings } from '@/lib/types';

export default function SettingsTab() {
  const { settings, refreshSettings, loading: ctxLoading } = useSettings();
  const [form, setForm] = useState({
    whatsappNumber: '',
    contactEmail: '',
    instagramUrl: '',
    heroTitle: '',
    heroSubtitle: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const current = settings as Settings;
    setForm({
      whatsappNumber: current.whatsappNumber || '',
      contactEmail: current.contactEmail || '',
      instagramUrl: current.instagramUrl || '',
      heroTitle: current.heroTitle || '',
      heroSubtitle: current.heroSubtitle || '',
    });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const whatsappNumber = form.whatsappNumber.replace(/\D/g, '');
      if (whatsappNumber.length < 10) {
        setMessage('❌ Enter a valid WhatsApp number with country code.');
        return;
      }
      const normalizedForm = {
        whatsappNumber,
        contactEmail: form.contactEmail.trim().toLowerCase(),
        instagramUrl: form.instagramUrl.trim(),
        heroTitle: form.heroTitle.trim(),
        heroSubtitle: form.heroSubtitle.trim(),
      };
      await setDoc(doc(db, 'settings', 'global'), normalizedForm, { merge: true });
      await refreshSettings();
      setMessage('✅ Settings updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error saving settings. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  if (ctxLoading) return <div className="p-12 text-center text-purple-400 animate-pulse">Loading settings...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
      <h2 className="text-xl font-extrabold text-purple-800 mb-6">⚙️ Site Settings</h2>
      
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl font-medium ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Contact Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={e => setForm({ ...form, whatsappNumber: e.target.value })}
              required
              placeholder="2349046988683"
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700"
            />
            <p className="text-xs text-gray-400 mt-1">Include country code without '+'</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={e => setForm({ ...form, contactEmail: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              value={form.instagramUrl}
              onChange={e => setForm({ ...form, instagramUrl: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-purple-50">
          <h3 className="font-bold text-gray-800 mb-4">Homepage Hero</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hero Title</label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={e => setForm({ ...form, heroTitle: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hero Subtitle</label>
              <textarea
                value={form.heroSubtitle}
                onChange={e => setForm({ ...form, heroSubtitle: e.target.value })}
                required
                rows={2}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700 resize-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-purple-700 hover:bg-purple-900 text-white font-extrabold rounded-xl text-lg transition-all disabled:opacity-50 mt-4"
        >
          {saving ? 'Saving...' : '💾 Save Settings'}
        </button>
      </form>
    </div>
  );
}
