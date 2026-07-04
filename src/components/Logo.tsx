import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-sans font-extrabold tracking-tight select-none ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a3b6c] to-[#25549a] text-white shadow-md shadow-[#1a3b6c]/20">
        <svg 
          className="w-5 h-5 text-white transform -rotate-12 transition-transform duration-300 hover:rotate-0" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#e86f2c" stroke="#e86f2c"/>
        </svg>
        <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e86f2c] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#e86f2c]"></span>
        </span>
      </div>
      <span className="text-2xl font-black">
        <span className="text-[#1a3b6c] tracking-tight">Run</span>
        <span className="text-[#e86f2c] tracking-tight">Tix</span>
        <span className="text-slate-400 font-semibold text-lg">.id</span>
      </span>
    </div>
  );
}
