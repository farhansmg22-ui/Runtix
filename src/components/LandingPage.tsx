import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import Header from './Header';

// Data cadangan langsung agar muncul di Vercel tanpa perlu menyalakan backend server
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

export default function LandingPage() {
  const [events, setEvents] = useState<Event[]>(staticEvents); // Menggunakan staticEvents sebagai data awal
  const [loading, setLoading] = useState(false); // Langsung set ke false agar tidak macet di loading
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setEvents(data);
        }
      })
      .catch((err) => {
        console.log('Menggunakan data statis cadangan karena backend offline.');
      });
  }, []);

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a3b6c] via-[#1a3b6c] to-[#e86f2c]/95 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=1200" 
            alt="Marathon Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Abstract design elements */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#e86f2c] opacity-25 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#1a3b6c] opacity-40 blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold tracking-widest uppercase mb-6 animate-bounce">
            ⚡ RUNNING TICKETING PLATFORM OF THE FUTURE
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-6">
            SECURE YOUR STARTING LINE IN <span className="text-[#e86f2c] bg-clip-text">INDONESIA’S BIGGEST MARATHONS</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-100/90 font-medium leading-relaxed mb-10">
            RunTix.id is the official, fast, and frictionless digital registration system for premier running events. No server delays, no hidden fees—just pure athletic adrenaline.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => {
                const element = document.getElementById('events-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-black tracking-wide text-white bg-[#e86f2c] hover:bg-[#d45f1b] shadow-xl shadow-[#e86f2c]/20 hover:shadow-[#e86f2c]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              BOOK EVENT TICKETS
            </button>
            <button
              onClick={() => navigate('/events')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
            >
              EXPLORE ALL
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Pitch Stats Banner */}
      <section className="bg-white py-8 border-b border-slate-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-4 md:pt-0">
              <span className="block text-3xl font-black text-[#1a3b6c]">102 JUTA</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pitch Revenue (M2)</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block text-3xl font-black text-[#e86f2c]">410+</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Seeded Registrations</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block text-3xl font-black text-[#1a3b6c]">99%</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gross Profit Margin</span>
            </div>
            <div className="pt-4 md:pt-0">
              <span className="block text-3xl font-black text-[#e86f2c]">5 / 5</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Elite Race Alliances</span>
            </div>
          </div>
        </div>
      </section>

      {/* Events Showcase Section */}
      <section id="events-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none mb-3">
              Upcoming Premier Marathons
            </h2>
            <p className="text-slate-500 font-medium">
              We exclusively host top-tier, certified marathons with guaranteed race packages and accurate timing.
            </p>
          </div>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-black text-[#1a3b6c] hover:text-[#e86f2c] transition-colors cursor-pointer group"
          >
            SEE ALL EVENTS
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
                <div className="h-48 bg-slate-100 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-100 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-6"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 5).map((ev) => {
              const quotaPercentage = Math.round((ev.current_participants / ev.max_participants) * 100);
              const isSoldOut = ev.current_participants >= ev.max_participants;

              return (
                <div 
                  key={ev.id} 
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Event Thumbnail */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img 
                      src={ev.image_url} 
                      alt={ev.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 text-[#1a3b6c] font-black text-xs shadow">
                        🏆 OFFICIALLY SEEDED
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-black text-[#e86f2c] tracking-widest uppercase mb-1">
                      {formatDate(ev.date)}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#1a3b6c] transition-colors leading-tight mb-2">
                      {ev.title}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mb-4">
                      <svg className="w-4 h-4 text-[#e86f2c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {ev.location}
                    </div>

                    {/* Description excerpt */}
                    <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
                      {ev.description}
                    </p>

                    {/* Ticket Progress Meter */}
                    <div className="mt-auto space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Registration Quota</span>
                        <span>{ev.current_participants} / {ev.max_participants} Slot</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#1a3b6c] to-[#e86f2c]"
                          style={{ width: `${quotaPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">RACE ENTRANCE FEE</span>
                        <span className="text-lg font-black text-[#1a3b6c]">{formatIDR(ev.price)}</span>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/event/${ev.id}`)}
                        className={`px-5 py-3 rounded-xl text-xs font-black tracking-wider transition-all cursor-pointer ${
                          isSoldOut
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-[#1a3b6c] text-white hover:bg-[#e86f2c] shadow hover:shadow-[#e86f2c]/10'
                        }`}
                        disabled={isSoldOut}
                      >
                        {isSoldOut ? 'SOLD OUT' : 'GET TICKETS'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer Branding */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-800 pb-8 mb-8">
            <div className="mb-4 sm:mb-0">
              <span className="text-xl font-black text-white">RunTix<span className="text-[#e86f2c]">.id</span></span>
              <p className="text-slate-400 text-xs font-semibold mt-1">Official pitch presentation ticketing prototype</p>
            </div>
            <div className="flex gap-6 text-sm text-slate-400 font-bold">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms of Sale</a>
              <a href="#" className="hover:text-white">Support Helpdesk</a>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 font-semibold">
            &copy; 2026 RunTix.id.
          </p>
          <p className="text-center text-[11px] text-slate-400 font-bold mt-2 tracking-wide">
  Developed by: <span className="text-[#e86f2c]">farhanrzky_p</span>
</p>
        </div>
      </footer>
    </div>
  );
}
