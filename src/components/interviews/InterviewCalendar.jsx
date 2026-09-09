import React from 'react';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react';

const InterviewCalendar = ({ interviews = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
        <CalendarIcon className="w-5 h-5 text-teal-600" />
        <h4 className="text-base font-bold text-navy-900">Upcoming Interview Agenda</h4>
      </div>

      <div className="space-y-3">
        {interviews.length > 0 ? (
          interviews.map((item) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-teal-300 font-bold flex items-center justify-center text-xs shrink-0">
                  {item.date.split('-')[2] || '09'}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-navy-900">{item.candidateName}</h5>
                  <p className="text-xs text-slate-500">{item.jobTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 font-semibold text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  {item.time}
                </span>

                <a
                  href={item.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  Join
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-6">No scheduled interviews found.</p>
        )}
      </div>
    </div>
  );
};

export default InterviewCalendar;
