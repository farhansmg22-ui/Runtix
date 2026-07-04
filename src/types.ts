export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  price: number;
  max_participants: number;
  current_participants: number;
  image_url: string;
}

export interface Ticket {
  id: number;
  user_id: number;
  event_id: number;
  purchase_date: string;
  total_price: number;
  status: string;
  user_name?: string;
  user_email?: string;
  event_title?: string;
}

export interface Expense {
  id: number;
  description: string;
  cost: number;
}

export interface KPIs {
  totalRevenue: number;
  totalTicketsSold: number;
  totalExpenses: number;
  totalProfit: number;
}

export interface SalesTrendItem {
  name: string;
  revenue: number;
}

export interface EventPopularityItem {
  name: string;
  revenue: number;
  ticketsSold: number;
}

export interface CostVsRevenueItem {
  name: string;
  'Modal Awal (Expenses)': number;
  'Revenue Bulan 2': number;
}

export interface RecentPurchaseItem {
  buyerName: string;
  buyerEmail: string;
  eventTitle: string;
  purchaseDate: string;
  price: number;
}

export interface AnalyticsData {
  kpis: KPIs;
  salesTrend: SalesTrendItem[];
  eventPopularity: EventPopularityItem[];
  costVsRevenue: CostVsRevenueItem[];
  recentPurchases: RecentPurchaseItem[];
  expensesList: Expense[];
}
