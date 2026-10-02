import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import ResourcesList from './pages/ResourcesList';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';

function AppContent() {
  const { user, loading } = useAuth();

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
        Loading Campus Portal...
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">

        <Navbar />

        <main className="flex-1">
          <Routes>

            {/* PUBLIC HOME */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* REGISTER */}
            <Route
              path="/register"
              element={<Register />}
            />

            {/* UNKNOWN PUBLIC ROUTE */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </main>

      </div>
    );
  }

  // ==========================================
  // LOGGED IN
  // ==========================================
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">

      <Navbar />

      <main className="flex-1">
        <Routes>

          {/* ==================================
              ADMIN ROUTES
          ================================== */}

          {user.role === 'admin' ? (
            <>

              {/* ADMIN HOME */}

              <Route
                path="/"
                element={<Home />}
              />

              {/* ADMIN APPROVALS & RESOURCES */}

              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              {/* ADMIN ANALYTICS */}

              <Route
                path="/analytics"
                element={<Analytics />}
              />

              {/* UNKNOWN ADMIN ROUTE */}

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </>
          ) : (

            /* ==================================
               STUDENT / FACULTY ROUTES
            ================================== */

            <>

              {/* FACILITIES & BOOKING */}

              <Route
                path="/"
                element={<ResourcesList />}
              />

              <Route
                path="/facilities"
                element={<ResourcesList />}
              />

              {/* MY BOOKINGS */}

              <Route
                path="/my-bookings"
                element={<MyBookings />}
              />

              {/* UNKNOWN STUDENT/FACULTY ROUTE */}

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </>

          )}

        </Routes>
      </main>

    </div>
  );
}

export default function App() {
  return (
    <Router>

      <AuthProvider>

        <AppContent />

      </AuthProvider>

    </Router>
  );
}