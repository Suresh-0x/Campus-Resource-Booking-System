import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'booking_approved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'booking_rejected':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case 'booking_created':
        return <Clock className="w-5 h-5 text-indigo-600" />;
      case 'booking_cancelled':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Calendar className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <h3 className="font-semibold text-sm tracking-wide">Notifications</h3>
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {notifications.filter((n) => !n.isRead).length} new
            </span>
          )}
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-indigo-300 hover:text-white transition flex items-center gap-1 font-medium"
          >
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2 opacity-50" />
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`p-4 flex gap-3 text-left transition cursor-pointer hover:bg-slate-50 ${
                !n.isRead ? 'bg-indigo-50/50' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0 p-2 rounded-xl bg-slate-100 h-fit">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">{n.title}</h4>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{n.message}</p>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  {new Date(n.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
