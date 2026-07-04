import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import Header from './Header';

export default function ExploreEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setLoading(false);
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

  // Filter logic
  const filteredEvents = events.filter((ev) => {
    const matchesSearch = ev.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ev.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ev.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = selectedLocation === 'all' || ev.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  // Extract unique locations for dropdown filter
  const locations = ['all', 'Jakarta', 'Borobudur', 'Semarang', 'Bandung', 'Bali'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Title area */}
        <div className="text-center sm:text-left mb-10">
          <h1 className="text-3xl font-black text-slate-950 tracking-tight leading-none mb-2">
            Explore Championship Races
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Find and secure slots for premier, national-scale athletic running events in Indonesia.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by event title, landmark, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a3b6c] focus:border-[#1a3b6c] placeholder-slate-400 bg-slate-50/50"
            />
          </div>

          <div className="md:w-64">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1a3b6c] focus:border-[#1a3b6c] bg-slate-50/50 font-semibold"
            >
              <option value="all">📍 All Regions</option>
              {locations.filter(loc => loc !== 'all').map((loc) => (
                <option key={loc} value={loc}>📍 {loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
                <div className="h-48 bg-slate-100 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-100 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-6"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-md mx-auto shadow-sm">
            <span className="text-4xl block mb-3">🏃‍♂️💨</span>
            <h3 className="text-lg font-black text-slate-800">No Races Match Your Search</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or keyword query to explore other running challenges.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedLocation('all'); }}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#1a3b6c] hover:bg-[#e86f2c] text-white text-xs font-black cursor-pointer"
            >
              CLEAR SEARCH FILTER
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((ev) => {
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
      </main>
    </div>
  );
}
