import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useJobs } from '../../hooks/useJobs';
import { useCandidates } from '../../hooks/useCandidates';
import { Briefcase, Users, UserCheck, Calendar, Sparkles, Award, Plus, ArrowRight } from 'lucide-react';

const HRDashboard = () => {
  const { jobs, fetchJobs, loading: jobsLoading } = useJobs();
  const { candidates, fetchCandidates, loading: candLoading } = useCandidates();

  useEffect(() => {
    fetchJobs();
    fetchCandidates();

    const handleUpdate = () => {
      fetchJobs();
      fetchCandidates();
    };

    window.addEventListener('fairhire_candidate_status_updated', handleUpdate);
    window.addEventListener('fairhire_candidates_cleared', handleUpdate);
    window.addEventListener('fairhire_jobs_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('fairhire_candidate_status_updated', handleUpdate);
      window.removeEventListener('fairhire_candidates_cleared', handleUpdate);
      window.removeEventListener('fairhire_jobs_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchJobs, fetchCandidates]);

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
