import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Search } from 'lucide-react';

const Topbar = () => {
  const { role, user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left: Global Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center w-64 md:w-80">
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
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-navy-800 text-teal-400 font-bold text-xs flex items-center justify-center border border-teal-500/30 shadow-xs">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 capitalize">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
