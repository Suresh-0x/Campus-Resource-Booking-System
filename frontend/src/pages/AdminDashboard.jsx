import React, { useState, useEffect } from 'react';

import {
  CheckCircle,
  Clock,
  Building,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  Shield,
  Check,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('approvals');

  // ============================================================
  // DATA STATE
  // ============================================================

  const [pendingBookings, setPendingBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // APPROVE / REJECT STATE
  // ============================================================

  const [selectedBookingForAction, setSelectedBookingForAction] =
    useState(null);

  const [actionType, setActionType] = useState('approved');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  // ============================================================
  // RESOURCE FORM STATE
  // ============================================================

  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [resourceForm, setResourceForm] = useState({
    name: '',
    code: '',
    type: 'classroom',
    location: '',
    capacity: 50,
    amenities: '',
    description: '',
    image: '',
    status: 'active',
  });

  const [savingResource, setSavingResource] = useState(false);
  const [formError, setFormError] = useState('');

  // ============================================================
  // TOAST
  // ============================================================

  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast('');
    }, 4000);
  };

  // ============================================================
  // LOAD ADMIN DATA
  // ============================================================

  const loadData = async () => {
    setLoading(true);

    try {
      const [pendingRes, allBookingsRes, resourcesRes] =
        await Promise.all([
          api.get('/bookings?status=pending'),
          api.get('/bookings'),
          api.get('/resources?status=all'),
        ]);

      setPendingBookings(pendingRes.data.bookings || []);
      setAllBookings(allBookingsRes.data.bookings || []);
      setResources(resourcesRes.data.resources || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);

      showToast(
        err.response?.data?.message ||
          'Failed to load administrator data.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  // ============================================================
  // APPROVE / REJECT BOOKING
  // ============================================================

  const handleActionSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBookingForAction) return;

    try {
      setProcessingAction(true);

      await api.put(
        `/bookings/${selectedBookingForAction._id}/status`,
        {
          status: actionType,
          adminRemarks,
        }
      );

      showToast(
        `Booking #${selectedBookingForAction._id
          .slice(-6)
          .toUpperCase()} ${
          actionType === 'approved'
            ? 'Approved'
            : 'Rejected'
        } successfully!`
      );

      setSelectedBookingForAction(null);
      setAdminRemarks('');

      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Error updating booking status'
      );
    } finally {
      setProcessingAction(false);
    }
  };

  // ============================================================
  // OPEN ADD RESOURCE
  // ============================================================

  const handleOpenAddResource = () => {
    setEditingResource(null);

    setResourceForm({
      name: '',
      code: '',
      type: 'classroom',
      location: '',
      capacity: 50,
      amenities: '',
      description: '',
      image: '',
      status: 'active',
    });

    setFormError('');
    setResourceModalOpen(true);
  };

  // ============================================================
  // OPEN EDIT RESOURCE
  // ============================================================

  const handleOpenEditResource = (resource) => {
    setEditingResource(resource);

    setResourceForm({
      name: resource.name || '',
      code: resource.code || '',
      type: resource.type || 'classroom',
      location: resource.location || '',
      capacity: resource.capacity || 50,
      amenities: resource.amenities
        ? resource.amenities.join(', ')
        : '',
      description: resource.description || '',
      image: resource.image || '',
      status: resource.status || 'active',
    });

    setFormError('');
    setResourceModalOpen(true);
  };

  // ============================================================
  // SAVE RESOURCE
  // ============================================================

  const handleSaveResource = async (e) => {
    e.preventDefault();

    setFormError('');

    const amenitiesArray = resourceForm.amenities
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      ...resourceForm,
      capacity: Number(resourceForm.capacity),
      amenities: amenitiesArray,
    };

    try {
      setSavingResource(true);

      if (editingResource) {
        await api.put(
          `/resources/${editingResource._id}`,
          payload
        );

        showToast('Resource updated successfully.');
      } else {
        await api.post('/resources', payload);

        showToast(
          'New resource facility created successfully.'
        );
      }

      setResourceModalOpen(false);

      await loadData();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          'Failed to save resource.'
      );
    } finally {
      setSavingResource(false);
    }
  };

  // ============================================================
  // DELETE RESOURCE
  // ============================================================

  const handleDeleteResource = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/resources/${id}`);

      showToast('Resource deleted successfully.');

      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to delete resource.'
      );
    }
  };

  // ============================================================
  // NON-ADMIN PROTECTION
  // ============================================================

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-md border border-slate-200 text-center">
        <Shield className="w-12 h-12 text-rose-500 mx-auto mb-3" />

        <h2 className="text-xl font-bold text-slate-800">
          Admin Privileges Required
        </h2>

        <p className="text-xs text-slate-500 mt-2 mb-6">
          You must be logged in as an Administrator to access
          the approval queue and resource manager.
        </p>

        <Link
          to="/login"
          className="inline-flex px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
        >
          Sign In as Admin
        </Link>
      </div>
    );
  }

  // ============================================================
  // ADMIN DASHBOARD
  // ============================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ======================================================
          TOAST
      ====================================================== */}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-medium border border-slate-700">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />

          <span>{toast}</span>
        </div>
      )}

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            Administrator Control Center
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Resource Approvals & Facility Management
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review incoming reservation requests, resolve
            scheduling conflicts, and configure campus facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />
          </button>

          <button
            onClick={handleOpenAddResource}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add New Facility
          </button>

        </div>
      </div>

      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="flex flex-wrap border-b border-slate-200 mb-8 gap-6">

        {/* PENDING APPROVALS */}

        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 text-sm font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'approvals'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />

          Pending Approvals

          {pendingBookings.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
              {pendingBookings.length}
            </span>
          )}
        </button>

        {/* FACILITIES */}

        <button
          onClick={() => setActiveTab('resources')}
          className={`pb-3 text-sm font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'resources'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />

          Campus Facilities ({resources.length})
        </button>

        {/* ALL BOOKINGS */}

        <button
          onClick={() => setActiveTab('all_bookings')}
          className={`pb-3 text-sm font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'all_bookings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />

          Master Reservation Log ({allBookings.length})
        </button>

      </div>

      {/* ======================================================
          TAB 1 — PENDING APPROVALS
      ====================================================== */}

      {activeTab === 'approvals' && (
        <div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl h-36 animate-pulse border border-slate-200"
                />
              ))}
            </div>
          ) : pendingBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />

              <h3 className="text-base font-bold text-slate-800">
                All caught up!
              </h3>

              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                There are no pending booking requests awaiting
                administrative review at this moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {pendingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row gap-6 lg:items-center justify-between"
                >

                  <div className="flex-1">

                    {/* RESOURCE TITLE */}

                    <div className="flex flex-wrap items-center gap-2 mb-2">

                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {booking.resource?.code}
                      </span>

                      <h3 className="text-lg font-bold text-slate-900">
                        {booking.resource?.name}
                      </h3>

                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                        Pending Decision
                      </span>

                    </div>

                    {/* REQUESTER */}

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2">

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Requester
                        </span>

                        <strong className="text-slate-900">
                          {booking.user?.name}
                        </strong>{' '}
                        ({booking.user?.role})
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Roll / ID
                        </span>

                        <span className="font-mono">
                          {booking.user?.rollNoOrId}
                        </span>{' '}
                        ({booking.user?.department})
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">
                          Attendees
                        </span>

                        <span>
                          {booking.expectedAttendees} Expected
                        </span>
                      </div>

                    </div>

                    {/* DATE / TIME */}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-2">

                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {booking.date}
                      </span>

                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        {booking.startTime} - {booking.endTime}
                      </span>

                    </div>

                    {/* PURPOSE */}

                    <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                      <strong className="text-slate-800">
                        Purpose:{' '}
                      </strong>

                      {booking.purpose}
                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex sm:flex-col gap-2 shrink-0 justify-end">

                    <button
                      onClick={() => {
                        setSelectedBookingForAction(booking);
                        setActionType('approved');
                        setAdminRemarks(
                          'Approved. Keys/access arranged.'
                        );
                      }}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Approve Request
                    </button>

                    <button
                      onClick={() => {
                        setSelectedBookingForAction(booking);
                        setActionType('rejected');
                        setAdminRemarks(
                          'Requested slot conflicts with scheduled university exam.'
                        );
                      }}
                      className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4" />
                      Reject Request
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      )}

      {/* ======================================================
          TAB 2 — CAMPUS FACILITIES
      ====================================================== */}

      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {resources.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />

              <h3 className="text-base font-bold text-slate-800">
                No Facilities Found
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Add your first campus facility using the button above.
              </p>
            </div>
          ) : (
            resources.map((resource) => (
              <div
                key={resource._id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >

                <div>

                  {/* IMAGE */}

                  <div className="h-40 bg-slate-100 relative">

                    <img
                      src={
                        resource.image ||
                        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={resource.name}
                      className="w-full h-full object-cover"
                    />

                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-sm">
                      {resource.type?.replace('_', ' ')}
                    </span>

                    <span
                      className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        resource.status === 'active'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {resource.status}
                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="p-5">

                    <div className="flex items-center justify-between mb-1">

                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {resource.code}
                      </span>

                      <span className="text-xs text-slate-500 font-medium">
                        Cap: {resource.capacity} seats
                      </span>

                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      {resource.name}
                    </h3>

                    <p className="text-xs text-slate-500 mb-3">
                      {resource.location}
                    </p>

                    {resource.amenities &&
                      resource.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">

                          {resource.amenities.map(
                            (amenity, index) => (
                              <span
                                key={index}
                                className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium"
                              >
                                {amenity}
                              </span>
                            )
                          )}

                        </div>
                      )}

                  </div>
                </div>

                {/* EDIT / DELETE */}

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">

                  <button
                    onClick={() =>
                      handleOpenEditResource(resource)
                    }
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition"
                    title="Edit Resource"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteResource(
                        resource._id,
                        resource.name
                      )
                    }
                    className="p-2 text-slate-600 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            ))
          )}

        </div>
      )}

      {/* ======================================================
          TAB 3 — MASTER RESERVATION LOG
      ====================================================== */}

      {activeTab === 'all_bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

          {allBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />

              <h3 className="text-base font-bold text-slate-800">
                No Reservations Found
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Booking records will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs text-slate-600">

                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">

                  <tr>
                    <th className="px-4 py-3">
                      Facility
                    </th>

                    <th className="px-4 py-3">
                      Requester
                    </th>

                    <th className="px-4 py-3">
                      Date & Time
                    </th>

                    <th className="px-4 py-3">
                      Purpose
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                    <th className="px-4 py-3">
                      Admin Remarks
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {allBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-slate-50/60 transition"
                    >

                      <td className="px-4 py-3 font-semibold text-slate-900">

                        <div>
                          {booking.resource?.name}
                        </div>

                        <span className="font-mono text-[10px] text-indigo-600 font-bold">
                          {booking.resource?.code}
                        </span>

                      </td>

                      <td className="px-4 py-3">

                        <div className="font-semibold text-slate-800">
                          {booking.user?.name}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {booking.user?.rollNoOrId}{' '}
                          ({booking.user?.role})
                        </div>

                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">

                        <div className="font-medium text-slate-800">
                          {booking.date}
                        </div>

                        <div className="text-[10px] text-slate-400 font-mono">
                          {booking.startTime} -{' '}
                          {booking.endTime}
                        </div>

                      </td>

                      <td
                        className="px-4 py-3 max-w-xs truncate"
                        title={booking.purpose}
                      >
                        {booking.purpose}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">

                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            booking.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : booking.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {booking.status}
                        </span>

                      </td>

                      <td className="px-4 py-3 text-slate-500 italic max-w-xs truncate">
                        {booking.adminRemarks || '—'}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>
      )}

      {/* ======================================================
          APPROVE / REJECT MODAL
      ====================================================== */}

      {selectedBookingForAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">

            <div
              className={`p-6 text-white ${
                actionType === 'approved'
                  ? 'bg-emerald-700'
                  : 'bg-rose-700'
              }`}
            >

              <h3 className="text-lg font-bold">
                {actionType === 'approved'
                  ? 'Approve Reservation'
                  : 'Reject Reservation'}
              </h3>

              <p className="text-xs opacity-90 mt-1">
                For{' '}
                {selectedBookingForAction.resource?.name}{' '}
                on {selectedBookingForAction.date}{' '}
                (
                {selectedBookingForAction.startTime}-
                {selectedBookingForAction.endTime})
              </p>

            </div>

            <form
              onSubmit={handleActionSubmit}
              className="p-6 space-y-4"
            >

              <div>

                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Administrative Remarks / Notice
                </label>

                <textarea
                  required
                  rows={3}
                  value={adminRemarks}
                  onChange={(e) =>
                    setAdminRemarks(e.target.value)
                  }
                  placeholder="e.g. Approved. Keys can be picked up from the AV room."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedBookingForAction(null)
                  }
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processingAction}
                  className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 ${
                    actionType === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {processingAction && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}

                  Confirm{' '}
                  {actionType === 'approved'
                    ? 'Approval'
                    : 'Rejection'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================
          ADD / EDIT RESOURCE MODAL
      ====================================================== */}

      {resourceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">

            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">

              <div>
                <h3 className="text-lg font-bold">
                  {editingResource
                    ? 'Edit Campus Facility'
                    : 'Add New Campus Facility'}
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Configure capacity, amenities, room code and availability
                </p>
              </div>

              <button
                onClick={() =>
                  setResourceModalOpen(false)
                }
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <form
              onSubmit={handleSaveResource}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >

              {/* FORM ERROR */}

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />

                  <span>{formError}</span>
                </div>
              )}

              {/* NAME + CODE */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Facility Name
                  </label>

                  <input
                    type="text"
                    required
                    value={resourceForm.name}
                    onChange={(e) =>
                      setResourceForm({
                        ...resourceForm,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. AI Innovation Lab"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Room / Facility Code
                  </label>

                  <input
                    type="text"
                    required
                    value={resourceForm.code}
                    onChange={(e) =>
                      setResourceForm({
                        ...resourceForm,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g. LAB-304"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

              </div>

              {/* TYPE + CAPACITY */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category Type
                  </label>

                  <select
                    value={resourceForm.type}
                    onChange={(e) =>
                      setResourceForm({
                        ...resourceForm,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="classroom">
                      Classroom
                    </option>

                    <option value="lab">
                      Computer / Tech Lab
                    </option>

                    <option value="seminar_hall">
                      Seminar Hall / Audi
                    </option>

                    <option value="sports">
                      Sports Facility
                    </option>

                    <option value="equipment">
                      Equipment / AV Kit
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Max Capacity (Seats)
                  </label>

                  <input
                    type="number"
                    min="1"
                    required
                    value={resourceForm.capacity}
                    onChange={(e) =>
                      setResourceForm({
                        ...resourceForm,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

              </div>

              {/* LOCATION */}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Building & Floor
                </label>

                <input
                  type="text"
                  required
                  value={resourceForm.location}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g. Science Block, 3rd Floor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* AMENITIES */}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Amenities (comma-separated)
                </label>

                <input
                  type="text"
                  value={resourceForm.amenities}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      amenities: e.target.value,
                    })
                  }
                  placeholder="e.g. 4K Projector, Central AC, Wi-Fi"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* IMAGE */}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image URL (Optional)
                </label>

                <input
                  type="url"
                  value={resourceForm.image}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* STATUS */}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Operational Status
                </label>

                <select
                  value={resourceForm.status}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">
                    Active & Bookable
                  </option>

                  <option value="maintenance">
                    Under Maintenance
                  </option>

                  <option value="inactive">
                    Inactive / Closed
                  </option>
                </select>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>

                <textarea
                  rows={2}
                  value={resourceForm.description}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief details about facility usage rules or equipment..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* FORM BUTTONS */}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() =>
                    setResourceModalOpen(false)
                  }
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingResource}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingResource && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}

                  {savingResource
                    ? 'Saving...'
                    : editingResource
                    ? 'Update Facility'
                    : 'Save Facility'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}