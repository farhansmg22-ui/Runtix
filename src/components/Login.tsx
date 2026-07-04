import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setSession } from '../lib/auth';
import Logo from './Logo';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Handle redirect after login
  const from = (location.state as any)?.from?.pathname || '/';

  const handleQuickSelect = (role: 'admin' | 'user') => {
    setIsLogin(true);
    if (role === 'admin') {
      setEmail('admin@runtix.id');
      setPassword('admin123');
    } else {
      setEmail('budi@gmail.com');
      setPassword('password123');
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Dibuat simulasi jeda loading sebentar biar kelihatan realistis saat presentasi
    setTimeout(() => {
      try {
        let mockUser = {
          id: 'mock-user-123',
          name: name || 'Budi Santoso',
          email: email,
          role: 'user'
        };

        // Jika email mengandung kata admin, atau menggunakan quick-login admin, set sebagai Admin
        if (email === 'admin@runtix.id' || email.includes('admin')) {
          mockUser.name = 'Admin RunTix';
          mockUser.role = 'admin';
        }

        const mockToken = 'mock-jwt-token-runtix-2026';
        
        // Simpan sesi login lokal
        setSession(mockToken, mockUser);
        
        // Redirect berdasarkan role akun
        if (mockUser.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(from, { replace: true });
        }
      } catch (err: any) {
        setError('Failed to authenticate simulated login');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Logo className="mb-6" />
        <h2 className="text-center text-3xl font-black text-slate-950 tracking-tight">
          {isLogin ? 'Sign in to your account' : 'Create your athlete account'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          {isLogin ? "Ready to run?" : "Join the ultimate running network"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-100 sm:px-10">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Authentication Error</h3>
                  <p className="mt-1 text-xs text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farhan Wijaya"
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b6c] focus:border-[#1a3b6c] sm:text-sm text-slate-900 bg-slate-50/50 transition-colors"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b6c] focus:border-[#1a3b6c] sm:text-sm text-slate-900 bg-slate-50/50 transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a3b6c] focus:border-[#1a3b6c] sm:text-sm text-slate-900 bg-slate-50/50 transition-colors"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-black text-white bg-[#1a3b6c] hover:bg-[#153058] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a3b6c] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authenticating...
                  </div>
                ) : isLogin ? (
                  'SIGN IN'
                ) : (
                  'CREATE ACCOUNT'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-semibold">
                <span className="bg-white px-3 text-slate-400">Or toggle mode</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm font-bold text-[#e86f2c] hover:text-[#d35f21] transition-colors cursor-pointer"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already registered? Sign in'}
              </button>
            </div>
          </div>
        </div>

        {/* Pitch Quick Demo Account Selector Panel */}
        <div className="mt-6 bg-slate-100/80 rounded-2xl p-5 border border-slate-200/50">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
            🏟️ Pitch Presentation Quick-Login
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickSelect('user')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200/80 hover:border-[#e86f2c]/50 text-left transition-all active:scale-[0.98] cursor-pointer shadow-sm group"
            >
              <span className="text-[10px] font-bold text-[#e86f2c] uppercase tracking-wide">Customer Role</span>
              <span className="text-xs font-black text-slate-800 mt-0.5 group-hover:text-[#1a3b6c]">Budi Santoso</span>
              <span className="text-[10px] text-slate-400">budi@gmail.com</span>
            </button>
            <button
              onClick={() => handleQuickSelect('admin')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200/80 hover:border-[#e86f2c]/50 text-left transition-all active:scale-[0.98] cursor-pointer shadow-sm group"
            >
              <span className="text-[10px] font-bold text-[#e86f2c] uppercase tracking-wide">Pitch Admin</span>
              <span className="text-xs font-black text-slate-800 mt-0.5 group-hover:text-[#1a3b6c]">Admin RunTix</span>
              <span className="text-[10px] text-slate-400">admin@runtix.id</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
