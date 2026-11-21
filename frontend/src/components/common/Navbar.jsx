import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { Bell, LogOut, CheckCheck, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res.data) {
        setNotifications(res.data);
        const count = res.data.filter((n) => !n.read).length;
        setUnreadCount(count);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {}
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-brand-50 to-indigo-50 border border-brand-100/80 px-3 py-1.5 rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-xs font-bold text-brand-900 tracking-tight">
            TeamFlow <span className="font-normal text-slate-500">| Designed by</span>{' '}
            <span className="text-brand-600 font-extrabold">Ayananshu</span>
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 rounded-2xl transition shadow-xs"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50 animate-fade-in ring-1 ring-black/5">
              <div className="flex items-center justify-between px-5 pb-3 border-b border-slate-100">
                <span className="font-extrabold text-sm text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && handleMarkSingleRead(n.id)}
                      className={`p-4 text-left hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                        !n.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 bg-brand-500 ring-2 ring-brand-200" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1.5 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'ayananshu'}`}
            alt={user?.fullName}
            className="w-10 h-10 rounded-full ring-2 ring-brand-500/30 bg-slate-100 shadow-xs"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-slate-800 leading-tight">{user?.fullName}</p>
            <p className="text-[11px] text-slate-400 font-medium">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition ml-1"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
