import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Search, 
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
  LogOut 
} from 'lucide-react';

const Topbar = ({ onToggleSidebar, isSidebarOpen, isSidebarPinned }) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Menu toggle + Global Search */}
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

        <div className="relative flex items-center w-56 sm:w-72 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidates, jobs, or metrics..."
            className="w-full bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 rounded-xl pl-9 pr-3 py-2 border border-slate-200 focus:border-teal-500 focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white" />
        </button>

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
                
                <button onClick={() => { setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 w-full text-left transition-colors cursor-pointer">
                  <Bell className="w-3.5 h-3.5 text-slate-400" /> Notifications
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
    </header>
  );
};

export default Topbar;

