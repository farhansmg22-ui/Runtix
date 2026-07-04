import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_FILE = path.resolve(process.cwd(), 'runtix_db.json');

// Helper to read database
export function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return seedFallback();
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON DB, initializing fallback:', err);
    return seedFallback();
  }
}

// Helper to write database
export function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing JSON DB:', err);
    return false;
  }
}

// Complete database reset and seeding
export function seedFallback() {
  console.log('Running High-Fidelity Database Auto-Seed...');
  
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const userPasswordHash = bcrypt.hashSync('password123', 10);

  const users = [
    { id: 1, name: 'Admin RunTix', email: 'admin@runtix.id', password_hash: adminPasswordHash, role: 'admin' },
    { id: 2, name: 'Budi Santoso', email: 'budi@gmail.com', password_hash: userPasswordHash, role: 'user' },
    { id: 3, name: 'Siti Aminah', email: 'siti@gmail.com', password_hash: userPasswordHash, role: 'user' },
    { id: 4, name: 'Rudi Hermawan', email: 'rudi@gmail.com', password_hash: userPasswordHash, role: 'user' },
    { id: 5, name: 'Dewi Lestari', email: 'dewi@gmail.com', password_hash: userPasswordHash, role: 'user' },
    { id: 6, name: 'Andi Wijaya', email: 'andi@gmail.com', password_hash: userPasswordHash, role: 'user' },
    { id: 7, name: 'Rian Hidayat', email: 'rian@gmail.com', password_hash: userPasswordHash, role: 'user' },
    { id: 8, name: 'Mega Putri', email: 'mega@gmail.com', password_hash: userPasswordHash, role: 'user' },
    { id: 9, name: 'Fajar Nugroho', email: 'fajar@gmail.com', password_hash: userPasswordHash, role: 'user' },
    { id: 10, name: 'Eko Prasetyo', email: 'eko@gmail.com', password_hash: userPasswordHash, role: 'user' },
    { id: 11, name: 'Novianti', email: 'novi@gmail.com', password_hash: userPasswordHash, role: 'user' },
  ];

  const events = [
    {
      id: 1,
      title: 'BTN Jakarta International Marathon 2026',
      description: 'The premium international marathon running through the main landmarks of Jakarta, offering Full Marathon, Half Marathon, and 10K categories.',
      location: 'Gelora Bung Karno Jakarta',
      date: '2026-06-14',
      price: 350000,
      max_participants: 500,
      current_participants: 100,
      image_url: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'Borobudur Marathon 2026',
      description: 'Run through cultural heritage and scenic local villages around the majestic Borobudur Temple, experiencing deep local hospitality.',
      location: 'Taman Lumbini Borobudur, Magelang',
      date: '2026-08-20',
      price: 250000,
      max_participants: 500,
      current_participants: 150,
      image_url: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: 'Semarang 10k 2026',
      description: 'A nostalgic running journey exploring the historical Old Town (Kota Lama) of Semarang with unique culinary and cultural spots along the route.',
      location: 'Balaikota Semarang',
      date: '2026-12-15',
      price: 150000,
      max_participants: 300,
      current_participants: 80,
      image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 4,
      title: 'Bandung Trail Run 2026',
      description: 'A challenging yet beautiful off-road trail running event amidst the pine forests and refreshing mountains of Dago Pakar Bandung.',
      location: 'Dago Pakar Bandung',
      date: '2026-10-10',
      price: 200000,
      max_participants: 200,
      current_participants: 50,
      image_url: 'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 5,
      title: 'Bali Sunset Half Marathon 2026',
      description: 'Run with the spectacular sunset view starting and finishing around the iconic GWK Cultural Park, with sea-breeze refreshing your path.',
      location: 'GWK Cultural Park Bali',
      date: '2026-11-05',
      price: 250000,
      max_participants: 400,
      current_participants: 30,
      image_url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const expenses = [
    { id: 1, description: 'Social Media Ads & Digital Marketing', cost: 2000000 },
    { id: 2, description: 'Custom Domain & Cloud Web Hosting', cost: 500000 },
    { id: 3, description: 'Flyers & Physical Banner Printing', cost: 500000 }
  ];

  const tickets = [];
  const ticketSalesConfig = [
    { eventId: 1, price: 350000, count: 100 },
    { eventId: 2, price: 250000, count: 150 },
    { eventId: 3, price: 150000, count: 80 },
    { eventId: 4, price: 200000, count: 50 },
    { eventId: 5, price: 250000, count: 30 },
  ];

  let ticketId = 1;
  let month1Counter = 0;

  ticketSalesConfig.forEach((config) => {
    for (let i = 0; i < config.count; i++) {
      // User IDs 2 to 11
      const userId = (i % 10) + 2;
      
      let purchaseDate = '';
      if (config.eventId === 2 && month1Counter < 8) {
        // Place exactly 8 tickets in Month 1 (May 2026) -> 8 * 250k = 2,000,000 IDR
        const day = String((i % 28) + 1).padStart(2, '0');
        purchaseDate = `2026-05-${day}`;
        month1Counter++;
      } else {
        // Month 2 (June 2026) -> All other tickets (402)
        const day = String((i % 30) + 1).padStart(2, '0');
        purchaseDate = `2026-06-${day}`;
      }

      tickets.push({
        id: ticketId++,
        user_id: userId,
        event_id: config.eventId,
        purchase_date: purchaseDate,
        total_price: config.price,
        status: 'paid'
      });
    }
  });

  const state = { users, events, expenses, tickets };
  writeDB(state);
  console.log(`Successfully Auto-Seeded RunTix.id Database (102M IDR revenue pre-calculated!)`);
  return state;
}

// Database Operations Wrapper
export const db = {
  // Reset and Seed DB
  reset() {
    return seedFallback();
  },

  // Users
  getUsers() {
    return readDB().users;
  },
  getUserById(id) {
    return readDB().users.find((u) => u.id === Number(id));
  },
  getUserByEmail(email) {
    return readDB().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  addUser(name, email, passwordHash, role = 'user') {
    const data = readDB();
    const newId = data.users.length > 0 ? Math.max(...data.users.map((u) => u.id)) + 1 : 1;
    const newUser = { id: newId, name, email, password_hash: passwordHash, role };
    data.users.push(newUser);
    writeDB(data);
    return newUser;
  },

  // Events
  getEvents() {
    return readDB().events;
  },
  getEventById(id) {
    return readDB().events.find((e) => e.id === Number(id));
  },
  updateEventParticipants(id, increment = 1) {
    const data = readDB();
    const event = data.events.find((e) => e.id === Number(id));
    if (event) {
      event.current_participants += increment;
      writeDB(data);
      return event;
    }
    return null;
  },

  // Tickets
  getTickets() {
    return readDB().tickets;
  },
  getTicketsWithDetails() {
    const data = readDB();
    return data.tickets.map((t) => {
      const user = data.users.find((u) => u.id === t.user_id) || { name: 'Unknown User', email: '' };
      const event = data.events.find((e) => e.id === t.event_id) || { title: 'Unknown Event' };
      return {
        ...t,
        user_name: user.name,
        user_email: user.email,
        event_title: event.title
      };
    });
  },
  addTicket(userId, eventId, purchaseDate, totalPrice, status = 'paid') {
    const data = readDB();
    const newId = data.tickets.length > 0 ? Math.max(...data.tickets.map((t) => t.id)) + 1 : 1;
    const newTicket = { id: newId, user_id: Number(userId), event_id: Number(eventId), purchase_date: purchaseDate, total_price: Number(totalPrice), status };
    data.tickets.push(newTicket);
    
    // Update event participants
    const event = data.events.find((e) => e.id === Number(eventId));
    if (event) {
      event.current_participants += 1;
    }
    
    writeDB(data);
    return newTicket;
  },

  // Expenses
  getExpenses() {
    return readDB().expenses;
  },
  addExpense(description, cost) {
    const data = readDB();
    const newId = data.expenses.length > 0 ? Math.max(...data.expenses.map((e) => e.id)) + 1 : 1;
    const newExpense = { id: newId, description, cost: Number(cost) };
    data.expenses.push(newExpense);
    writeDB(data);
    return newExpense;
  }
};

export default db;
