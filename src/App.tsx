import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ExploreEvents from './components/ExploreEvents';
import EventDetail from './components/EventDetail';
import Login from './components/Login';
import MyTickets from './components/MyTickets';
import AdminDashboard from './components/AdminDashboard';
import { getUser } from './lib/auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = getUser();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = getUser();
  return user && user.role === 'admin' ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<ExploreEvents />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        
        {/* Private Customer Locker */}
        <Route 
          path="/my-tickets" 
          element={
            <PrivateRoute>
              <MyTickets />
            </PrivateRoute>
          } 
        />

        {/* Private Admin Panel */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
