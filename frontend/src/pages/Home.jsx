import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-slate-50">

      {/* Main Box */}
      <div className="w-full max-w-5xl border-2 border-indigo-200 rounded-2xl bg-white shadow-lg px-6 sm:px-10 lg:px-16 py-12 sm:py-16">

        {/* Small Title */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-700 text-xs sm:text-sm font-semibold">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
            <span>Campus Resource Booking System</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
          Welcome to the Centralized
          <br />

          <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
            Campus Facility Portal
          </span>
        </h1>

        {/* Description */}
        <p className="text-center text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
          A centralized, organized platform for students, faculty, and
          administrators to reserve classrooms, high-tech computer labs,
          seminar halls, sports facilities, and equipment with real-time
          conflict checks and approval tracking.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <span>Sign In to Your Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 flex items-center justify-center hover:-translate-y-0.5"
          >
            Create New Account
          </Link>

        </div>

      </div>
    </div>
  );
}