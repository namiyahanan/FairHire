import React, { useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import InterviewCard from '../../components/interviews/InterviewCard';
import InterviewCalendar from '../../components/interviews/InterviewCalendar';
import Loader from '../../components/common/Loader';
import { useInterviews } from '../../hooks/useInterviews';
import { Calendar, Video, Award } from 'lucide-react';

const InterviewerDashboard = () => {
  const { interviews, fetchInterviews, loading } = useInterviews();

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Interviewer Dashboard"
        subtitle="Review scheduled interview sessions, access AI-generated candidate interview prompts, and record evaluation feedback."
      />

      <div className="space-y-8">
        {/* Quick Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-teal-50 text-teal-600 font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Sessions</span>
              <span className="text-2xl font-extrabold text-navy-900 font-sans">1 Interview</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 font-bold">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Upcoming Next</span>
              <span className="text-sm font-extrabold text-navy-900">David Chen (01:00 PM)</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Evaluations Completed</span>
              <span className="text-2xl font-extrabold text-navy-900 font-sans">14 Feedback Forms</span>
            </div>
          </div>
        </div>

        {/* Upcoming Interview Cards */}
        <div>
          <h3 className="text-lg font-extrabold text-navy-900 mb-4">Assigned Interview Rounds</h3>

          {loading && interviews.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <Loader size="md" color="teal" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((item) => (
                <InterviewCard key={item.id} interview={item} />
              ))}
            </div>
          )}
        </div>

        {/* Agenda Calendar */}
        <InterviewCalendar interviews={interviews} />
      </div>
    </DashboardLayout>
  );
};

export default InterviewerDashboard;
