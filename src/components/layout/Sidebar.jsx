import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import { isInterviewBookingApproved } from '../../services/candidateApi';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  Users,
  Calendar,
  ShieldCheck,
  FileSpreadsheet,
  Award,
  Sparkles,
  LogOut,
  Lock,
  Sliders,
  ClipboardList
} from 'lucide-react';

const Sidebar = () => {
  const { role, user, logout } = useAuth();
  const [isApproved, setIsApproved] = useState(() => isInterviewBookingApproved('CAND-8492').approved);
  const [isProfileFrozen, setIsProfileFrozen] = useState(() => localStorage.getItem('fairhire_profile_frozen') === 'true');
  const [isRequirementsFrozen, setIsRequirementsFrozen] = useState(() => localStorage.getItem('fairhire_recruiter_requirements_frozen') === 'true');

  useEffect(() => {
    const handleStatus = () => {
      setIsApproved(isInterviewBookingApproved('CAND-8492').approved);
      setIsProfileFrozen(localStorage.getItem('fairhire_profile_frozen') === 'true');
      setIsRequirementsFrozen(localStorage.getItem('fairhire_recruiter_requirements_frozen') === 'true');
    };

    window.addEventListener('fairhire_candidate_status_updated', handleStatus);
    window.addEventListener('fairhire_application_updated', handleStatus);
    window.addEventListener('fairhire_profile_updated', handleStatus);
    window.addEventListener('fairhire_recruiter_requirements_updated', handleStatus);
    window.addEventListener('storage', handleStatus);

    return () => {
      window.removeEventListener('fairhire_candidate_status_updated', handleStatus);
      window.removeEventListener('fairhire_application_updated', handleStatus);
      window.removeEventListener('fairhire_profile_updated', handleStatus);
      window.removeEventListener('fairhire_recruiter_requirements_updated', handleStatus);
      window.removeEventListener('storage', handleStatus);
    };
  }, []);

  const getNavLinks = () => {
    switch (role) {
      case ROLES.CANDIDATE:
        return [
          { to: '/candidate', label: 'My Dashboard', icon: LayoutDashboard },
          {
            to: '/candidate/profile',
            label: isProfileFrozen ? 'Profile & Rating' : 'Profile Wizard',
            icon: isProfileFrozen ? Award : UserCheck,
            badge: isProfileFrozen ? 'Rated' : null,
            badgeColor: isProfileFrozen
              ? 'bg-teal-950/80 text-teal-300 border-teal-700/50'
              : null
          },
          { to: '/candidate/status', label: 'Application Status', icon: Award },
          {
            to: '/candidate/interview',
            label: 'Interview Booking',
            icon: isApproved ? Calendar : Lock,
            badge: isApproved ? 'Ready' : 'Locked',
            badgeColor: isApproved
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
              : 'bg-amber-950/80 text-amber-300 border-amber-700/50'
          },
        ];
      case ROLES.RECRUITER:
        return [
          { to: '/recruiter', label: 'Overview', icon: LayoutDashboard },
          { to: '/recruiter/jobs', label: 'Job Positions', icon: Briefcase },
          { to: '/recruiter/jobs/create', label: 'Post New Job', icon: Sparkles },
          { to: '/recruiter/candidates', label: 'Candidate Pipeline', icon: Users },
          {
            to: '/recruiter/requirements',
            label: 'Requirements',
            icon: ClipboardList,
            badge: isRequirementsFrozen ? 'Frozen' : 'Setup',
            badgeColor: isRequirementsFrozen
              ? 'bg-teal-950/80 text-teal-300 border-teal-700/50'
              : 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50'
          },
        ];
      case ROLES.INTERVIEWER:
        return [
          { to: '/interviewer', label: 'Interviews Dashboard', icon: LayoutDashboard },
          { to: '/interviewer/interviews/INT-301', label: 'Current Interview', icon: Calendar },
          { to: '/interviewer/candidates/CAND-7731/evaluate', label: 'Candidate Evaluation', icon: Award },
        ];
      case ROLES.ADMIN:
        return [
          { to: '/admin', label: 'Admin Console', icon: LayoutDashboard },
          { to: '/admin/fairness', label: 'Fairness Analytics', icon: ShieldCheck },
          { to: '/admin/audit-logs', label: 'System Audit Logs', icon: FileSpreadsheet },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-navy-900 text-slate-300 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 border-r border-navy-800 shadow-xl">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-navy-800/80 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.jpg" alt="FairHire Logo" className="w-9 h-9 rounded-lg object-contain bg-white p-0.5" />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1 font-sans">
                Fair<span className="text-teal-400">Hire</span>
              </h1>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-teal-400/90">
                Fair Process. Right Talent.
              </p>
            </div>
          </div>
        </div>

        {/* User Role Tag */}
        <div className="px-6 py-3 bg-navy-950/60 flex items-center justify-between text-xs border-b border-navy-800/40">
          <span className="text-slate-400 font-medium">Workspace:</span>
          <span className="font-bold text-teal-400 uppercase tracking-wider text-[11px] bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/50">
            {role}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/candidate' || link.to === '/recruiter' || link.to === '/interviewer' || link.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-teal-300 border-l-4 border-teal-400 pl-2.5 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded border ${link.badgeColor}`}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-navy-800/80 bg-navy-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'user@fairhire.io'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
