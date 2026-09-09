import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import Loader from '../../components/common/Loader';
import { useCandidates } from '../../hooks/useCandidates';
import { PIPELINE_STAGES } from '../../utils/constants';
import { formatScore, formatDate, getScoreBadgeColor } from '../../utils/formatters';
import {
  Search,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Lock,
  Clock,
  Briefcase,
  Trash2
} from 'lucide-react';

const STAGE_COLORS = {
  Applied: 'bg-slate-100 text-slate-700 border-slate-300',
  Screened: 'bg-sky-50 text-sky-800 border-sky-300',
  Shortlisted: 'bg-teal-50 text-teal-800 border-teal-300',
  'Interview Scheduled': 'bg-indigo-50 text-indigo-800 border-indigo-300',
  Interviewed: 'bg-purple-50 text-purple-800 border-purple-300',
  Offered: 'bg-amber-50 text-amber-800 border-amber-300',
  Hired: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  Rejected: 'bg-rose-50 text-rose-800 border-rose-300'
};

const Candidates = () => {
  const { candidates, fetchCandidates, deleteCandidate, clearAllCandidates, loading } = useCandidates();

  const [search, setSearch] = useState('');
  const [activeStage, setActiveStage] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchCandidates({ search, status: activeStage === 'All' ? undefined : activeStage });

    const handleUpdate = () => {
      fetchCandidates({ search, status: activeStage === 'All' ? undefined : activeStage });
    };

    window.addEventListener('fairhire_candidate_status_updated', handleUpdate);
    window.addEventListener('fairhire_candidates_cleared', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('fairhire_candidate_status_updated', handleUpdate);
      window.removeEventListener('fairhire_candidates_cleared', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchCandidates, search, activeStage]);

  const handleClearAll = async () => {
    await clearAllCandidates();
    setToastMessage('✓ All candidates have been removed from the HR pipeline.');
    fetchCandidates();
  };

  const handleDeleteCandidate = async (candidateId) => {
    await deleteCandidate(candidateId);
    setToastMessage(`✓ Candidate ${candidateId} removed from pipeline.`);
    fetchCandidates();
  };

  // Organize candidates strictly by AI match score ranking (highest score first)
  const rankedCandidates = [...candidates].sort((a, b) => (Number(b.aiScore) || 0) - (Number(a.aiScore) || 0));

  // Filter ranked candidates based on search & activeStage
  const filteredCandidates = rankedCandidates.filter(c => {
    const matchesSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.id?.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      (c.matchedSkills || []).some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchesStage = activeStage === 'All' || c.status === activeStage;
    return matchesSearch && matchesStage;
  });

  // Calculate metrics counts
  const totalCount = candidates.length;
  const screenedCount = candidates.filter(c => c.status === 'Screened' || c.status === 'Shortlisted').length;
  const interviewCount = candidates.filter(c => c.status === 'Interview Scheduled' || c.status === 'Interviewed').length;
  const hiredCount = candidates.filter(c => c.status === 'Hired' || c.status === 'Offered').length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Candidate Pipeline & AI Rankings"
        subtitle="Applicants ranked by contextual semantic AI match scores. Stage progression updates automatically as candidates complete each evaluation round."
        actions={
          <div className="flex items-center gap-2.5">
            <div className="text-xs text-slate-500 font-semibold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              Total Pipeline: <strong className="text-navy-900">{totalCount} Candidates</strong>
            </div>
            {totalCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                title="Remove all candidates from pipeline"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Remove All Candidates</span>
              </button>
            )}
          </div>
        }
      />

      <div className="space-y-6 pb-12">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total In Pipeline</span>
            <p className="text-2xl font-black text-navy-900">{totalCount}</p>
            <span className="text-[10px] text-slate-500 font-medium">Ranked by AI match</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">Screened & Shortlisted</span>
            <p className="text-2xl font-black text-teal-600">{screenedCount}</p>
            <span className="text-[10px] text-slate-500 font-medium">Passed semantic threshold</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">In Round Evaluation</span>
            <p className="text-2xl font-black text-indigo-600">{interviewCount}</p>
            <span className="text-[10px] text-slate-500 font-medium">Interview rounds in progress</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Offered / Hired</span>
            <p className="text-2xl font-black text-emerald-600">{hiredCount}</p>
            <span className="text-[10px] text-slate-500 font-medium">Completed all rounds</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by name, role, ID, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Quick Stage Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveStage('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStage === 'All'
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All ({totalCount})
            </button>

            {PIPELINE_STAGES.map((stage) => {
              const count = candidates.filter(c => c.status === stage).length;
              const isSelected = activeStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setActiveStage(stage)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  <span>{stage}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= TABULAR CANDIDATE PIPELINE (RANKED) ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4 text-center w-16">Rank</th>
                  <th className="py-4 px-5">Candidate</th>
                  <th className="py-4 px-5">Position Applied</th>
                  <th className="py-4 px-5">AI Match Score</th>
                  <th className="py-4 px-5">Pipeline Stage</th>
                  <th className="py-4 px-5">Applied Date</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {loading && candidates.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center">
                      <Loader size="md" color="teal" />
                    </td>
                  </tr>
                ) : filteredCandidates.length > 0 ? (
                  filteredCandidates.map((cand, idx) => {
                    // Global ranking index across all candidates
                    const overallRank = rankedCandidates.findIndex(c => c.id === cand.id) + 1;
                    const isTop1 = overallRank === 1;
                    const isTop2 = overallRank === 2;
                    const isTop3 = overallRank === 3;

                    return (
                      <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors group">
                        {/* Rank Column */}
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black font-mono shadow-2xs border ${
                              isTop1
                                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300/40'
                                : isTop2
                                ? 'bg-slate-100 text-slate-800 border-slate-300'
                                : isTop3
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}
                            title={`Overall Candidate Ranking: #${overallRank}`}
                          >
                            #{overallRank}
                          </span>
                        </td>

                        {/* Candidate Name & Info */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                              {cand.name ? cand.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                              <span className="font-extrabold text-navy-900 text-sm block group-hover:text-teal-600 transition-colors">
                                {cand.name}
                              </span>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span className="font-mono text-teal-700 font-semibold">{cand.id}</span>
                                <span>•</span>
                                <span className="truncate max-w-[160px]">{cand.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Position Applied */}
                        <td className="py-4 px-5">
                          <div>
                            <span className="font-bold text-slate-800 text-xs block">
                              {cand.jobTitle || 'Software Engineer'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {cand.experienceYears ? `${cand.experienceYears} yrs experience` : 'Verified Experience'}
                            </span>
                          </div>
                        </td>

                        {/* AI Match Score */}
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1.5 font-black text-xs px-2.5 py-1 rounded-lg border ${getScoreBadgeColor(cand.aiScore)}`}>
                              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                              <span>{formatScore(cand.aiScore)} / 10</span>
                            </span>
                            {cand.matchedSkills && cand.matchedSkills.length > 0 && (
                              <p className="text-[10px] text-slate-400 truncate max-w-[170px]">
                                {cand.matchedSkills.slice(0, 3).join(', ')}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Pipeline Stage (Read-Only Badge - Changes only on round completion) */}
                        <td className="py-4 px-5">
                          <div className="inline-flex flex-col gap-0.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold tracking-tight select-none shadow-2xs ${
                                STAGE_COLORS[cand.status] || 'bg-slate-100 text-slate-800 border-slate-200'
                              }`}
                              title="Pipeline stage advances automatically upon round completion & evaluation"
                            >
                              <span className="w-2 h-2 rounded-full bg-current opacity-75 animate-pulse"></span>
                              <span>{cand.status}</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">
                              Round-automated
                            </span>
                          </div>
                        </td>

                        {/* Applied Date */}
                        <td className="py-4 px-5 text-slate-500 text-xs">
                          {formatDate(cand.appliedDate)}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/recruiter/candidates/${cand.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-teal-600 hover:border-teal-400 hover:bg-teal-50/50 transition-all shadow-2xs"
                            >
                              <span>Dossier</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteCandidate(cand.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all shadow-2xs cursor-pointer"
                              title="Remove candidate from pipeline"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
                          <Users className="w-7 h-7" />
                        </div>
                        <h4 className="font-extrabold text-navy-900 text-base">No candidates in recruitment pipeline</h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                          The candidate pipeline is currently clean and empty. As candidates apply to active positions through the Candidate Portal, their applications will automatically appear and be ranked here.
                        </p>
                        <div className="pt-2">
                          <Link
                            to="/recruiter/jobs"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-sm"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>View Active Job Positions</span>
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
};

export default Candidates;
