import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Building2,
  Sparkles,
  CalendarPlus,
} from 'lucide-react';
import api from '../services/api';

export default function ResourceScheduleModal({
  resource,
  isOpen,
  onClose,
  onOpenBooking,
}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !resource) return;

    const fetchDaySchedule = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/resources/${resource._id}?date=${date}`);
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDaySchedule();
  }, [isOpen, resource, date]);

  if (!isOpen || !resource) return null;

  // Standard operational hours
  const startHour = 8;
  const endHour = 20;
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

  const isSlotBooked = (hour) => {
    const slotStartMin = hour * 60;
    const slotEndMin = (hour + 1) * 60;

    return bookings.find((b) => {
      const [sh, sm] = b.startTime.split(':').map(Number);
      const [eh, em] = b.endTime.split(':').map(Number);
      const bStart = sh * 60 + sm;
      const bEnd = eh * 60 + em;
      return Math.max(slotStartMin, bStart) < Math.min(slotEndMin, bEnd);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Banner with Image */}
        <div className="relative h-48 sm:h-56 bg-slate-800">
          <img
            src={
              resource.image ||
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
            }
            alt={resource.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/80 text-white mb-2">
              {resource.type.replace('_', ' ')}
            </span>
            <h2 className="text-2xl font-bold">{resource.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                {resource.code}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {resource.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                Capacity: {resource.capacity} seats
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amenities & Description */}
          {resource.description && (
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {resource.description}
            </p>
          )}

          {resource.amenities && resource.amenities.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Available Amenities & Features
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {resource.amenities.map((a, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Date Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Daily Availability Timeline</h3>
              <p className="text-xs text-slate-500">
                Visual slot tracker showing booked and available hours
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          {/* Hourly Visual Slot Map */}
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading schedule...</div>
          ) : (
            <div className="space-y-2 mb-6 max-h-56 overflow-y-auto pr-1">
              {hours.map((h) => {
                const booking = isSlotBooked(h);
                const timeLabel = `${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`;

                return (
                  <div
                    key={h}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition ${
                      booking
                        ? 'bg-rose-50/70 border-rose-200 text-rose-800'
                        : 'bg-emerald-50/60 border-emerald-200 text-emerald-800 hover:bg-emerald-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 opacity-60" />
                      <span className="font-semibold font-mono">{timeLabel}</span>
                    </div>

                    {booking ? (
                      <div className="flex items-center gap-2 text-right">
                        <span className="text-[11px] font-medium text-rose-600 truncate max-w-[180px] sm:max-w-[240px]">
                          Booked: {booking.purpose} ({booking.status})
                        </span>
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <span>Available</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {bookings.length} reservations scheduled for this day
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBooking(resource);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
              >
                <CalendarPlus className="w-4 h-4" />
                Book Resource
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
