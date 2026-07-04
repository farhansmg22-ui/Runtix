import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import db from './backend/db.js';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'runtix_super_secret_jwt_key_2026';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Authentication Middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// Admin authorization middleware
function authorizeAdmin(req: any, res: any, next: any) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Administrator role required' });
  }
}

// ==================== AUTHENTICATION API ====================

// Register Endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email and password' });
  }

  const existingUser = db.getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email address already registered' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = db.addUser(name, email, passwordHash, 'user');

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  const user = db.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});


// ==================== EVENTS API ====================

// Get All Events
app.get('/api/events', (req, res) => {
  const events = db.getEvents();
  res.json(events);
});

// Get Single Event Detail
app.get('/api/events/:id', (req, res) => {
  const event = db.getEventById(Number(req.params.id));
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.json(event);
});


// ==================== TICKETS API ====================

// Buy Ticket (Protected)
app.post('/api/tickets', authenticateToken, (req: any, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  const event = db.getEventById(Number(eventId));
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  if (event.current_participants >= event.max_participants) {
    return res.status(400).json({ message: 'Sold Out! Ticket quota for this event is full.' });
  }

  const purchaseDate = new Date().toISOString().split('T')[0];
  const ticket = db.addTicket(userId, event.id, purchaseDate, event.price);

  res.status(201).json({
    message: 'Ticket purchased successfully',
    ticket
  });
});

// Get User Purchases (Protected)
app.get('/api/tickets/my', authenticateToken, (req: any, res) => {
  const tickets = db.getTicketsWithDetails();
  const userTickets = tickets.filter((t) => t.user_id === Number(req.user.id));
  res.json(userTickets);
});


// ==================== ADMIN ANALYTICS API ====================

// Admin Dashboard Analytics (Protected & Admin Only)
app.get('/api/admin/analytics', authenticateToken, authorizeAdmin, (req, res) => {
  const tickets = db.getTicketsWithDetails();
  const expenses = db.getExpenses();
  const events = db.getEvents();

  // 1. KPI Metrics
  const totalRevenue = tickets.reduce((sum, t) => sum + t.total_price, 0);
  const totalTicketsSold = tickets.length;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0);
  const totalProfit = totalRevenue - totalExpenses;

  // 2. Sales Trend Chart (Month 1 vs Month 2)
  // Month 1 (May 2026): 2,000,000 IDR
  // Month 2 (June 2026): everything else
  let month1Revenue = 0;
  let month2Revenue = 0;

  tickets.forEach((t) => {
    if (t.purchase_date.startsWith('2026-05')) {
      month1Revenue += t.total_price;
    } else if (t.purchase_date.startsWith('2026-06')) {
      month2Revenue += t.total_price;
    }
  });

  const salesTrend = [
    { name: 'Month 1', revenue: month1Revenue },
    { name: 'Month 2', revenue: month1Revenue + month2Revenue } // Cumulative growth line
  ];

  // 3. Event Popularity Chart (Revenue per Event)
  const eventPopularity = events.map((ev) => {
    const eventTickets = tickets.filter((t) => t.event_id === ev.id);
    const revenue = eventTickets.reduce((sum, t) => sum + t.total_price, 0);
    return {
      name: ev.title.replace(' 2026', '').replace('International ', ''), // shorten name for chart
      revenue: revenue,
      ticketsSold: eventTickets.length
    };
  }).sort((a, b) => b.revenue - a.revenue); // highest to lowest

  // 4. Cost vs Revenue (Dual Bar Chart)
  // Capital/Cost (3,000,000) vs Month 2 Cumulative Revenue (102,000,000)
  const costVsRevenue = [
    {
      name: 'Business Comparison',
      'Modal Awal (Expenses)': totalExpenses,
      'Revenue Bulan 2': totalRevenue
    }
  ];

  // 5. Recent Buyer Table (Last 10 Purchases)
  // Sorted by purchase date or ID descending
  const sortedTickets = [...tickets].sort((a, b) => {
    // Sort by date descending, or by ID descending
    if (a.purchase_date !== b.purchase_date) {
      return b.purchase_date.localeCompare(a.purchase_date);
    }
    return b.id - a.id;
  });
  const recentPurchases = sortedTickets.slice(0, 10).map((t) => ({
    buyerName: t.user_name,
    buyerEmail: t.user_email,
    eventTitle: t.event_title,
    purchaseDate: t.purchase_date,
    price: t.total_price
  }));

  res.json({
    kpis: {
      totalRevenue,
      totalTicketsSold,
      totalExpenses,
      totalProfit
    },
    salesTrend,
    eventPopularity,
    costVsRevenue,
    recentPurchases,
    expensesList: expenses
  });
});


// Add Expense (Admin Only)
app.post('/api/admin/expenses', authenticateToken, authorizeAdmin, (req, res) => {
  const { description, cost } = req.body;
  if (!description || !cost) {
    return res.status(400).json({ message: 'Description and cost are required' });
  }
  const expense = db.addExpense(description, Number(cost));
  res.status(201).json({ message: 'Expense added successfully', expense });
});

// Reset Database (Admin Only)
app.post('/api/admin/reset', authenticateToken, authorizeAdmin, (req, res) => {
  db.reset();
  res.json({ message: 'Database reset successfully' });
});


// ==================== VITE & FRONTEND SERVING ====================

async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('Failed to initialize server:', err);
});
