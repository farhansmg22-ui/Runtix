import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getAuthHeaders } from '../lib/auth';
import { AnalyticsData, Expense } from '../types';
import Header from './Header';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

// Data analitik simulasi dasar sebagai standar awal visualisasi dasbor
const mockAnalyticsData: AnalyticsData = {
  kpis: {
    totalRevenue: 102500000, 
    totalTicketsSold: 330,
    totalExpenses: 3150000,
    totalProfit: 99350000
  },
  salesTrend: [
    { name: 'Minggu 1', revenue: 12000000 },
    { name: 'Minggu 2', revenue: 34000000 },
    { name: 'Minggu 3', revenue: 68000000 },
    { name: 'Minggu 4', revenue: 102500000 }
  ],
  costVsRevenue: [
    { name: 'Venture Metrics', "Modal Awal (Expenses)": 3150000, "Revenue Bulan 2": 102500000 }
  ],
  eventPopularity: [
    { name: 'Jakarta Marathon', revenue: 35000000 },
    { name: 'Borobudur Marathon', revenue: 37500000 },
    { name: 'Semarang 10k', revenue: 30000000 }
  ],
  expensesList: [
    { id: '1', description: 'Google Ads Campaign', cost: 1500000 },
    { id: '2', description: 'Domain runtix.id & Premium Hosting', cost: 650000 },
    { id: '3', description: 'Flyers & Local Community Pamphlets', cost: 1000000 }
  ],
  recentPurchases: [
    { buyerName: 'Aditya Nugroho', buyerEmail: 'adit.nugroho@gmail.com', eventTitle: 'BTN Jakarta International Marathon 2026', purchaseDate: '2026-07-04', price: 350000 },
    { buyerName: 'Siti Aminah', buyerEmail: 'siti.aminah@yahoo.com', eventTitle: 'Borobudur Marathon 2026', purchaseDate: '2026-07-04', price: 250000 },
    { buyerName: 'Rizky Pratama', buyerEmail: 'rizky.pratama@outlook.com', eventTitle: 'Semarang 10k 2026', purchaseDate: '2026-07-03', price: 150000 },
    { buyerName: 'Dewi Lestari', buyerEmail: 'dewi.les@gmail.com', eventTitle: 'BTN Jakarta International Marathon 2026', purchaseDate: '2026-07-03', price: 350000 },
    { buyerName: 'Eko Prasetyo', buyerEmail: 'eko.pras@gmail.com', eventTitle: 'Borobudur Marathon 2026', purchaseDate: '2026-07-02', price: 250000 }
  ]
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  // Inisialisasi State Dinamis: Menghitung akumulasi real-time dari transaksi pembeli baru
  const [data, setData] = useState<AnalyticsData | null>(() => {
    const savedSales = localStorage.getItem('runtix_total_sales');
    const savedRevenue = localStorage.getItem('runtix_total_revenue');

    if (savedSales || savedRevenue) {
      const activeSales = savedSales ? parseInt(savedSales) : mockAnalyticsData.kpis.totalTicketsSold;
      const activeRevenue = savedRevenue ? parseInt(savedRevenue) : mockAnalyticsData.kpis.totalRevenue;
      const activeProfit = activeRevenue - mockAnalyticsData.kpis.totalExpenses;

      return {
        ...mockAnalyticsData,
        kpis: {
          ...mockAnalyticsData.kpis,
          totalTicketsSold: activeSales,
          totalRevenue: activeRevenue,
          totalProfit: activeProfit
        },
        salesTrend: [
          ...mockAnalyticsData.salesTrend.slice(0, 3),
          { name: 'Minggu 4', revenue: activeRevenue }
        ],
        costVsRevenue: [
          { 
            name: 'Venture Metrics', 
            "Modal Awal (Expenses)": mockAnalyticsData.kpis.totalExpenses, 
            "Revenue Bulan 2": activeRevenue 
          }
        ]
      };
    }
    return mockAnalyticsData;
  });

  const [loading, setLoading] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseCost, setExpenseCost] = useState('');
  const [addingExpense, setAddingExpense] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = () => {
    fetch('/api/admin/analytics', {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Using fallback local analytics');
        return res.json();
      })
      .then((payload) => {
        // Jika backend aktif, prioritaskan data backend
        setData(payload);
      })
      .catch((err) => {
        console.log('Menggunakan data visualisasi real-time berbasis memori lokal.');
      });
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAnalytics();
  }, [user, navigate]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatShortIDR = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} Jt`;
    }
    return formatIDR(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const submitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDescription || !expenseCost) return;
    setError('');
    setAddingExpense(true);

    setTimeout(() => {
      if (data) {
        const newExpense: Expense = {
          id: String(data.expensesList.length + 1),
          description: expenseDescription,
          cost: Number(expenseCost)
        };
        
        const updatedExpenses = [newExpense, ...data.expensesList];
        const newTotalExpenses = data.kpis.totalExpenses + newExpense.cost;

        setData({
          ...data,
          kpis: {
            ...data.kpis,
            totalExpenses: newTotalExpenses,
            totalProfit: data.kpis.totalRevenue - newTotalExpenses
          },
          expensesList: updatedExpenses
        });
      }
      setExpenseDescription('');
      setExpenseCost('');
      setAddingExpense(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <div className="max-w-7xl mx-auto py-24 text-center">
          <svg className="animate-spin h-10 w-10 text-[#1a3b6c] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-slate-500 font-bold text-sm">Compiling running analytics model...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <Header />
        <div className="max-w-xl mx-auto py-24 text-center px-4">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0-8v6m0 5h.01M5.93 19.5h12.14a2 2 0 001.73-3L13.73 5.5a2 2 0 00-3.46 0L4.2 16.5a2 2 0 001.73 3z" />
          </svg>
          <h2 className="text-2xl font-black text-slate-800">Access Denied</h2>
          <p className="text-slate-500 mt-2">{error || 'You must be logged in as an administrator to view this page.'}</p>
          <button onClick={() => navigate('/login')} className="mt-6 px-6 py-3 rounded-xl bg-[#1a3b6c] text-white text-xs font-black cursor-pointer">
            GO TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  const kpiList = [
    { name: 'TARGET REVENUE', value: formatIDR(data.kpis.totalRevenue), icon: '💰', sub: 'Month 2 Goal: 100M IDR achieved!', color: 'text-emerald-600' },
    { name: 'TOTAL REGISTERED ATHLETES', value: `${data.kpis.totalTicketsSold} Tickets`, icon: '🏃‍♂️', sub: 'Seeded registrations list', color: 'text-[#1a3b6c]' },
    { name: 'ACCUMULATED EXPENSES', value: formatIDR(data.kpis.totalExpenses), icon: '📉', sub: 'Ads, Domain, & flyers', color: 'text-[#e86f2c]' },
    { name: 'CURRENT TOTAL PROFIT', value: formatIDR(data.kpis.totalProfit), icon: '📈', sub: 'Revenue minus initial capital', color: 'text-indigo-600' }
  ];

  const BAR_COLORS = ['#1a3b6c', '#295ca8', '#3c79d1', '#e86f2c', '#f19057'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Pitch Pitch Header banner */}
        <div className="bg-[#1a3b6c] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-pulse pointer-events-none"></div>
          <div className="relative z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 border border-white/25 text-white text-[10px] font-black uppercase tracking-wider mb-3">
              💼 VENTURE PITCH MODE ACTIVE
            </span>
            <h1 className="text-3xl font-black tracking-tight leading-none mb-2">
              RunTix Business Analytics Dashboard
            </h1>
            <p className="text-slate-300 font-medium text-sm">
              Live proof of venture validation: Month 2 targets reached with high-profit margins!
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm('Restore default presentation parameters?')) {
                  localStorage.removeItem('runtix_total_sales');
                  localStorage.removeItem('runtix_total_revenue');
                  setData(mockAnalyticsData);
                }
              }}
              className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-black cursor-pointer transition-all active:scale-95 text-white z-20 relative"
            >
              🔄 RESET DEMO DATA
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiList.map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.name}</span>
                <span className="text-2xl">{kpi.icon}</span>
              </div>
              <div className="mt-4">
                <span className={`text-2xl font-black ${kpi.color} tracking-tight`}>{kpi.value}</span>
                <span className="block text-[10px] text-slate-400 font-semibold mt-1">{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Sales Trend (Line Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col h-[380px]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">CUMULATIVE REVENUE TREND</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Low-cost validation to massive exponential scale</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                🚀 +5,000% Growth
              </span>
            </div>
            
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.salesTrend} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickFormatter={formatShortIDR} />
                  <Tooltip formatter={(value: any) => [formatIDR(value), 'Revenue']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Cumulative Sales" 
                    stroke="#1a3b6c" 
                    strokeWidth={4.5} 
                    activeDot={{ r: 8 }} 
                    dot={{ strokeWidth: 3, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cost vs Revenue Comparison (Dual Bar Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[380px]">
            <div className="mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">CAPITAL COST VS MONTH 2 REVENUE</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Visualizing high-profit validation multiplier</p>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.costVsRevenue} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickFormatter={formatShortIDR} />
                  <Tooltip formatter={(value: any) => [formatIDR(value)]} />
                  <Legend />
                  <Bar dataKey="Modal Awal (Expenses)" fill="#e86f2c" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Revenue Bulan 2" fill="#1a3b6c" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Row 2: Event Popularity Bar Chart & Expenses Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Event Popularity Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 flex flex-col h-[380px]">
            <div className="mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">REVENUE PER CHAMPIONSHIP EVENT</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Track which running category generates the peak revenue stream</p>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.eventPopularity} margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight={600} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight={600} tickFormatter={formatShortIDR} />
                  <Tooltip formatter={(value: any) => [formatIDR(value), 'Revenue']} />
                  <Bar dataKey="revenue" fill="#1a3b6c" radius={[8, 8, 0, 0]}>
                    {data.eventPopularity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Business Expenses Simulator Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-[380px]">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">EXPENSE TRANSACTION LOG</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Simulate digital marketing or hosting expenditures</p>
              </div>

              {/* Expenses List */}
              <div className="space-y-3 max-h-40 overflow-y-auto mb-4 border-b border-slate-50 pb-4">
                {data.expensesList.map((ex) => (
                  <div key={ex.id} className="flex justify-between items-center text-xs py-1">
                    <span className="font-bold text-slate-600 truncate max-w-[150px]">{ex.description}</span>
                    <span className="font-black text-[#e86f2c]">{formatIDR(ex.cost)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={submitExpense} className="space-y-3">
              <div>
                <input 
                  type="text" 
                  placeholder="e.g., Google Ads Campaign Month 2"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:ring-2 focus:ring-[#1a3b6c]"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-xs font-bold pointer-events-none">Rp</span>
                  <input 
                    type="number" 
                    placeholder="e.g. 1500000"
                    value={expenseCost}
                    onChange={(e) => setExpenseCost(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:ring-2 focus:ring-[#1a3b6c]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addingExpense}
                  className="px-4 bg-[#1a3b6c] hover:bg-[#e86f2c] text-white text-xs font-black rounded-xl uppercase transition-all cursor-pointer disabled:opacity-50"
                >
                  {addingExpense ? '...' : 'ADD'}
                </button>
              </div>
            </form>

          </div>

        </div>

        {/* Row 3: Recent Buyer Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">LATEST ATHLETE BOOKINGS</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Real-time purchase logs stream (Showing last 10 transactions)</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                  <th className="py-4 px-6">ATHLETE NAME</th>
                  <th className="py-4 px-6">EMAIL</th>
                  <th className="py-4 px-6">CHAMPIONSHIP RACE</th>
                  <th className="py-4 px-6">TRANSACTION DATE</th>
                  <th className="py-4 px-6 text-right">TOTAL PRICE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {data.recentPurchases.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-black text-slate-900">{p.buyerName}</td>
                    <td className="py-4 px-6 font-mono text-slate-400">{p.buyerEmail}</td>
                    <td className="py-4 px-6 text-[#1a3b6c] font-black">{p.eventTitle}</td>
                    <td className="py-4 px-6">{formatDate(p.purchaseDate)}</td>
                    <td className="py-4 px-6 text-right font-black text-emerald-600">{formatIDR(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
