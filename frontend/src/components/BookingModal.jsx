import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Building,
  Loader2,
} from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({
  resource,
  isOpen,
  onClose,
  onBookingSuccess,
}) {
  const { user } = useAuth();

  const getTomorrowDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [date, setDate] = useState(getTomorrowDateStr());

  // Backend values remain in 24-hour HH:mm format
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');

  const [purpose, setPurpose] = useState('');
  const [expectedAttendees, setExpectedAttendees] = useState(30);

  const [checking, setChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --------------------------------------------------
  // Time helpers
  // --------------------------------------------------

  const formatTime12Hour = (time24) => {
    if (!time24) return '';

    const [hourString, minute] = time24.split(':');
    let hour = parseInt(hourString, 10);

    const period = hour >= 12 ? 'PM' : 'AM';

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    return `${String(hour).padStart(2, '0')}:${minute} ${period}`;
  };

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

  const updateStartTime = (part, value) => {
    const current = getTimeParts(startTime);

    const updated = {
      ...current,
      [part]: value,
    };

    setStartTime(
      convertTo24Hour(
        updated.hour,
        updated.minute,
        updated.period
      )
    );
  };

  const updateEndTime = (part, value) => {
    const current = getTimeParts(endTime);

    const updated = {
      ...current,
      [part]: value,
    };

    setEndTime(
      convertTo24Hour(
        updated.hour,
        updated.minute,
        updated.period
      )
    );
  };

  const timeOptions = [];

  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      timeOptions.push({
        hour: String(hour).padStart(2, '0'),
        minute: String(minute).padStart(2, '0'),
      });
    }
  }

  // --------------------------------------------------
  // Check availability
  // --------------------------------------------------

  useEffect(() => {
    if (!isOpen || !resource || !date || !startTime || !endTime) {
      return;
    }

    if (startTime >= endTime) {
      setAvailabilityStatus({
        available: false,
        message: 'End time must be after start time',
      });
      return;
    }

    const checkSlot = async () => {
      setChecking(true);

      try {
        const res = await api.post(
          `/resources/${resource._id}/check-availability`,
          {
            date,
            startTime,
            endTime,
          }
        );

        setAvailabilityStatus(res.data);
      } catch (err) {
        setAvailabilityStatus({
          available: false,
          message: 'Unable to verify slot availability',
        });
      } finally {
        setChecking(false);
      }
    };

    const timer = setTimeout(checkSlot, 300);

    return () => clearTimeout(timer);
  }, [isOpen, resource, date, startTime, endTime]);

  if (!isOpen || !resource) {
    return null;
  }

  // --------------------------------------------------
  // Submit booking
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErrorMsg('Please log in first to submit a booking request.');
      return;
    }

    if (availabilityStatus && !availabilityStatus.available) {
      setErrorMsg(
        availabilityStatus.message ||
          'Selected slot is not available.'
      );
      return;
    }

    if (Number(expectedAttendees) > resource.capacity) {
      setErrorMsg(
        `Expected attendees (${expectedAttendees}) exceeds resource capacity (${resource.capacity})!`
      );
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const res = await api.post('/bookings', {
        resourceId: resource._id,
        date,
        startTime,
        endTime,
        purpose,
        expectedAttendees: Number(expectedAttendees),
      });

      if (res.data.success) {
        onBookingSuccess(res.data.booking);
        onClose();
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          'Failed to submit booking request.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startParts = getTimeParts(startTime);
  const endParts = getTimeParts(endTime);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">

        {/* HEADER */}
        <div className="relative p-6 bg-slate-900 text-white">

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building className="w-3.5 h-3.5" />
            {resource.type.replace('_', ' ')}
          </div>

          <h2 className="text-xl font-bold text-white">
            {resource.name}
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Room Code:{' '}
            <span className="font-mono text-slate-200">
              {resource.code}
            </span>
            {' • '}
            Max Capacity: {resource.capacity} people
          </p>

        </div>


        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* ERROR */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}


          {/* DATE */}
          <div>

            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              Reservation Date
            </label>

            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>


          {/* START + END TIME */}
          <div className="grid grid-cols-2 gap-3">

            {/* START TIME */}
            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Start Time
              </label>

              <div className="flex gap-1.5">

                <select
                  value={startParts.hour}
                  onChange={(e) =>
                    updateStartTime('hour', e.target.value)
                  }
                  className="flex-1 px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                <select
                  value={startParts.minute}
                  onChange={(e) =>
                    updateStartTime('minute', e.target.value)
                  }
                  className="px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {['00', '15', '30', '45'].map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>

                <select
                  value={startParts.period}
                  onChange={(e) =>
                    updateStartTime('period', e.target.value)
                  }
                  className="px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>

              </div>

            </div>


            {/* END TIME */}
            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                End Time
              </label>

              <div className="flex gap-1.5">

                <select
                  value={endParts.hour}
                  onChange={(e) =>
                    updateEndTime('hour', e.target.value)
                  }
                  className="flex-1 px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                <select
                  value={endParts.minute}
                  onChange={(e) =>
                    updateEndTime('minute', e.target.value)
                  }
                  className="px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {['00', '15', '30', '45'].map((minute) => (
                    <option key={minute} value={minute}>
                      {minute}
                    </option>
                  ))}
                </select>

                <select
                  value={endParts.period}
                  onChange={(e) =>
                    updateEndTime('period', e.target.value)
                  }
                  className="px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>

              </div>

            </div>

          </div>


          {/* AVAILABILITY */}
          <div className="p-3 rounded-xl border transition text-xs font-medium flex items-center justify-between">

            {checking ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Checking slot availability...</span>
              </div>
            ) : availabilityStatus?.available ? (
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Slot is available! No scheduling conflict.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {availabilityStatus?.message ||
                    'Slot is unavailable'}
                </span>
              </div>
            )}

            <span className="text-[11px] text-slate-400">
              Hours:{' '}
              {formatTime12Hour(
                resource.operationalHours?.start || '08:00'
              )}{' '}
              -{' '}
              {formatTime12Hour(
                resource.operationalHours?.end || '20:00'
              )}
            </span>

          </div>


          {/* EXPECTED ATTENDEES */}
          <div>

            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Expected Attendees
            </label>

            <input
              type="number"
              min="1"
              max={resource.capacity}
              value={expectedAttendees}
              onChange={(e) =>
                setExpectedAttendees(e.target.value)
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <span className="text-[11px] text-slate-400 mt-1 block">
              Facility maximum limit is {resource.capacity} attendees.
            </span>

          </div>


          {/* PURPOSE */}
          <div>

            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Purpose / Event Details
            </label>

            <textarea
              required
              rows={3}
              placeholder="e.g. ACM Club competitive coding round 1; or Guest lecture by industry expert"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>


          {/* BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                (availabilityStatus &&
                  !availabilityStatus.available)
              }
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {submitting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}

              Submit Request
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}