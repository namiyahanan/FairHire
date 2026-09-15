import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import CandidateProfile from '../../components/candidates/CandidateProfile';
import InterviewQuestions from '../../components/interviews/InterviewQuestions';
import LiveMeetingRoomModal from '../../components/interviews/LiveMeetingRoomModal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useInterviews } from '../../hooks/useInterviews';
import { useCandidates } from '../../hooks/useCandidates';
import { ArrowLeft, Award, Video } from 'lucide-react';

const InterviewDetails = () => {
  const { id } = useParams();
  const { prompts, fetchPrompts, loading: promptsLoading } = useInterviews();
  const { currentCandidate, fetchCandidateStatus, loading: candLoading } = useCandidates();
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  useEffect(() => {
    fetchPrompts({ interview_id: id });
    fetchCandidateStatus('CAND-7731');
  }, [fetchPrompts, fetchCandidateStatus, id]);

  const candidate = currentCandidate || {
    id: "CAND-7731",
    jobTitle: "Lead AI Systems Architect",
    name: "David Chen",
    email: "david.chen@example.com",
    phone: "+1 4155550199",
    experienceYears: 8,
    education: "Ph.D. Artificial Intelligence, Stanford",
    aiScore: 9.5,
    matchedSkills: ["Python", "PyTorch", "LLM Fine-tuning", "Vector DBs", "FastAPI", "Fairness Metrics"],
    missingSkills: [],
    status: "Interview Scheduled",
    resumeSummary: "AI Research Scientist & Systems Architect specializing in retrieval-augmented generation and bias-aware model deployments."
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={`Interview Session: ${candidate.name}`}
        subtitle={`Session ID: ${id || 'INT-301'} | Position: ${candidate.jobTitle}`}
        actions={
          <div className="flex items-center gap-3">
            <Link to="/interviewer">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back to Agenda
              </Button>
            </Link>
            <Link to={`/interviewer/candidates/${candidate.id}/evaluate`}>
              <Button variant="gradient" size="sm" icon={Award}>
                Conduct & Submit Evaluation
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-8">
        {/* Virtual Room Banner */}
        <div className="p-5 rounded-2xl bg-navy-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-teal-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-400/30">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Live Virtual Interview Room</h4>
              <p className="text-xs text-slate-300">Room ID: #{id || 'ROOM-301'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMeetingModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md self-start sm:self-auto cursor-pointer"
          >
            Launch Live Meeting Room
          </button>
        </div>

        {/* Candidate Profile Details */}
        <CandidateProfile candidate={candidate} />

        {/* AI-Generated Interview Prompts (GET /interviews/llm-prompts) */}
        {promptsLoading && prompts.length === 0 ? (
          <div className="h-48 flex items-center justify-center">
            <Loader size="md" color="teal" />
          </div>
        ) : (
          <InterviewQuestions prompts={prompts} />
        )}
      </div>

      <LiveMeetingRoomModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        roomId={id || 'ROOM-301'}
        roleTitle={candidate.jobTitle}
        candidateName={candidate.name}
        interviewerName="Elena Rostova (Lead Technical Evaluator)"
      />
    </DashboardLayout>
  );
};

export default InterviewDetails;
