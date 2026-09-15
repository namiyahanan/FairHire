import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useJobs } from '../../hooks/useJobs';
import { useCandidates } from '../../hooks/useCandidates';
import { Briefcase, Users, UserCheck, Calendar, Sparkles, Award, Plus, ArrowRight, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getRecruiterAlerts, clearRecruiterAlerts } from '../../services/candidateHiringStore';

const HRDashboard = () => {
  const { jobs, fetchJobs, loading: jobsLoading } = useJobs();
  const { candidates, fetchCandidates, loading: candLoading } = useCandidates();
  const [alerts, setAlerts] = React.useState(() => getRecruiterAlerts());

  useEffect(() => {
    fetchJobs();
    fetchCandidates();

    const handleUpdate = () => {
      fetchJobs();
      fetchCandidates();
      setAlerts(getRecruiterAlerts());
    };

    window.addEventListener('fairhire_candidate_status_updated', handleUpdate);
    window.addEventListener('fairhire_candidates_cleared', handleUpdate);
    window.addEventListener('fairhire_jobs_updated', handleUpdate);
    window.addEventListener('fairhire_recruiter_alert_dispatched', handleUpdate);
    window.addEventListener('fairhire_malpractice_alert', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('fairhire_candidate_status_updated', handleUpdate);
      window.removeEventListener('fairhire_candidates_cleared', handleUpdate);
      window.removeEventListener('fairhire_jobs_updated', handleUpdate);
      window.removeEventListener('fairhire_recruiter_alert_dispatched', handleUpdate);
      window.removeEventListener('fairhire_malpractice_alert', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchJobs, fetchCandidates]);

  const unreadAlerts = alerts.filter(a => !a.read);

  const metrics = [
    { label: 'Total Positions', value: jobs.length, icon: Briefcase, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { label: 'Active Openings', value: jobs.filter(j => j.status === 'Active').length, icon: Sparkles, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { label: 'Total Applicants', value: candidates.length, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { label: 'AI Screened', value: candidates.filter(c => c.status !== 'Applied').length, icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { label: 'Shortlisted', value: candidates.filter(c => c.status === 'Shortlisted').length, icon: UserCheck, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Interviews Scheduled', value: candidates.filter(c => c.status === 'Interview Scheduled').length, icon: Calendar, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Recruiter Intelligence Dashboard"
        subtitle="Manage active job openings, review AI candidate match vectors, and oversee recruitment pipeline stages."
        actions={
          <Link to="/recruiter/jobs/create">
            <Button variant="gradient" size="md" icon={Plus}>
              Post New Position
            </Button>
          </Link>
        }
      />

      {/* Real-time Anti-Cheat Malpractice Warning Banner for HR */}
      {alerts.length > 0 && (
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-sm animate-pulse shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-navy-900">
                    🚨 High-Priority Proctoring & Malpractice Alert
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono">
                    {alerts.length} Incidents Logged
                  </span>
                </div>
                <p className="text-xs text-rose-800 mt-0.5">
                  Automated anti-cheat telemetry flagged candidate attempts to reject or exit full-screen assessment mode.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/recruiter/candidates">
                <button className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer">
                  <span>Audit Candidate Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2 border-t border-rose-200/80">
            {alerts.slice(0, 2).map((a) => (
              <div key={a.id} className="p-3 rounded-2xl bg-white border border-rose-200 text-xs flex items-start justify-between gap-2 shadow-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-navy-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{a.candidateName} ({a.candidateId}) — {a.roleTitle}</span>
                  </p>
                  <p className="text-[11px] text-slate-600">{a.message}</p>
                </div>
                <span className="text-[10px] font-mono text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded shrink-0 border border-rose-200">
                  {a.timeFormatted || 'Recent'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                <div className={`p-1.5 rounded-lg border ${m.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <span className="text-2xl font-extrabold text-navy-900 font-sans">{m.value}</span>
            </div>
          );
        })}
      </div>

      {/* Active Job Openings Section */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-navy-900">Active Job Positions</h3>
          <Link to="/recruiter/jobs" className="text-xs font-bold text-teal-600 hover:text-navy-900 flex items-center gap-1">
            <span>View All Positions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {jobsLoading && jobs.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <Loader size="md" color="teal" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

    </DashboardLayout>
  );
};

export default HRDashboard;
