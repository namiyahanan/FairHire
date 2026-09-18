import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { useJobs } from '../../hooks/useJobs';
import { Plus } from 'lucide-react';

const Jobs = () => {
  const { jobs, fetchJobs, deleteJob, loading, error } = useJobs();
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchJobs();

    const handleUpdate = () => {
      fetchJobs();
    };

    window.addEventListener('fairhire_jobs_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('fairhire_jobs_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchJobs]);

  const handleDeleteJob = async (jobId) => {
    const res = await deleteJob(jobId);
    if (res.success) {
      setToastMessage(`✓ Position ${jobId} deleted successfully from enterprise directory.`);
      fetchJobs();
    } else {
      setToastMessage(`✕ ${res.message || 'Failed to delete position.'}`);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Job Positions & Hiring Thresholds"
        subtitle="Manage current enterprise job descriptions, configure rounds, or remove obsolete openings."
        actions={
          <Link to="/recruiter/jobs/create">
            <Button variant="gradient" size="md" icon={Plus}>
              Post New Position
            </Button>
          </Link>
        }
      />

      {loading && jobs.length === 0 ? (
        <div className="h-96 flex items-center justify-center">
          <Loader size="lg" color="teal" />
        </div>
      ) : error ? (
        <ErrorState
          title="Failed to Load Job Openings"
          message={error}
          onRetry={fetchJobs}
        />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No Active Job Positions"
          description="There are currently no job positions returned from the database. If positions exist, verify that Supabase Row Level Security (RLS) policies allow SELECT queries for the anon role."
          actionLabel="Post New Position"
          onAction={() => window.location.href = '/recruiter/jobs/create'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={handleDeleteJob} />
          ))}
        </div>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
};

export default Jobs;
