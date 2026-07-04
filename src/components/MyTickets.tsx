import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getAuthHeaders } from '../lib/auth';
import { Ticket } from '../types';
import Header from './Header';

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetch('/api/tickets/my', {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load tickets');
        return res.json();
      })
      .then((data) => {
        setTickets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user, navigate]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight leading-none mb-2">
              My Athlete Locker
            </h1>
            <p className="text-slate-500 font-medium">
              View your validated race entries, print bib tickets, and prepare for race day.
            </p>
          </div>
          <button
            onClick={() => navigate('/events')}
            className="px-5 py-3 rounded-xl text-xs font-black bg-[#1a3b6c] hover:bg-[#e86f2c] text-white transition-all cursor-pointer shadow-md"
          >
            REGISTER ANOTHER RACE
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <svg className="animate-spin h-8 w-8 text-[#1a3b6c] mx-auto mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-slate-400 font-bold text-sm">Opening athlete locker...</span>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-slate-800">No Tickets Registered Yet</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
              You don't have any active running event bookings. Secure your ticket for upcoming elite races!
            </p>
            <button
              onClick={() => navigate('/events')}
              className="mt-6 px-6 py-3 rounded-xl bg-[#e86f2c] text-white text-xs font-black hover:bg-[#d45f1b] transition-all cursor-pointer shadow-lg shadow-[#e86f2c]/10"
            >
              FIND RUNNING EVENTS
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((t) => (
              <div 
                key={t.id} 
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x md:divide-dashed divide-slate-100"
              >
                {/* Main Ticket Pass */}
                <div className="p-6 sm:p-8 flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-[#1a3b6c] text-[10px] font-black uppercase tracking-wider mb-2">
                        Validated Athlete Pass
                      </span>
                      <h2 className="text-xl font-black text-slate-950 leading-tight">
                        {t.event_title}
                      </h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-xs uppercase">
                      CONFIRMED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 pt-4 border-t border-slate-50 text-xs">
                    <div>
                      <span className="block text-slate-400 font-semibold uppercase text-[9px] tracking-wider">ATHLETE NAME</span>
                      <span className="font-black text-slate-800">{user?.name}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-semibold uppercase text-[9px] tracking-wider">BOOKING DATE</span>
                      <span className="font-black text-slate-800">{formatDate(t.purchase_date)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-semibold uppercase text-[9px] tracking-wider">REGISTRATION FEE</span>
                      <span className="font-black text-[#1a3b6c]">{formatIDR(t.total_price)}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Tear-off Stub */}
                <div className="p-6 sm:p-8 bg-slate-50/50 md:w-64 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">RACE ENTRY NUMBER</span>
                  <span className="text-3xl font-black text-[#1a3b6c] font-mono tracking-tight leading-none mb-3">
                    BIB-0{t.event_id}{String(t.id).padStart(3, '0')}
                  </span>
                  
                  {/* Barcode graphic using CSS grids */}
                  <div className="w-40 h-10 bg-white border border-slate-200 rounded-lg p-2.5 flex justify-between items-stretch overflow-hidden mb-2 shadow-inner">
                    {[1.5, 3, 1, 2.5, 1, 2, 4, 1.5, 3, 1, 2, 1, 3, 1.5, 4, 1, 2, 2.5, 1.5].map((w, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-900 rounded-sm"
                        style={{ width: `${w}px` }}
                      ></div>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    *TIX-{t.id}-{t.user_id}*
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
