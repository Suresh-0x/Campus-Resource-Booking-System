import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  CalendarDays,
  User,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Briefcase,
  GraduationCap,
  AlertCircle,
  Loader2,
  Building,
  Hash,
  Eye,
  EyeOff,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    rollNoOrId: '',
    department: 'Computer Science & Engineering',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await register(formData);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          'Registration failed. Please check your fields.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 via-indigo-50/40 to-purple-50/30 flex items-center justify-center px-4 py-3 relative overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-4xl">

        <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl shadow-slate-300/40 border border-slate-200 overflow-hidden">

          {/* =====================================
              LEFT SIDE
          ====================================== */}
          <div className="hidden lg:flex relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 text-white flex-col justify-between overflow-hidden">

            {/* Decorative Circles */}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-white/10 rounded-full" />

            <div className="absolute -bottom-20 -left-16 w-60 h-60 bg-white/10 rounded-full" />

            <div className="relative z-10">

              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">

                <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    CampusReserve
                  </h2>

                  <p className="text-[11px] text-indigo-100">
                    Campus Facility Portal
                  </p>
                </div>

              </div>

              {/* Heading */}
              <h2 className="text-3xl font-extrabold leading-tight mb-4">
                Create your
                <br />
                campus account
                <br />
                <span className="text-indigo-200">
                  today.
                </span>
              </h2>

              <p className="text-xs text-indigo-100 leading-relaxed max-w-sm">
                Register with your campus role and get access
                to classrooms, computer labs, seminar halls,
                sports facilities, and equipment.
              </p>

            </div>

            {/* Bottom Information */}
            <div className="relative z-10">

              <div className="flex items-center gap-3 mb-3">

                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Campus Access
                  </p>

                  <p className="text-[10px] text-indigo-200">
                    Register according to your role
                  </p>
                </div>

              </div>

              <div className="h-px bg-white/15 mb-3" />

              <p className="text-[10px] text-indigo-200">
                Centralized • Organized • Efficient
              </p>

            </div>

          </div>


          {/* =====================================
              RIGHT SIDE
          ====================================== */}
          <div className="p-6 sm:p-7 lg:p-8">

            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-4">

              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
                <CalendarDays className="w-6 h-6" />
              </div>

            </div>


            {/* Header */}
            <div className="mb-4">

              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
                Get Started
              </p>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Create Campus Account
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                Sign up with your campus role to reserve facilities.
              </p>

            </div>


            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2">

                <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>

                <div>
                  <p className="text-[11px] font-bold mb-0.5">
                    Registration failed
                  </p>

                  <p className="text-[11px] leading-relaxed">
                    {errorMsg}
                  </p>
                </div>

              </div>
            )}


            {/* Form */}
            <form
              onSubmit={handleRegister}
              className="space-y-3"
            >

              {/* ROLE SELECTOR */}
              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Your Role
                </label>

                <div className="grid grid-cols-3 gap-2">

                  {[
                    {
                      id: 'student',
                      label: 'Student',
                      icon: GraduationCap,
                    },
                    {
                      id: 'faculty',
                      label: 'Faculty',
                      icon: Briefcase,
                    },
                    {
                      id: 'admin',
                      label: 'Admin',
                      icon: Shield,
                    },
                  ].map((r) => {

                    const Icon = r.icon;
                    const isSel = formData.role === r.id;

                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            role: r.id,
                          })
                        }
                        className={`h-14 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-0.5 ${
                          isSel
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-4 ring-indigo-500/10 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />

                        <span className="text-[11px] font-bold">
                          {r.label}
                        </span>
                      </button>
                    );
                  })}

                </div>

              </div>


              {/* FULL NAME */}
              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                  <input
                    type="text"
                    required
                    placeholder="e.g. J. Suresh"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full h-10 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                </div>

              </div>


              {/* CAMPUS EMAIL */}
              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Campus Email
                </label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                  <input
                    type="email"
                    required
                    placeholder="e.g. suresh@campus.edu"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full h-10 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                </div>

              </div>


              {/* ROLL NUMBER + DEPARTMENT */}
              <div className="grid grid-cols-2 gap-3">

                {/* Roll / ID */}
                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Roll / ID Number
                  </label>

                  <div className="relative">

                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />

                   <input
  type="text"
  required
  placeholder={
    formData.role === 'student'
      ? '24A81A0578'
      : formData.role === 'faculty'
      ? 'F101'
      : 'A101'
  }
          value={formData.rollNoOrId}
          onChange={(e) =>
            setFormData({
              ...formData,
              rollNoOrId: e.target.value,
            })
          }
          className="w-full h-10 pl-8 pr-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] uppercase font-mono text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />

                  </div>

                </div>


                {/* Department */}
                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Department
                  </label>

                  <div className="relative">

                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none z-10" />

                    <select
                      required
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          department: e.target.value,
                        })
                      }
                      className="w-full h-10 pl-8 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-900 outline-none appearance-none transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
                    >
                      <option value="Computer Science & Engineering">
                        CSE
                      </option>

                      <option value="Electronics & Communication Engineering">
                        ECE
                      </option>

                      <option value="Mechanical Engineering">
                        MECH
                      </option>

                      <option value="Electrical & Electronics Engineering">
                        EEE
                      </option>

                      <option value="Computer Applications & Artificial Intelligence">
                        CAI
                      </option>

                      <option value="Computer Science & Technology">
                        CST
                      </option>

                      <option value="Computer Science & Design">
                        CSD
                      </option>

                      <option value="Artificial Intelligence & Machine Learning">
                        AIML
                      </option>

                      <option value="Basic Sciences & Humanities">
                        BSH
                      </option>
                    </select>

                    {/* Dropdown Arrow */}
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">

                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>

                    </div>

                  </div>

                </div>

              </div>

  {/* PASSWORD */}
  <div>

    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
      Password
    </label>

    <div className="relative">

      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

      <input
        type={showPassword ? 'text' : 'password'}
        required
        placeholder="Minimum 6 characters"
        value={formData.password}
        onChange={(e) =>
          setFormData({
            ...formData,
            password: e.target.value,
          })
        }
        className="w-full h-10 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                {/* Show / Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

            </div>
              {/* CREATE ACCOUNT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:hover:translate-y-0 text-xs"
              >

                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}

              </button>

            </form>


            {/* Divider */}
            <div className="flex items-center gap-3 my-3">

              <div className="flex-1 h-px bg-slate-200" />

              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                Already registered?
              </span>

              <div className="flex-1 h-px bg-slate-200" />

            </div>


            {/* Sign In */}
            <Link
              to="/login"
              className="w-full h-10 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 font-semibold rounded-xl transition flex items-center justify-center text-xs"
            >
              Sign In to Your Account
            </Link>


            {/* Footer */}
            <p className="text-center text-[10px] text-slate-400 mt-3">
              Campus Resource Booking System
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}