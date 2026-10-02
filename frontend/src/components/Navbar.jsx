import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  CalendarDays,
  Bell,
  LogOut,
  Shield,
  GraduationCap,
  Briefcase,
  LayoutDashboard,
  Building2,
  BookmarkCheck,
  BarChart3,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import NotificationDrawer from './NotificationDrawer';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);

  // ============================================================
  // FETCH UNREAD NOTIFICATIONS
  // ============================================================

  const fetchUnread = async () => {
    if (!user) return;

    try {
      const res = await api.get('/notifications');

      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {
      // Ignore notification errors
    }
  };

  // ============================================================
  // POLL NOTIFICATIONS EVERY 15 SECONDS
  // ============================================================

  useEffect(() => {
    if (!user) return;

    fetchUnread();

    const interval = setInterval(fetchUnread, 15000);

    return () => clearInterval(interval);
  }, [user]);

  // ============================================================
  // CLOSE NOTIFICATION DRAWER ON OUTSIDE CLICK
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // ROLE BADGE
  // ============================================================

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <Shield className="w-3 h-3" />
            Admin
          </span>
        );

      case 'faculty':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Briefcase className="w-3 h-3" />
            Faculty
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <GraduationCap className="w-3 h-3" />
            Student
          </span>
        );
    }
  };

  // ============================================================
  // ACTIVE ROUTE
  // ============================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // ============================================================
  // HIDE NAVBAR ONLY ON PUBLIC HOME PAGE
  // ============================================================

  if (location.pathname === '/' && !user) {
    return null;
  }

  // ============================================================
  // NAVBAR
  // ============================================================

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* ==================================================
              BRAND / LOGO
          ================================================== */}

          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <CalendarDays className="w-5 h-5" />
            </div>

            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                CampusReserve
              </span>
            </div>
          </Link>

          {/* ==================================================
              NAVIGATION
          ================================================== */}

          {user && (
            <nav className="hidden md:flex items-center gap-1">

              {/* ==================================================
                  ADMIN NAVIGATION
              ================================================== */}

              {user.role === 'admin' ? (
                <>

                  {/* ==================================================
                      ADMIN APPROVALS & RESOURCES
                  ================================================== */}

                  <Link
                    to="/admin"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      isActive('/admin')
                        ? 'bg-rose-50 text-rose-700 font-bold border border-rose-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-rose-500" />

                    Admin Approvals & Resources
                  </Link>

                  {/* ==================================================
                      ANALYTICS — ADMIN ONLY
                  ================================================== */}

                  <Link
                    to="/analytics"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      isActive('/analytics')
                        ? 'bg-slate-100 text-indigo-600 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />

                    Analytics
                  </Link>

                </>
              ) : (

                <>
                  {/* ==================================================
                      STUDENT / FACULTY NAVIGATION
                  ================================================== */}

                  {/* FACILITIES & BOOKING */}

                  <Link
                    to="/"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      isActive('/')
                        ? 'bg-slate-100 text-indigo-600 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />

                    Facilities & Booking
                  </Link>

                  {/* MY BOOKINGS */}

                  <Link
                    to="/my-bookings"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      isActive('/my-bookings')
                        ? 'bg-slate-100 text-indigo-600 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />

                    My Bookings
                  </Link>

                </>
              )}

            </nav>
          )}

          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <div className="flex items-center gap-3">

            {user ? (
              <>

                {/* ==================================================
                    NOTIFICATIONS
                ================================================== */}

                <div
                  className="relative"
                  ref={notifRef}
                >
                  <button
                    onClick={() => {
                      setNotificationsOpen(
                        !notificationsOpen
                      );

                      if (!notificationsOpen) {
                        setUnreadCount(0);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative"
                    aria-label="View notifications"
                  >
                    <Bell className="w-4 h-4" />

                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <NotificationDrawer
                    isOpen={notificationsOpen}
                    onClose={() =>
                      setNotificationsOpen(false)
                    }
                  />
                </div>

                {/* ==================================================
                    USER DETAILS
                ================================================== */}

                <div className="flex items-center gap-2">

                  <div className="flex flex-col items-end">

                    <div className="flex items-center gap-1.5">

                      <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                        {user.name}
                      </span>

                      {getRoleBadge(user.role)}

                    </div>

                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      {user.rollNoOrId}
                    </span>

                  </div>

                  {/* ==================================================
                      LOGOUT
                  ================================================== */}

                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />

                    <span className="hidden sm:inline">
                      Logout
                    </span>
                  </button>

                </div>

              </>
            ) : null}

          </div>

        </div>

      </div>
    </header>
  );
}