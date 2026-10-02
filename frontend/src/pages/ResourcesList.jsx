import React, { useState, useEffect } from 'react';

import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Building,
  GraduationCap,
  Monitor,
  Trophy,
  Package,
  Layers,
  CalendarPlus,
  Eye,
  Check,
  ChevronRight,
} from 'lucide-react';

import api from '../services/api';
import BookingModal from '../components/BookingModal';
import ResourceScheduleModal from '../components/ResourceScheduleModal';


// ============================================================
// CATEGORIES
// ============================================================

const CATEGORIES = [
  {
    id: 'all',
    label: 'All Facilities',
    icon: Layers,
  },
  {
    id: 'classroom',
    label: 'Classrooms',
    icon: GraduationCap,
  },
  {
    id: 'lab',
    label: 'Computer Labs',
    icon: Monitor,
  },
  {
    id: 'seminar_hall',
    label: 'Seminar Halls',
    icon: Building,
  },
  {
    id: 'sports',
    label: 'Sports Grounds',
    icon: Trophy,
  },
  {
    id: 'equipment',
    label: 'Equipment',
    icon: Package,
  },
];


// ============================================================
// TIME HELPERS
// ============================================================

// Convert 24-hour time into 12-hour parts
// Example:
// 00:00 -> 12:00 AM
// 10:30 -> 10:30 AM
// 14:30 -> 02:30 PM
// 23:45 -> 11:45 PM
const getTimeParts = (time24) => {
  const [hourString, minute] = time24.split(':');

  let hour = parseInt(hourString, 10);

  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }

  return {
    hour: String(hour).padStart(2, '0'),
    minute,
    period,
  };
};


// Convert 12-hour time into 24-hour time
// Example:
// 12:00 AM -> 00:00
// 10:30 AM -> 10:30
// 02:30 PM -> 14:30
// 11:45 PM -> 23:45
const convertTo24Hour = (hour, minute, period) => {
  let hour24 = parseInt(hour, 10);

  if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }

  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  }

  return `${String(hour24).padStart(2, '0')}:${minute}`;
};


// Format 24-hour time for displaying to the user
// Example:
// 10:00 -> 10:00 AM
// 14:30 -> 02:30 PM
const formatTime12Hour = (time24) => {
  if (!time24) return '';

  const { hour, minute, period } = getTimeParts(time24);

  return `${hour}:${minute} ${period}`;
};


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ResourcesList() {

  // ============================================================
  // RESOURCE STATES
  // ============================================================

  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('all');


  // ============================================================
  // SLOT AVAILABILITY FILTER STATE
  // ============================================================

  const [checkSlotActive, setCheckSlotActive] = useState(false);

  const [filterDate, setFilterDate] = useState(
    new Date(Date.now() + 86400000)
      .toISOString()
      .split('T')[0]
  );

  // IMPORTANT:
  // Keep these internally in 24-hour format.
  // UI will display them in 12-hour format.
  const [filterStartTime, setFilterStartTime] = useState('10:00');

  const [filterEndTime, setFilterEndTime] = useState('12:00');


  // Convert current internal times into 12-hour values
  const startParts = getTimeParts(filterStartTime);

  const endParts = getTimeParts(filterEndTime);


  // ============================================================
  // MODAL STATES
  // ============================================================

  const [selectedResourceForBooking, setSelectedResourceForBooking] =
    useState(null);

  const [selectedResourceForSchedule, setSelectedResourceForSchedule] =
    useState(null);

  const [toastMessage, setToastMessage] = useState('');


  // ============================================================
  // FETCH RESOURCES
  // ============================================================

  const fetchResources = async () => {

    setLoading(true);

    try {

      let url =
        `/resources?search=${encodeURIComponent(search)}&type=${selectedCategory}`;

      // Add availability filter only when active
      if (
        checkSlotActive &&
        filterDate &&
        filterStartTime &&
        filterEndTime
      ) {
        url +=
          `&date=${filterDate}` +
          `&startTime=${filterStartTime}` +
          `&endTime=${filterEndTime}`;
      }

      const res = await api.get(url);

      setResources(res.data.resources || []);

    } catch (err) {

      console.error('Failed to load resources:', err);

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // FETCH WHEN FILTERS CHANGE
  // ============================================================

  useEffect(() => {

    const timer = setTimeout(fetchResources, 250);

    return () => clearTimeout(timer);

  }, [
    search,
    selectedCategory,
    checkSlotActive,
    filterDate,
    filterStartTime,
    filterEndTime,
  ]);


  // ============================================================
  // BOOKING SUCCESS
  // ============================================================

  const handleBookingSuccess = (booking) => {

    setToastMessage(
      `Booking submitted successfully! Booking ID: #${booking._id
        .slice(-6)
        .toUpperCase()}`
    );

    setTimeout(() => {
      setToastMessage('');
    }, 5000);

    fetchResources();
  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* ======================================================
          TOAST NOTIFICATION
      ====================================================== */}

      {toastMessage && (

        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-in fade-in">

          <CheckCircle2 className="w-4 h-4 shrink-0" />

          <span>{toastMessage}</span>

        </div>

      )}


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">

            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>

            Campus Resource Booking System

          </div>

          <h1 className="text-2xl font-bold text-slate-800">

            Available Campus Facilities

          </h1>

          <p className="text-xs text-slate-500 mt-0.5">

            Search classrooms, labs, halls, sports grounds, and equipment
            with live slot availability.

          </p>

        </div>


        {/* Statistics */}

        <div className="flex items-center gap-2 shrink-0">

          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-center">

            <span className="block text-lg font-bold text-slate-800">

              {resources.length}

            </span>

            <span className="text-[10px] text-slate-500 font-medium uppercase">

              Total Listed

            </span>

          </div>


          <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5 text-center">

            <span className="block text-lg font-bold text-indigo-600">

              Free

            </span>

            <span className="text-[10px] text-indigo-600 font-medium uppercase">

              Conflict Check

            </span>

          </div>

        </div>

      </div>


      {/* ======================================================
          SEARCH AND FILTERS
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-xs space-y-4">

        {/* SEARCH + CHECK BUTTON */}

        <div className="flex flex-col sm:flex-row gap-3">

          {/* Search Bar */}

          <div className="relative flex-1">

            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search by facility name, room number, or equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

          </div>


          {/* Check By Date & Time */}

          <button
            onClick={() => setCheckSlotActive(!checkSlotActive)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition flex items-center justify-center gap-1.5 ${
              checkSlotActive
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >

            <Clock className="w-3.5 h-3.5" />

            <span>
              {checkSlotActive
                ? 'Slot Filter Active'
                : 'Check by Date & Time'}
            </span>

          </button>

        </div>


        {/* ====================================================
            SLOT AVAILABILITY FILTER
        ==================================================== */}

        {checkSlotActive && (

          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex flex-wrap items-center gap-3 text-xs">

            {/* DATE */}

            <div className="flex items-center gap-1.5">

              <span className="font-semibold text-slate-700">
                Date:
              </span>

              <input
                type="date"
                value={filterDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium"
              />

            </div>


            {/* ==================================================
                START + END TIME
            ================================================== */}

            <div className="flex items-center gap-1.5">

              <span className="font-semibold text-slate-700">
                Time:
              </span>


              {/* ================================================
                  START TIME
              ================================================ */}

              <div className="flex items-center gap-1">

                {/* Hour */}

                <select
                  value={startParts.hour}
                  onChange={(e) =>
                    setFilterStartTime(
                      convertTo24Hour(
                        e.target.value,
                        startParts.minute,
                        startParts.period
                      )
                    )
                  }
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >

                  {Array.from({ length: 12 }, (_, i) => {

                    const hour = String(i + 1).padStart(2, '0');

                    return (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    );

                  })}

                </select>


                <span className="font-semibold text-slate-500">
                  :
                </span>


                {/* Minutes */}

                <select
                  value={startParts.minute}
                  onChange={(e) =>
                    setFilterStartTime(
                      convertTo24Hour(
                        startParts.hour,
                        e.target.value,
                        startParts.period
                      )
                    )
                  }
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >

                  {['00', '15', '30', '45'].map((minute) => (

                    <option key={minute} value={minute}>
                      {minute}
                    </option>

                  ))}

                </select>


                {/* AM / PM */}

                <select
                  value={startParts.period}
                  onChange={(e) =>
                    setFilterStartTime(
                      convertTo24Hour(
                        startParts.hour,
                        startParts.minute,
                        e.target.value
                      )
                    )
                  }
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >

                  <option value="AM">AM</option>

                  <option value="PM">PM</option>

                </select>

              </div>


              {/* TO */}

              <span className="text-slate-400 mx-1">
                to
              </span>


              {/* ================================================
                  END TIME
              ================================================ */}

              <div className="flex items-center gap-1">

                {/* Hour */}

                <select
                  value={endParts.hour}
                  onChange={(e) =>
                    setFilterEndTime(
                      convertTo24Hour(
                        e.target.value,
                        endParts.minute,
                        endParts.period
                      )
                    )
                  }
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >

                  {Array.from({ length: 12 }, (_, i) => {

                    const hour = String(i + 1).padStart(2, '0');

                    return (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    );

                  })}

                </select>


                <span className="font-semibold text-slate-500">
                  :
                </span>


                {/* Minutes */}

                <select
                  value={endParts.minute}
                  onChange={(e) =>
                    setFilterEndTime(
                      convertTo24Hour(
                        endParts.hour,
                        e.target.value,
                        endParts.period
                      )
                    )
                  }
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >

                  {['00', '15', '30', '45'].map((minute) => (

                    <option key={minute} value={minute}>
                      {minute}
                    </option>

                  ))}

                </select>


                {/* AM / PM */}

                <select
                  value={endParts.period}
                  onChange={(e) =>
                    setFilterEndTime(
                      convertTo24Hour(
                        endParts.hour,
                        endParts.minute,
                        e.target.value
                      )
                    )
                  }
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >

                  <option value="AM">AM</option>

                  <option value="PM">PM</option>

                </select>

              </div>

            </div>


            {/* ==================================================
                AVAILABILITY TEXT
            ================================================== */}

            <span className="text-indigo-700 font-medium ml-auto">

              Checking availability for {filterDate}{' '}

              (
              {formatTime12Hour(filterStartTime)}
              {' - '}
              {formatTime12Hour(filterEndTime)}
              )

            </span>

          </div>

        )}


        {/* ====================================================
            CATEGORY PILLS
        ==================================================== */}

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">

          {CATEGORIES.map((cat) => {

            const Icon = cat.icon;

            const isSelected =
              selectedCategory === cat.id;

            return (

              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(cat.id)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >

                <Icon className="w-3.5 h-3.5" />

                {cat.label}

              </button>

            );

          })}

        </div>

      </div>


      {/* ======================================================
          FACILITIES GRID
      ====================================================== */}

      {loading ? (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {[1, 2, 3, 4, 5, 6].map((i) => (

            <div
              key={i}
              className="bg-white rounded-2xl h-56 animate-pulse border border-slate-200"
            ></div>

          ))}

        </div>

      ) : resources.length === 0 ? (

        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">

          <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />

          <h3 className="text-sm font-bold text-slate-700">

            No facilities found

          </h3>

          <p className="text-xs text-slate-400 mt-0.5">

            Try searching with a different keyword or category.

          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {resources.map((res) => (

            <div
              key={res._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between"
            >

              <div>

                {/* ==================================================
                    HEADER BANNER
                ================================================== */}

                <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-start justify-between gap-2">

                  <div>

                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-100 text-indigo-700 mb-1">

                      {res.type.replace('_', ' ')}

                    </span>

                    <h3 className="font-bold text-slate-900 text-base leading-tight">

                      {res.name}

                    </h3>

                  </div>


                  <span className="px-2 py-0.5 font-mono text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-md shrink-0">

                    {res.code}

                  </span>

                </div>


                {/* ==================================================
                    DETAILS BODY
                ================================================== */}

                <div className="p-4 space-y-2.5">

                  {/* LOCATION */}

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">

                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                    <span className="truncate">

                      {res.location}

                    </span>

                  </div>


                  {/* CAPACITY + OPERATIONAL HOURS */}

                  <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">

                    <span className="flex items-center gap-1 font-medium">

                      <Users className="w-3.5 h-3.5 text-indigo-600" />

                      Capacity:{' '}

                      <strong>
                        {res.capacity} seats
                      </strong>

                    </span>


                    <span className="flex items-center gap-1 text-[11px] text-slate-500">

                      <Clock className="w-3 h-3 text-slate-400" />

                      {res.operationalHours?.start || '08:00'}

                      {' - '}

                      {res.operationalHours?.end || '20:00'}

                    </span>

                  </div>


                  {/* ==================================================
                      SLOT STATUS
                  ================================================== */}

                  {checkSlotActive && (

                    <div className="pt-1">

                      {res.isAvailable ? (

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-full justify-center">

                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />

                          Available for selected slot

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 w-full justify-center">

                          <XCircle className="w-3.5 h-3.5 text-rose-600" />

                          Occupied / Slot Conflict

                        </span>

                      )}

                    </div>

                  )}


                  {/* ==================================================
                      AMENITIES
                  ================================================== */}

                  {res.amenities &&
                    res.amenities.length > 0 && (

                      <div className="flex flex-wrap gap-1 pt-1">

                        {res.amenities
                          .slice(0, 3)
                          .map((item, idx) => (

                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600"
                            >

                              {item}

                            </span>

                          ))}


                        {res.amenities.length > 3 && (

                          <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">

                            +{res.amenities.length - 3}

                          </span>

                        )}

                      </div>

                    )}

                </div>

              </div>


              {/* ==================================================
                  ACTION BUTTONS
              ================================================== */}

              <div className="p-3 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-2">

                {/* TIMINGS */}

                <button
                  onClick={() =>
                    setSelectedResourceForSchedule(res)
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition flex items-center justify-center gap-1"
                >

                  <Eye className="w-3.5 h-3.5 text-slate-400" />

                  Timings

                </button>


                {/* BOOK NOW */}

                <button
                  disabled={res.status !== 'active'}
                  onClick={() =>
                    setSelectedResourceForBooking(res)
                  }
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-1 shadow-xs"
                >

                  <CalendarPlus className="w-3.5 h-3.5" />

                  Book Now

                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ======================================================
          BOOKING FORM MODAL
      ====================================================== */}

      {selectedResourceForBooking && (

        <BookingModal
          resource={selectedResourceForBooking}
          isOpen={!!selectedResourceForBooking}
          onClose={() =>
            setSelectedResourceForBooking(null)
          }
          onBookingSuccess={handleBookingSuccess}
        />

      )}


      {/* ======================================================
          RESOURCE SCHEDULE TIMELINE MODAL
      ====================================================== */}

      {selectedResourceForSchedule && (

        <ResourceScheduleModal
          resource={selectedResourceForSchedule}
          isOpen={!!selectedResourceForSchedule}
          onClose={() =>
            setSelectedResourceForSchedule(null)
          }
          onOpenBooking={(resource) =>
            setSelectedResourceForBooking(resource)
          }
        />

      )}

    </div>

  );
}