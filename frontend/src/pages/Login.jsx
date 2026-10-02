import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login(email, password);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl">

        <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-slate-300/40 border border-slate-200 overflow-hidden">

          {/* =====================================
              LEFT SIDE - BRANDING
          ====================================== */}
          <div className="hidden lg:flex relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-12 text-white flex-col justify-between overflow-hidden">

            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
            <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-white/10 rounded-full" />

            <div className="relative z-10">

              {/* Logo */}
              <div className="flex items-center gap-3 mb-12">
                <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CalendarDays className="w-6 h-6" />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    CampusReserve
                  </h2>

                  <p className="text-xs text-indigo-100">
                    Campus Facility Portal
                  </p>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-4xl font-extrabold leading-tight mb-5">
                Manage your
                <br />
                campus resources
                <br />
                <span className="text-indigo-200">
                  with ease.
                </span>
              </h2>

              <p className="text-sm text-indigo-100 leading-relaxed max-w-sm">
                Reserve classrooms, computer labs, seminar
                halls, sports facilities, and equipment through
                one centralized campus platform.
              </p>

            </div>

            {/* Bottom Info */}
            <div className="relative z-10">

              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Secure Campus Access
                  </p>

                  <p className="text-xs text-indigo-200">
                    Your account is protected
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/15 mb-4" />

              <p className="text-xs text-indigo-200">
                Centralized • Organized • Efficient
              </p>

            </div>
          </div>


          {/* =====================================
              RIGHT SIDE - LOGIN
          ====================================== */}
          <div className="p-7 sm:p-10 lg:p-12">

            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-7">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
                <CalendarDays className="w-7 h-7" />
              </div>
            </div>


            {/* Header */}
            <div className="mb-8">

              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                Welcome Back
              </p>

              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign in to your account
              </h1>

              <p className="text-sm text-slate-500 mt-2">
                Enter your campus credentials to continue.
              </p>

            </div>


            {/* Error Message */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs font-bold mb-0.5">
                    Sign in failed
                  </p>

                  <p className="text-xs leading-relaxed">
                    {errorMsg}
                  </p>
                </div>

              </div>
            )}


            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Campus Email Address
                </label>

                <div className="relative">

                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                </div>

              </div>


              {/* Password */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>

                </div>

                <div className="relative">

                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full h-12 pl-11 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>

              </div>


              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >

                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}

              </button>

            </form>


            {/* Divider */}
            <div className="flex items-center gap-3 my-7">

              <div className="flex-1 h-px bg-slate-200" />

              <span className="text-xs text-slate-400">
                New to CampusReserve?
              </span>

              <div className="flex-1 h-px bg-slate-200" />

            </div>


            {/* Register */}
            <Link
              to="/register"
              className="w-full h-11 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 font-semibold rounded-xl transition flex items-center justify-center text-sm"
            >
              Create a New Account
            </Link>


            {/* Footer */}
            <p className="text-center text-[11px] text-slate-400 mt-7">
              Campus Resource Booking System
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}