import React from 'react';
import { BarChart3, HelpCircle, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge';

const BiasMetrics = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Parity Indicators Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-teal-600" />
          Algorithmic Parity Indicators
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.parityMetrics?.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {item.category}
                </span>
                <h5 className="text-xs font-bold text-navy-900 mt-0.5">{item.metric}</h5>
              </div>

              <div className="text-right">
                <span className="text-lg font-extrabold text-teal-600 font-mono block">
                  {item.ratio}
                </span>
                <Badge variant="success" size="sm">
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Demographic Impact Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-4">
          Demographic Cohort Selection Analysis
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Cohort Group</th>
                <th className="py-3 px-4">Applicant Pool Share</th>
                <th className="py-3 px-4">Shortlist Share</th>
                <th className="py-3 px-4">Adverse Impact Ratio</th>
                <th className="py-3 px-4 text-right">Equivalence Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {metrics.demographicBreakdown?.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-navy-900">{row.group}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.applicantShare}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.shortlistShare}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-600">{row.impactRatio}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Balanced
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BiasMetrics;
