# 🏃‍♂️ RunTix.id - Premium Online Running Event Ticketing Platform

RunTix.id is a full-stack, production-ready running event ticketing and business analytics application built for venture pitch presentations. Designed to facilitate seamless race registrations, it showcases dynamic financial forecasting, customer acquisition trend analysis, and comprehensive kpi validation metrics.

---

## ⚡ Venture Capital Pitch Metric Blueprint

To achieve the requested assignments objectives, RunTix.id is pre-loaded with an elite dataset to satisfy and present the business venture's feasibility study immediately:

### 1. Financial Forecasting (Month 2 Target Reached)
- **Initial Cost (Modal Awal)**: `3,000,000 IDR` (Includes Ads & digital marketing, domain/hosting, and printing flyers).
- **Target Revenue reached**: `102,000,000 IDR` (Month 2 goals surpassed!).
- **Venture Net Profit**: `99,000,000 IDR` (Outstanding gross profit margin of ~97%).
- **Ticket Sales**: `410` tickets securely transacted.

### 2. Championship Seeded Event Quotas
1. **BTN Jakarta International Marathon 2026**
   - *Date*: 14 June 2026
   - *Entrance Fee*: `350,000 IDR`
   - *Pre-sold Quota*: `100 / 500 Slots`
   - *Accumulated Revenue*: `35,000,000 IDR`
2. **Borobudur Marathon 2026**
   - *Date*: 20 August 2026
   - *Entrance Fee*: `250,000 IDR`
   - *Pre-sold Quota*: `150 / 500 Slots`
   - *Accumulated Revenue*: `37,500,000 IDR`
3. **Semarang 10k 2026**
   - *Date*: 15 December 2026
   - *Entrance Fee*: `150,000 IDR`
   - *Pre-sold Quota*: `80 / 300 Slots`
   - *Accumulated Revenue*: `12,000,000 IDR`
4. **Bandung Trail Run 2026**
   - *Date*: 10 October 2026
   - *Entrance Fee*: `200,000 IDR`
   - *Pre-sold Quota*: `50 / 200 Slots`
   - *Accumulated Revenue*: `10,000,000 IDR`
5. **Bali Sunset Half Marathon 2026**
   - *Date*: 05 November 2026
   - *Entrance Fee*: `250,000 IDR`
   - *Pre-sold Quota*: `30 / 400 Slots`
   - *Accumulated Revenue*: `7,500,000 IDR`

---

## 🛠️ Technical Stack & Architecture

- **Frontend**: React 19 (Vite) + Tailwind CSS + Recharts (for fluid, modern visual charts) + React Router 6.
- **Backend**: Node.js + Express + JSON Web Tokens (JWT) + Bcrypt.js.
- **Database**: High-fidelity file-based relational database manager (`runtix_db.json`) enabling zero native link errors on remote Cloud Run containers, self-healing state transitions, and persistent writes.

---

## 🔑 Demo Quick-Access Accounts

We've embedded a **One-Tap Quick Login Selector** directly on the Login page to make the live pitch presentation flawless:

1. **Venture Administrator**:
   - **Email**: `admin@runtix.id`
   - **Password**: `admin123`
   - *Role*: Full access to cumulative charts, Cost-vs-Revenue dual metrics, recent transaction streams, and manual expenditure logging.

2. **Standard Athlete / Customer**:
   - **Email**: `budi@gmail.com`
   - **Password**: `password123`
   - *Role*: Register for upcoming races, purchase tickets, choose simulated payment channels, and view QR/Barcode-validated Race Passes in the Locker.

---

## 🚀 Step-by-Step Installation & Run Guide

### 1. Install Dependencies
Ensure you have Node.js (v18+) installed, then execute:
```bash
npm install
```

### 2. Pre-seed the Dataset
Re-initialize and populate the database collections with the exact pre-calculated `102,000,000 IDR` revenue:
```bash
node backend/seed.js
```

### 3. Start Development Server
Boot the Express back-end and Vite client concurrently:
```bash
npm run dev
```
The applet will instantly host at `http://localhost:3000`.

### 4. Build for Production
Bundle React assets and compile the Express server into a highly optimized CommonJS single bundle:
```bash
npm run build
```

### 5. Launch Production Server
```bash
npm run start
```

---

## 📊 Analytics Features Explained (Recharts)

- **KPI Cards**: Tracks total transactions, aggregated revenue, expenses, and net profit live.
- **Cumulative Growth Curve**: Displays a growth curve starting low in Month 1 (`2,000,000 IDR`) and skyrocketing to `102,000,000 IDR` in Month 2 to prove exponential growth.
- **Race Category Revenue Stream (Bar Chart)**: Visual comparison of revenue per championship (Borobudur is highest, Bali is lowest).
- **Cost vs Revenue Proportions (Dual Bar Chart)**: Compares the initial capital of `3,000,000 IDR` against the monumental `102,000,000 IDR` revenue.
- **Expenses Simulator**: Add an expense from the admin panel (e.g. Google Ads = `1,500,000 IDR`) and watch the Net Profit KPI recalculate in real-time.
- **Live Transaction Logs**: High-contrast, tabular ledger reflecting the last 10 purchases.
