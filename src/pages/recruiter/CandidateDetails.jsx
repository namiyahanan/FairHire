import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import CandidateScore from '../../components/candidates/CandidateScore';
import CandidateProfile from '../../components/candidates/CandidateProfile';
import CandidateTimeline from '../../components/candidates/CandidateTimeline';
import Toast from '../../components/common/Toast';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useCandidates } from '../../hooks/useCandidates';
import CandidateHiringWorkflow from '../../components/candidates/CandidateHiringWorkflow';
import { ArrowLeft, Calendar, CheckCircle2, Lock, Unlock, ShieldAlert, Sparkles, Users } from 'lucide-react';

const CandidateDetails = () => {
  const { id } = useParams();
  const { currentCandidate, fetchCandidateStatus, updateCandidateStatus, loading } = useCandidates();

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchCandidateStatus(id || 'CAND-8492');
  }, [fetchCandidateStatus, id]);

  const handleStatusChange = async (newStatus) => {
    const candId = id || currentCandidate?.id || 'CAND-8492';
    const res = await updateCandidateStatus(candId, newStatus, `Recruiter updated status to ${newStatus}`);
    if (res.success) {
      setToastMessage(`Candidate status updated to ${newStatus}`);
    }
  };

  if (loading && !currentCandidate) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center">
          <Loader size="lg" color="teal" />
        </div>
      </DashboardLayout>
    );
  }

  if (!loading && !currentCandidate) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Candidate Evaluation"
          subtitle="Candidate record not found in active pipeline"
          actions={
            <Link to="/recruiter/candidates">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back to Pipeline
              </Button>
            </Link>
          }
        />
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm my-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-navy-900">No Candidate Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            This candidate record does not exist in the recruitment pipeline. Candidates will appear dynamically once an applicant applies through the Candidate Portal.
          </p>
          <div className="pt-2">
            <Link to="/recruiter/candidates">
              <Button variant="gradient" size="md" icon={ArrowLeft}>
                Return to Pipeline
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const cand = currentCandidate;

  const isApproved = cand.status === 'Shortlisted' || cand.status === 'Interview Scheduled' || cand.status === 'Interviewed' || cand.status === 'Offered' || cand.status === 'Hired';

  return (
    <DashboardLayout>
      <PageHeader
        title={`Candidate Evaluation: ${cand.name}`}
        subtitle={`Candidate ID: ${cand.id} | Position: ${cand.jobTitle}`}
        actions={
          <Link to="/recruiter/candidates">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Back to Pipeline
            </Button>
          </Link>
        }
      />

      <div className="space-y-8">
        {/* ================= STEP-BY-STEP CANDIDATE EVALUATION & HIRING WORKFLOW ================= */}
        <CandidateHiringWorkflow
          candidateId={cand.id}
          candidateName={cand.name}
          jobTitle={cand.jobTitle}
          onStateChange={(updated) => {
            fetchCandidateStatus(cand.id);
          }}
        />

        {/* AI Score Assessment & Human Decision Bar */}
        <CandidateScore
          score={cand.aiScore}
          rationale={cand.rationale}
          status={cand.status}
          onStatusChange={handleStatusChange}
          isRecruiterView={true}
        />

        {/* Candidate Profile Details */}
        <CandidateProfile candidate={cand} />

        {/* Audit Progress Timeline */}
        <CandidateTimeline timeline={cand.timeline} />
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
};

export default CandidateDetails;
