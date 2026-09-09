import React, { useState } from 'react';
import { Sparkles, HelpCircle, CheckSquare, Layers } from 'lucide-react';
import Badge from '../common/Badge';

const InterviewQuestions = ({ prompts = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(prompts.map(p => p.category))];

  const filteredPrompts = activeCategory === 'All'
    ? prompts
    : prompts.filter(p => p.category === activeCategory);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-navy-900 to-teal-900 text-teal-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-navy-900">AI Contextual Interview Prompts</h4>
            <p className="text-xs text-slate-500">
              Fetched via <code className="text-teal-600 font-mono bg-teal-50 px-1 py-0.5 rounded">GET /interviews/llm-prompts</code> (Backend Generated)
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeCategory === cat
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Accordion / List */}
      <div className="space-y-4">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-teal-300 transition-colors">
              <div className="flex items-center justify-between">
                <Badge variant="teal" size="sm">
                  {item.category}
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">Question #{idx + 1}</span>
              </div>

              <h5 className="text-sm font-bold text-navy-900 leading-snug flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{item.question}</span>
              </h5>

              {item.evaluationCriteria && (
                <div className="p-3 rounded-lg bg-white border border-slate-200/60 text-xs text-slate-600 flex items-start gap-2 mt-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block text-[11px] uppercase tracking-wider">Evaluation Focus:</strong>
                    <span>{item.evaluationCriteria}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-6">No interview prompts available for category "{activeCategory}".</p>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestions;
