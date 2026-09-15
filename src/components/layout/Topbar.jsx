import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  User, 
  FileText, 
  Star, 
  ClipboardList, 
  BarChart2, 
  Calendar, 
  Shield, 
  Settings, 
  HelpCircle, 
  LogOut,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import {
  getRecruiterAlerts,
  markRecruiterAlertAsRead,
  clearRecruiterAlerts
} from '../../services/candidateHiringStore';

const Topbar = ({ onToggleSidebar, isSidebarOpen, isSidebarPinned }) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [alerts, setAlerts] = useState(() => getRecruiterAlerts());
  const [liveToast, setLiveToast] = useState(null);

  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Load and subscribe to real-time alerts
  useEffect(() => {
    const handleUpdate = () => {
      setAlerts(getRecruiterAlerts());
    };

    const handleMalpracticeEvent = (e) => {
      setAlerts(getRecruiterAlerts());
      if (e.detail) {
        setLiveToast(e.detail);
        // Auto dismiss live toast after 6 seconds
        setTimeout(() => {
          setLiveToast(null);
        }, 6000);
      }
    };

    window.addEventListener('fairhire_recruiter_alert_dispatched', handleUpdate);
    window.addEventListener('fairhire_malpractice_alert', handleMalpracticeEvent);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('fairhire_recruiter_alert_dispatched', handleUpdate);
      window.removeEventListener('fairhire_malpractice_alert', handleMalpracticeEvent);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.read);

  const displayName = (() => {
    try {
      const saved = localStorage.getItem('fairhire_frozen_profile_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName && parsed.fullName.trim()) return parsed.fullName;
      }
    } catch (e) {}
    return user?.name || (role === 'recruiter' ? 'Elena Rostova' : 'Candidate');
  })();

  const handleMarkAllRead = () => {
    alerts.forEach(a => markRecruiterAlertAsRead(a.id));
    setAlerts(getRecruiterAlerts());
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Menu toggle */}
      <div className="flex items-center gap-3">
        {!isSidebarPinned && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex items-center justify-center"
            title="Toggle Menu (or move cursor to left screen edge)"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Notifications Dropdown Container */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={`relative p-2 rounded-xl transition-all cursor-pointer ${
              unreadAlerts.length > 0
                ? 'text-rose-600 hover:bg-rose-50'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title="Recruiter Notifications & Live Anti-Cheat Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadAlerts.length > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadAlerts.length}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-3 z-50 origin-top-right overflow-hidden animate-fadeIn">
              
              <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-700" />
                  <h4 className="text-xs font-black text-navy-900 uppercase tracking-wider">
                    Recruiter Alert Feed
                  </h4>
                </div>
                {unreadAlerts.length > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-teal-600 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {alerts.length === 0 ? (
                  <div className="py-8 text-center px-4 space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-teal-500 mx-auto opacity-70" />
                    <p className="text-xs font-bold text-slate-700">No active alerts</p>
                    <p className="text-[11px] text-slate-400">All assessments running in compliance.</p>
                  </div>
                ) : (
                  alerts.slice(0, 8).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3.5 transition-colors ${
                        alert.read ? 'bg-white hover:bg-slate-50' : 'bg-rose-50/50 hover:bg-rose-50/80 border-l-4 border-rose-500'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-extrabold text-navy-900 truncate">
                              {alert.title}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {alert.timeFormatted || 'Just now'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">
                            {alert.message}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                              Flag #{alert.flagCount || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                markRecruiterAlertAsRead(alert.id);
                                setIsNotificationOpen(false);
                                navigate('/recruiter/candidates');
                              }}
                              className="text-[11px] font-bold text-teal-700 hover:text-navy-900 flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Candidate</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {alerts.length > 0 && (
                <div className="px-4 pt-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {alerts.length} Total Anti-Cheat Log entries
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearRecruiterAlerts();
                      setAlerts([]);
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    Clear Feed
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* User Pill with Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-navy-800 text-teal-400 font-bold text-xs flex items-center justify-center border border-teal-500/30 shadow-xs">
              {displayName.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{displayName}</p>
              <p className="text-[10px] text-slate-500 capitalize">{role}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-200/80 py-2 z-50 origin-top-right">
              
              <div className="px-4 py-2 mb-1 border-b border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                <p className="text-xs text-slate-700 font-semibold truncate">{displayName}</p>
              </div>

              <div className="flex flex-col">
                <button onClick={() => { navigate('/candidate/profile'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 w-full text-left transition-colors cursor-pointer">
                  <User className="w-3.5 h-3.5 text-slate-400" /> My Profile
                </button>
                <button onClick={() => { setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 w-full text-left transition-colors cursor-pointer">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Interview Schedule
                </button>
                
                <div className="h-px bg-slate-100 my-1" />
                
                <button onClick={() => { setIsNotificationOpen(true); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 w-full text-left transition-colors cursor-pointer">
                  <Bell className="w-3.5 h-3.5 text-slate-400" /> Notifications ({unreadAlerts.length})
                </button>
                <button onClick={() => { setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 w-full text-left transition-colors cursor-pointer">
                  <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings
                </button>

                <div className="h-px bg-slate-100 my-1" />

                <button 
                  onClick={() => { setIsProfileMenuOpen(false); logout(); navigate('/login'); }} 
                  className="px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-2.5 w-full text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Toast Banner when Malpractice Occurs */}
      {liveToast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-950 text-white border-2 border-rose-500 rounded-2xl p-4 shadow-2xl max-w-md w-full animate-bounce flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <strong className="font-bold text-rose-400 uppercase tracking-wider">🚨 Instant Recruiter Alert</strong>
              <button
                type="button"
                onClick={() => setLiveToast(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-200 font-medium">{liveToast.message}</p>
            <p className="text-[10px] text-slate-400 font-mono">Timestamp: {liveToast.timeFormatted || 'Live'} • Flag #{liveToast.flagCount || 1}</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
