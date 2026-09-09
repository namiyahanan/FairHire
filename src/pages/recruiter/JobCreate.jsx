import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import JobPostingForm from '../../components/jobs/JobPostingForm';
import Toast from '../../components/common/Toast';

const JobCreate = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');

  const handleSuccess = (createdJob) => {
    setToastMessage(`Position "${createdJob.title}" posted successfully! It is now live in the Candidate Portal.`);
    setTimeout(() => {
      navigate('/recruiter/jobs');
    }, 1200);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Post New Job Opening"
        subtitle="Select from the 7 verified engineering roles to auto-populate specifications. Posted jobs are immediately live in the Candidate Portal."
      />

      <div className="max-w-5xl mx-auto pb-12">
        <JobPostingForm onSubmitSuccess={handleSuccess} />
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
};

export default JobCreate;
