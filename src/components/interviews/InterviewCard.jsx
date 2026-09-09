import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { Calendar, Clock, Video, User, ArrowRight } from 'lucide-react';

const InterviewCard = ({ interview }) => {
  if (!interview) return null;

  return (
    <div className="bg-surface-card rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">{interview.id}</span>
          <Badge variant={interview.status === 'Upcoming' ? 'teal' : 'default'} size="sm">
            {interview.status}
          </Badge>
        </div>

        <h4 className="text-base font-extrabold text-navy-900 leading-tight">
          {interview.candidateName}
        </h4>
        <p className="text-xs text-slate-500 font-medium mb-3">
          {interview.jobTitle}
        </p>

        <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2">
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>{interview.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{interview.time}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span>Interviewer: {interview.interviewerName}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <a
          href={interview.meetingLink}
          target="_blank"
          rel="noreferrer"
          className="text-teal-600 hover:text-navy-900 font-bold flex items-center gap-1.5"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Join Room</span>
        </a>

        <Link
          to={`/interviewer/interviews/${interview.id}`}
          className="font-bold text-navy-900 hover:text-teal-600 flex items-center gap-1 group"
        >
          <span>Evaluate</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
