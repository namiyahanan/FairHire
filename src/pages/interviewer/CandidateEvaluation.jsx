import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import FeedbackForm from '../../components/interviews/FeedbackForm';
import Toast from '../../components/common/Toast';
import Button from '../../components/common/Button';
import { useInterviews } from '../../hooks/useInterviews';
import { ArrowLeft } from 'lucide-react';

const CandidateEvaluation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { submitFeedback } = useInterviews();

  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmitFeedback = async (payload) => {
    setSubmitting(true);
    const res = await submitFeedback(payload);
    setSubmitting(false);

    if (res.success) {
      setToastMessage('Evaluation feedback submitted successfully via POST /interviews/feedback!');
      setTimeout(() => {
        navigate('/interviewer');
      }, 1200);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Candidate Structured Evaluation"
        subtitle={`Candidate ID: ${id || 'CAND-7731'} | Submit formal interview score to recruitment committee.`}
        actions={
          <Link to="/interviewer">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Back to Dashboard
            </Button>
          </Link>
        }
      />

      <div className="max-w-4xl mx-auto">
        <FeedbackForm
          candidateId={id || 'CAND-7731'}
          onSubmitFeedback={handleSubmitFeedback}
          isSubmitting={submitting}
        />
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
};

export default CandidateEvaluation;
