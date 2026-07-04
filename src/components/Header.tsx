import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, clearSession } from '../lib/auth';
import Logo from './Logo';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    clearSession();
    navigate('/');
    window.location.reload(); // Refresh session state
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-[#e86f2c]' : 'text-slate-600 hover:text-slate-900';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 font-sans shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 cursor-pointer">
            <Logo />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-semibold text-sm">
            <Link to="/" className={`transition-colors duration-200 cursor-pointer ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/events" className={`transition-colors duration-200 cursor-pointer ${isActive('/events')}`}>
              Explore Events
            </Link>
            
            {user && user.role === 'admin' && (
              <Link 
                to="/admin/dashboard" 
                className={`flex items-center gap-1.5 font-bold transition-colors duration-200 cursor-pointer ${isActive('/admin/dashboard')}`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-[#e86f2c] animate-pulse"></span>
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs text-slate-400 font-medium">Athlete Profile</span>
                  <span className="text-sm font-black text-slate-800">{user.name}</span>
                </div>
                
                {user.role === 'user' && (
                  <button
                    onClick={() => navigate('/my-tickets')}
                    className="p-2 rounded-full text-slate-500 hover:text-[#1a3b6c] hover:bg-slate-50 transition-colors relative cursor-pointer"
                    title="My Purchased Tickets"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-[#e86f2c] hover:border-[#e86f2c]/30 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-black tracking-wide text-white bg-[#1a3b6c] hover:bg-[#204984] shadow-md shadow-[#1a3b6c]/10 active:scale-95 transition-all cursor-pointer"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
