import React, { useState, useEffect } from 'react';

import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ban,
  Search,
  ChevronRight,
  Users,
  Loader2,
} from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


// ============================================================
// MY BOOKINGS
// ============================================================

export default function MyBookings() {

  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('all');

  const [searchTerm, setSearchTerm] = useState('');

  const [cancellingId, setCancellingId] = useState(null);

  const [alertNotice, setAlertNotice] = useState('');


  // ============================================================
  // FETCH BOOKINGS
  // ============================================================

  const fetchBookings = async () => {

    setLoading(true);

    try {

      const res = await api.get(
        `/bookings/my?status=${statusFilter}`
      );

      setBookings(res.data.bookings || []);

    } catch (err) {

      console.error('Failed to load bookings:', err);

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // FETCH WHEN STATUS FILTER CHANGES
  // ============================================================

  useEffect(() => {

    fetchBookings();

  }, [statusFilter]);


  // ============================================================
  // CANCEL BOOKING
  // ============================================================

  const handleCancel = async (bookingId) => {

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking request?'
    );

    if (!confirmed) return;

    try {

      setCancellingId(bookingId);

      await api.put(`/bookings/${bookingId}/cancel`);

      setAlertNotice(
        'Booking reservation cancelled successfully.'
      );

      setTimeout(() => {
        setAlertNotice('');
      }, 4000);

      fetchBookings();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        'Failed to cancel booking'
      );

    } finally {

      setCancellingId(null);

    }
  };


  // ============================================================
  // SEARCH FILTER
  // ============================================================

  const filteredBookings = bookings.filter((b) => {

    const resourceName =
      b.resource?.name?.toLowerCase() || '';

    const purpose =
      b.purpose?.toLowerCase() || '';

    const term =
      searchTerm.toLowerCase();

    return (
      resourceName.includes(term) ||
      purpose.includes(term)
    );

  });


  // ============================================================
  // STATUS BADGE
  // ============================================================

  const getStatusBadge = (status) => {

    switch (status) {

      case 'approved':

        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">

            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />

            Approved

          </span>
        );


      case 'rejected':

        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">

            <XCircle className="w-3.5 h-3.5 text-rose-600" />

            Rejected

          </span>
        );


      case 'cancelled':

        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">

            <Ban className="w-3.5 h-3.5 text-slate-500" />

            Cancelled

          </span>
        );


      default:

        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">

            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />

            Pending Approval

          </span>
        );

    }

  };


  // ============================================================
  // NOT LOGGED IN
  // ============================================================

  if (!user) {

    return (

      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-md border border-slate-200 text-center">

        <AlertCircle className="w-12 h-12 text-indigo-500 mx-auto mb-3" />

        <h2 className="text-xl font-bold text-slate-800">

          Please Sign In

        </h2>

        <p className="text-xs text-slate-500 mt-2 mb-6">

          You must be logged in as a student or faculty to view your booking history.

        </p>

        <Link
          to="/login"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl"
        >

          Sign In Now

        </Link>

      </div>

    );

  }


  // ============================================================
  // MAIN UI
  // ============================================================

  return (

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

        <div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">

            My Reservation History

          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">

            Track real-time status of your facility bookings, administrator reviews, and past events.

          </p>

        </div>


        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 w-fit"
        >

          <span>
            Book Another Facility
          </span>

          <ChevronRight className="w-3.5 h-3.5" />

        </Link>

      </div>


      {/* ======================================================
          SUCCESS ALERT
      ====================================================== */}

      {alertNotice && (

        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">

          <CheckCircle2 className="w-4 h-4 text-emerald-600" />

          <span>
            {alertNotice}
          </span>

        </div>

      )}


      {/* ======================================================
          FILTER AND SEARCH
      ====================================================== */}

      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">


        {/* STATUS PILLS */}

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">

          {[
            'all',
            'pending',
            'approved',
            'rejected',
            'cancelled',
          ].map((st) => (

            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >

              {st}

            </button>

          ))}

        </div>


        {/* SEARCH */}

        <div className="relative w-full sm:w-64">

          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />

          <input
            type="text"
            placeholder="Search by facility or purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

        </div>

      </div>


      {/* ======================================================
          BOOKINGS LIST
      ====================================================== */}

      {loading ? (

        <div className="space-y-4">

          {[1, 2, 3].map((i) => (

            <div
              key={i}
              className="bg-white rounded-2xl h-36 animate-pulse border border-slate-200 p-4"
            ></div>

          ))}

        </div>

      ) : filteredBookings.length === 0 ? (

        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">

          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />

          <h3 className="text-base font-bold text-slate-700">

            No reservations found

          </h3>

          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-5">

            You don't have any bookings matching this filter. Explore campus facilities and make a reservation!

          </p>

          <Link
            to="/"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs"
          >

            Explore Facilities

          </Link>

        </div>

      ) : (

        <div className="space-y-4">

          {filteredBookings.map((b) => (

            <div
              key={b._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
            >


              {/* ==================================================
                  LEFT COLUMN
              ================================================== */}

              <div className="flex gap-4 items-start">


                {/* RESOURCE IMAGE */}

                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 shrink-0 overflow-hidden hidden sm:block">

                  <img
                    src={
                      b.resource?.image ||
                      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={b.resource?.name}
                    className="w-full h-full object-cover"
                  />

                </div>


                {/* BOOKING DETAILS */}

                <div>

                  {/* RESOURCE NAME */}

                  <div className="flex items-center gap-2 mb-1">

                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">

                      {b.resource?.code || 'FACILITY'}

                    </span>

                    <h3 className="font-bold text-base text-slate-900">

                      {b.resource?.name}

                    </h3>

                  </div>


                  {/* DATE / TIME / LOCATION / ATTENDEES */}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">


                    {/* DATE */}

                    <span className="flex items-center gap-1 font-semibold text-slate-700">

                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />

                      {b.date}

                    </span>


                    {/* TIME */}

                    <span className="flex items-center gap-1 font-semibold text-slate-700">

                      <Clock className="w-3.5 h-3.5 text-indigo-500" />

                      {b.startTime} - {b.endTime}

                    </span>


                    {/* LOCATION */}

                    <span className="flex items-center gap-1">

                      <MapPin className="w-3.5 h-3.5 text-slate-400" />

                      {b.resource?.location}

                    </span>


                    {/* ATTENDEES */}

                    <span className="flex items-center gap-1">

                      <Users className="w-3.5 h-3.5 text-slate-400" />

                      {b.expectedAttendees} Attendees

                    </span>

                  </div>


                  {/* PURPOSE */}

                  <div className="mt-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">

                    <span className="font-semibold text-slate-700">

                      Purpose:{' '}

                    </span>

                    {b.purpose}

                  </div>


                  {/* ADMIN REMARK */}

                  {b.adminRemarks && (

                    <div className="mt-2 text-xs bg-indigo-50/70 p-2 rounded-xl text-indigo-900 border border-indigo-100">

                      <span className="font-bold">

                        Admin Remark:{' '}

                      </span>

                      {b.adminRemarks}

                    </div>

                  )}

                </div>

              </div>


              {/* ==================================================
                  RIGHT COLUMN
              ================================================== */}

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">


                {/* STATUS */}

                {getStatusBadge(b.status)}


                {/* ==================================================
                    ATTRACTIVE CANCEL BUTTON
                ================================================== */}

                {(b.status === 'pending' ||
                  b.status === 'approved') && (

                  <button
                    onClick={() => handleCancel(b._id)}
                    disabled={cancellingId === b._id}
                    className="group inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-white border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >

                    {cancellingId === b._id ? (

                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />

                        <span>
                          Cancelling...
                        </span>
                      </>

                    ) : (

                      <>
                        <XCircle className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />

                        <span>
                          Cancel Booking
                        </span>
                      </>

                    )}

                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}