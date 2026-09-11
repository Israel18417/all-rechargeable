'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const DEMO_ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@allrechargeable.com').trim().toLowerCase();
const DEMO_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'AllRechargeable123!';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_ADMIN_EMAIL);
  const [password, setPassword] = useState(DEMO_ADMIN_PASSWORD);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const isDemoAdmin = normalizedEmail === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD;

      if (isDemoAdmin) {
        localStorage.setItem('all-rechargeable-admin', 'true');
        router.push('/admin/dashboard');
        return;
      }

      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      localStorage.setItem('all-rechargeable-admin', 'true');
      router.push('/admin/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)' }}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-2xl font-extrabold text-purple-800">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">All Rechargeable+ Dashboard</p>
        </div>

        <div className="mb-5 rounded-2xl bg-purple-50 border border-purple-100 px-4 py-3 text-sm text-purple-700">
          Demo login: <span className="font-semibold">{DEMO_ADMIN_EMAIL}</span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@allrechargeable.com"
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:border-purple-500 text-gray-700"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-purple-700 hover:bg-purple-900 text-white font-extrabold rounded-xl text-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
