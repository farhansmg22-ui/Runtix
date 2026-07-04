import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, getAuthHeaders } from '../lib/auth';
import { Event } from '../types';
import Header from './Header';

// Database statis cadangan agar halaman detail langsung mengenali id event
const staticEvents: Event[] = [
  {
    id: "1",
    title: "BTN Jakarta International Marathon 2026",
    date: "2026-06-14",
    location: "Gelora Bung Karno Jakarta",
    description: "The premium international marathon running through the main landmarks of Jakarta, offering...",
    image_url: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=1200",
    price: 350000,
    current_participants: 100,
    max_participants: 500
  },
  {
    id: "2",
    title: "Borobudur Marathon 2026",
    date: "2026-08-20",
    location: "Taman Lumbini Borobudur, Magelang",
    description: "Run through cultural heritage and scenic local villages around the majestic Borobudur Temple,...",
    image_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200",
    price: 250000,
    current_participants: 150,
    max_participants: 500
  },
  {
    id: "3",
    title: "Semarang 10k 2026",
    date: "2026-12-15",
    location: "Balaikota Semarang",
    description: "A nostalgic running journey exploring the historical Old Town (Kota Lama) of Semarang wi...",
    image_url: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=1200",
    price: 150000,
    current_participants: 80,
    max_participants: 300
  }
];

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = getUser();

  const initialEvent = staticEvents.find(ev => ev.id === id) || null;

  const [event, setEvent] = useState<Event | null>(initialEvent);
  const [loading, setLoading] = useState(false); 
  const [purchasing, setPurchasing] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('va'); 
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Using fallback local event configuration');
        return res.json();
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((err) => {
        console.log('Menggunakan konfigurasi event statis cadangan.');
      });
  }, [id]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPurchasing(true);

    setTimeout(() => {
      if (event) {
        setEvent({
          ...event,
          current_participants: event.current_participants + 1
        });

        // Trik Real-Time Rekapan Admin menggunakan localStorage
        const existingSales = localStorage.getItem('runtix_total_sales') ? parseInt(localStorage.getItem('runtix_total_sales')!) : 330;
        const existingRevenue = localStorage.getItem('runtix_total_revenue') ? parseInt(localStorage.getItem('runtix_total_revenue')!) : 102500000;

        localStorage.setItem('runtix_total_sales', (existingSales + 1).toString());
        localStorage.setItem('runtix_total_revenue', (existingRevenue + event.price).toString());

        setCheckoutSuccess(true);
      } else {
        setError('Payment simulation failed. Invalid event reference.');
      }
      setPurchasing(false);
    }, 1500); 
  };

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
      year: 'numeric',
      weekday: 'long'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <div className="max-w-4xl mx-auto py-24 px-4 text-center">
          <svg className="animate-spin h-10 w-10 text-[#1a3b6c] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-500 font-semibold text-sm">Retrieving event configuration...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <div className="max-w-xl mx-auto py-24 px-4 text-center">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-black text-slate-800">Event Not Found</h2>
          <p className="text-slate-500 mt-2">The running event may have been rescheduled or removed.</p>
          <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 rounded-xl bg-[#1a3b6c] text-white text-xs font-black cursor-pointer">
            RETURN TO HOME
          </button>
        </div>
      </div>
    );
  }

  const quotaPercentage = Math.round((event.current_participants / event.max_participants) * 100);
  const isSoldOut = event.current_participants >= event.max_participants;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      <Header />

      {/* Hero Banner Area */}
      <div className="relative h-96 bg-slate-900 text-white overflow-hidden">
        <img 
          src={event.image_url} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#e86f2c] text-white font-black text-xs uppercase tracking-widest mb-4">
              ✨ ROAD RACE CHAMPIONSHIP
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-semibold">
              <span className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-[#e86f2c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-5 h-5 text-[#e86f2c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Details Content column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-950 border-b border-slate-100 pb-3">
                About the Event
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                {event.description}
              </p>
              <p className="text-slate-600 font-medium leading-relaxed">
                Prepare yourself to participate in one of the grandest events of the year. This event is designed to satisfy both professional athletes aiming to break personal records, and amateur joggers looking to experience the amazing running community scenery. Fully supported with multiple hydration stations, medical checkpoints, cheering squads, and professional photography captures.
              </p>
            </div>

            {/* Runner's Entitlements Bundle */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-950 border-b border-slate-100 pb-3 mb-6">
                🛍️ Runner's Race Kit Entitlements
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <span className="text-2xl block mb-1">🎽</span>
                  <span className="block text-xs font-black text-slate-800">Dry-Fit Jersey</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Premium Jersey</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <span className="text-2xl block mb-1">🏷️</span>
                  <span className="block text-xs font-black text-slate-800">Runner BIB</span>
                  <span className="text-[10px] text-slate-400 font-semibold">With Timing Chip</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <span className="text-2xl block mb-1">🏅</span>
                  <span className="block text-xs font-black text-slate-800">Finisher Medal</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Exclusive Cast Metal</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-center">
                  <span className="text-2xl block mb-1">🍌</span>
                  <span className="block text-xs font-black text-slate-800">Refreshments</span>
                  <span className="text-[10px] text-slate-400 font-semibold">Recovery Pack</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Ticket Pricing Card column */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg sticky top-24">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">RACE TICKET COST</span>
              <span className="text-3xl font-black text-[#1a3b6c] block mb-6">{formatIDR(event.price)}</span>
              
              <div className="space-y-4 border-t border-slate-100 pt-6 mb-6">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Race Categories</span>
                  <span className="text-slate-800">FM, HM, 10K, 5K</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Minimum Age</span>
                  <span className="text-slate-800">17 Years Old</span>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Registration Slot Filled</span>
                    <span>{quotaPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#e86f2c]"
                      style={{ width: `${quotaPercentage}%` }}
                    ></div>
                  </div>
                  <span className="block text-[10px] text-center text-slate-400 font-semibold">
                    {event.max_participants - event.current_participants} slots remaining before closing
                  </span>
                </div>
              </div>

              {isSoldOut ? (
                <button 
                  className="w-full py-4 px-4 bg-slate-100 text-slate-400 rounded-xl text-sm font-black uppercase cursor-not-allowed"
                  disabled
                >
                  SOLD OUT
                </button>
              ) : user ? (
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full py-4 px-4 bg-[#e86f2c] hover:bg-[#d45f1b] text-white rounded-xl text-sm font-black uppercase tracking-wider shadow-lg shadow-[#e86f2c]/10 active:scale-98 transition-all cursor-pointer"
                >
                  REGISTER NOW
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login', { state: { from: { pathname: `/event/${event.id}` } } })}
                  className="w-full py-4 px-4 bg-[#1a3b6c] hover:bg-[#204984] text-white rounded-xl text-sm font-black uppercase tracking-wider shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  SIGN IN TO BUY TICKET
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* POPUP MODAL PAYMENTS */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans sm:p-0">
          
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity z-10" 
            onClick={() => !checkoutSuccess && setCheckoutOpen(false)}
          ></div>

          <div className="bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-lg sm:w-full border border-slate-100 z-20 relative animate-fade-in">
            
            {checkoutSuccess ? (
              /* SUCCESS VIEW */
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Payment Successful!</h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">Your marathon bib slot is locked.</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl text-left border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Event Name</span>
                    <span className="text-slate-800 font-black text-right max-w-[200px] truncate">{event.title}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Athlete Name</span>
                    <span className="text-slate-800 font-black">{user?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">BIB Entry Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[9px] uppercase tracking-wide">PAID - VALIDATED</span>
                  </div>
                  <div className="border-t border-dashed border-slate-200 pt-3 flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold">Total Paid</span>
                    <span className="text-[#1a3b6c] font-black">{formatIDR(event.price)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCheckoutOpen(false);
                    setCheckoutSuccess(false);
                    navigate('/');
                  }}
                  className="w-full py-3.5 px-4 bg-[#1a3b6c] hover:bg-[#e86f2c] text-white rounded-xl text-xs font-black tracking-widest uppercase shadow transition-all cursor-pointer"
                >
                  RETURN TO HOME
                </button>
              </div>
            ) : (
              /* CHECKOUT FORM */
              <form onSubmit={handleCheckoutSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">RunTix Secure Payment</h3>
                    <p className="text-xs text-slate-400 font-medium">Verify your registration parameters</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setCheckoutOpen(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                  >
                    &times;
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-semibold border border-red-100">
                    {error}
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-center">
                  <img 
                    src={event.image_url} 
                    alt="" 
                    className="w-12 h-12 object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(event.date)}</span>
                    <h4 className="text-xs font-black text-slate-800 truncate">{event.title}</h4>
                    <span className="block text-xs font-extrabold text-[#e86f2c]">{formatIDR(event.price)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                    Select Payment Channel
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('va')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'va'
                          ? 'border-[#1a3b6c] bg-[#1a3b6c]/5 text-[#1a3b6c] ring-2 ring-[#1a3b6c]/10 font-bold'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg">🏦</span>
                      <span className="text-[10px] font-black uppercase">Virtual Acc</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gopay')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'gopay'
                          ? 'border-[#1a3b6c] bg-[#1a3b6c]/5 text-[#1a3b6c] ring-2 ring-[#1a3b6c]/10 font-bold'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg">📱</span>
                      <span className="text-[10px] font-black uppercase">QRIS / GoPay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cc')}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'cc'
                          ? 'border-[#1a3b6c] bg-[#1a3b6c]/5 text-[#1a3b6c] ring-2 ring-[#1a3b6c]/10 font-bold'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg">💳</span>
                      <span className="text-[10px] font-black uppercase">Credit Card</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  {paymentMethod === 'va' && (
                    <div className="space-y-2 text-center py-2">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">BCA Virtual Account Number</span>
                      <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-base font-black text-slate-800 tracking-widest inline-block select-all cursor-pointer">
                        80777{user?.id ? '2241' : '9982'}{event.id}
                      </div>
                      <span className="block text-[9px] text-slate-400 font-semibold">Klik "Confirm & Pay" setelah menyalin nomor simulasi di atas.</span>
                    </div>
                  )}
                  {paymentMethod === 'gopay' && (
                    <div className="space-y-3 flex flex-col items-center py-2">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">QRIS - PITCH INVOICE SCANNER</span>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=runtix-invoice-${event.id}`} 
                          alt="QRIS Code Prototype" 
                          className="w-32 h-32"
                        />
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'cc' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Card Number</span>
                          <input 
                            type="text" 
                            placeholder="4111 2222 3333 4444" 
                            disabled 
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-400"
                          />
                        </div>
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Expiry & CVV</span>
                          <input 
                            type="text" 
                            placeholder="12/29  •••" 
                            disabled 
                            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Grand Total Cost</span>
                    <span className="text-lg font-black text-[#1a3b6c]">{formatIDR(event.price)}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={purchasing}
                    className="px-6 py-3.5 bg-[#e86f2c] hover:bg-[#d45f1b] text-white rounded-xl text-xs font-black tracking-widest uppercase shadow-md transition-all cursor-pointer"
                  >
                    {purchasing ? 'PROCESSING...' : 'CONFIRM & PAY'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
