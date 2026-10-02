import React, { useEffect, useState } from 'react';

import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  CalendarDays,
  TrendingUp,
  Activity,
  ArrowUpRight,
  RefreshCw,
  Users,
  CircleDot,
  XCircle,
  Timer,
} from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Analytics() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ============================================================
  // FETCH ANALYTICS
  // ============================================================

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await api.get('/stats');

      setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  // ============================================================
  // STATUS CONFIG
  // ============================================================

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          icon: CheckCircle2,
          className:
            'bg-emerald-50 text-emerald-700 border border-emerald-100',
          dot: 'bg-emerald-500',
        };

      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          className:
            'bg-rose-50 text-rose-700 border border-rose-100',
          dot: 'bg-rose-500',
        };

      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          className:
            'bg-amber-50 text-amber-700 border border-amber-100',
          dot: 'bg-amber-500',
        };

      case 'pending':
        return {
          label: 'Pending',
          icon: Timer,
          className:
            'bg-orange-50 text-orange-700 border border-orange-100',
          dot: 'bg-orange-500',
        };

      default:
        return {
          label: status || 'Unknown',
          icon: CircleDot,
          className:
            'bg-slate-50 text-slate-600 border border-slate-100',
          dot: 'bg-slate-400',
        };
    }
  };

  // ============================================================
  // ACCESS PROTECTION
  // ============================================================

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900">
            Restricted Access
          </h2>

          <p className="text-sm text-slate-500 mt-2 mb-6 leading-6">
            The analytics dashboard is available only to
            Campus Administrators.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition"
          >
            Return to Facilities
            <ArrowUpRight className="w-4 h-4" />
          </Link>

        </div>
      </div>
    );
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="animate-pulse mb-8">
            <div className="h-4 w-48 bg-slate-200 rounded mb-3" />
            <div className="h-9 w-96 max-w-full bg-slate-200 rounded mb-3" />
            <div className="h-4 w-[500px] max-w-full bg-slate-200 rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 bg-white rounded-3xl border border-slate-200 animate-pulse"
              />
            ))}

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse" />

            <div className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse" />

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // SAFE DATA
  // ============================================================

  const totalResources = stats?.totalResources || 0;
  const activeResources = stats?.activeResources || 0;
  const totalBookings = stats?.totalBookings || 0;
  const pendingBookings = stats?.pendingBookings || 0;
  const todayBookings = stats?.todayBookingsCount || 0;

  const recentBookings = stats?.recentBookings || [];

  // ============================================================
  // RECENT BOOKING STATUS COUNTS
  // ============================================================

  const recentApproved = recentBookings.filter(
    (booking) => booking.status === 'approved'
  ).length;

  const recentRejected = recentBookings.filter(
    (booking) => booking.status === 'rejected'
  ).length;

  const recentPending = recentBookings.filter(
    (booking) => booking.status === 'pending'
  ).length;

  const recentCancelled = recentBookings.filter(
    (booking) => booking.status === 'cancelled'
  ).length;

  // ============================================================
  // MAIN DASHBOARD
  // ============================================================

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-7 mb-7">

          <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-3">

                <TrendingUp className="w-3.5 h-3.5" />

                Campus Resource Analytics

              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
                Facility Utilization
                <span className="text-indigo-600">
                  {' '} & Booking Metrics
                </span>
              </h1>

              <p className="text-sm text-slate-500 mt-2 max-w-2xl leading-6">
                Monitor campus facilities, booking demand,
                reservation activity, and approval status from
                one centralized dashboard.
              </p>

            </div>

            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              className="self-start lg:self-center inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold rounded-xl shadow-sm transition disabled:opacity-60"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing ? 'animate-spin' : ''
                }`}
              />

              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>

          </div>
        </div>

        {/* ======================================================
            KPI CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">

          {/* FACILITIES */}

          <div className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">

            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform" />

            <div className="relative">

              <div className="flex items-start justify-between mb-5">

                <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
                  Facilities
                </span>

              </div>

              <div className="text-3xl font-black text-slate-900">
                {totalResources}
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeResources} active & available
              </div>

            </div>
          </div>

          {/* TOTAL BOOKING REQUESTS */}

          <div className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">

            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform" />

            <div className="relative">

              <div className="flex items-start justify-between mb-5">

                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 bg-purple-50 px-2 py-1 rounded-lg">
                  Requests
                </span>

              </div>

              <div className="text-3xl font-black text-slate-900">
                {totalBookings}
              </div>

              <div className="text-[11px] text-slate-500 font-medium mt-2">
                Total booking requests
              </div>

            </div>
          </div>

          {/* PENDING */}

          <div className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">

            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform" />

            <div className="relative">

              <div className="flex items-start justify-between mb-5">

                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Clock3 className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                  Pending
                </span>

              </div>

              <div className="text-3xl font-black text-orange-600">
                {pendingBookings}
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-orange-700">
                <Timer className="w-3.5 h-3.5" />
                Awaiting administrator review
              </div>

            </div>
          </div>

          {/* TODAY */}

          <div className="group relative overflow-hidden bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">

            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -translate-y-10 translate-x-10 group-hover:scale-125 transition-transform" />

            <div className="relative">

              <div className="flex items-start justify-between mb-5">

                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  Today
                </span>

              </div>

              <div className="text-3xl font-black text-emerald-600">
                {todayBookings}
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
                <Activity className="w-3.5 h-3.5" />
                Active reservations today
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================
            BOOKING OVERVIEW + RECENT ACTIVITY
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ====================================================
              BOOKING OVERVIEW
          ==================================================== */}

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>

                  <div>

                    <h2 className="text-base font-extrabold text-slate-900">
                      Booking Overview
                    </h2>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Recent booking status summary
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="p-6 space-y-4">

              {/* TOTAL */}

              <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 border border-indigo-100">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                    <CalendarDays className="w-4 h-4 text-indigo-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Total Requests
                    </p>

                    <p className="text-[10px] text-slate-500">
                      All booking records
                    </p>
                  </div>

                </div>

                <span className="text-2xl font-black text-indigo-600">
                  {totalBookings}
                </span>

              </div>

              {/* APPROVED */}

              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Approved
                    </p>

                    <p className="text-[10px] text-slate-500">
                      In recent activity
                    </p>
                  </div>

                </div>

                <span className="text-2xl font-black text-emerald-600">
                  {recentApproved}
                </span>

              </div>

              {/* PENDING */}

              <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 border border-orange-100">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                    <Clock3 className="w-4 h-4 text-orange-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Pending
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Awaiting review
                    </p>
                  </div>

                </div>

                <span className="text-2xl font-black text-orange-600">
                  {pendingBookings}
                </span>

              </div>

              {/* REJECTED */}

              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-100">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-rose-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Rejected
                    </p>

                    <p className="text-[10px] text-slate-500">
                      In recent activity
                    </p>
                  </div>

                </div>

                <span className="text-2xl font-black text-rose-600">
                  {recentRejected}
                </span>

              </div>

              {/* CANCELLED */}

              <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-100">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-amber-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      Cancelled
                    </p>

                    <p className="text-[10px] text-slate-500">
                      In recent activity
                    </p>
                  </div>

                </div>

                <span className="text-2xl font-black text-amber-600">
                  {recentCancelled}
                </span>

              </div>

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">

              <div className="flex items-center gap-2 text-[11px] text-slate-500">

                <Activity className="w-3.5 h-3.5 text-indigo-500" />

                <span>
                  Status counts are based on recent booking activity.
                </span>

              </div>

            </div>

          </div>

          {/* ====================================================
              RECENT BOOKINGS
          ==================================================== */}

          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>

                  <div>

                    <h2 className="text-base font-extrabold text-slate-900">
                      Recent Booking Activity
                    </h2>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Latest reservation activity across campus
                    </p>

                  </div>

                </div>

                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600 text-[10px] font-bold">

                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />

                  Live Data

                </span>

              </div>

            </div>

            <div className="p-5">

              {recentBookings.length === 0 ? (

                <div className="py-12 text-center">

                  <CalendarDays className="w-10 h-10 text-slate-200 mx-auto mb-3" />

                  <p className="text-sm font-semibold text-slate-500">
                    No recent bookings
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    New reservation activity will appear here.
                  </p>

                </div>

              ) : (

                <div className="space-y-3">

                  {recentBookings.map((booking) => {

                    const status =
                      getStatusConfig(booking.status);

                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={booking._id}
                        className="group flex items-center gap-4 p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-2xl transition-all duration-200"
                      >

                        {/* ICON */}

                        <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white border border-slate-200 items-center justify-center shrink-0">
                          <CalendarDays className="w-4 h-4 text-indigo-500" />
                        </div>

                        {/* DETAILS */}

                        <div className="flex-1 min-w-0">

                          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                            {booking.resource?.name ||
                              'Unknown Facility'}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">

                            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                              {booking.user?.name ||
                                'Unknown User'}
                            </span>

                            <span className="text-slate-300">
                              •
                            </span>

                            <span className="text-[10px] sm:text-[11px] text-slate-500">
                              {booking.date}
                            </span>

                            <span className="text-slate-300">
                              •
                            </span>

                            <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
                              {booking.startTime} -{' '}
                              {booking.endTime}
                            </span>

                          </div>

                        </div>

                        {/* STATUS */}

                        <div
                          className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold ${status.className}`}
                        >

                          <span
                            className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                          />

                          <span className="hidden sm:inline">
                            {status.label}
                          </span>

                          <StatusIcon className="w-3 h-3 sm:hidden" />

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">

              <div className="flex items-center gap-2 text-[11px] text-slate-500">

                <Clock3 className="w-3.5 h-3.5 text-indigo-500" />

                <span>
                  Latest reservation requests
                </span>

              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">

                <Users className="w-3.5 h-3.5" />

                Campus-wide

              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
            QUICK SUMMARY
        ====================================================== */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* ACTIVE FACILITIES */}

          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">

            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>

            <div>

              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Active Facilities
              </p>

              <p className="text-sm font-extrabold text-slate-900">
                {activeResources} / {totalResources}
              </p>

            </div>

          </div>

          {/* AWAITING REVIEW */}

          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">

            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Clock3 className="w-4 h-4" />
            </div>

            <div>

              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Awaiting Review
              </p>

              <p className="text-sm font-extrabold text-slate-900">
                {pendingBookings} booking
                {pendingBookings !== 1 ? 's' : ''}
              </p>

            </div>

          </div>

          {/* TODAY */}

          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">

            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>

            <div>

              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                Today's Activity
              </p>

              <p className="text-sm font-extrabold text-slate-900">
                {todayBookings} reservation
                {todayBookings !== 1 ? 's' : ''}
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}