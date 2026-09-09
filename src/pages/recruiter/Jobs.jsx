import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import JobCard from '../../components/jobs/JobCard';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Toast from '../../components/common/Toast';
import { useJobs } from '../../hooks/useJobs';
import { Plus } from 'lucide-react';

const Jobs = () => {
  const { jobs, fetchJobs, deleteJob, loading } = useJobs();
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDeleteJob = async (jobId) => {
    const res = await deleteJob(jobId);
    if (res.success) {
      setToastMessage(`✓ Position ${jobId} deleted successfully from enterprise directory.`);
      fetchJobs();
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
