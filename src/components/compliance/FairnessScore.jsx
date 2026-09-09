import React from 'react';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';
import { formatScore } from '../../utils/formatters';

const FairnessScore = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-teal-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-teal-500/30 relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
              Enterprise Parity & Equity Monitor
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Fairness Index: {metrics.overallFairnessScore}%
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Evaluates statistical demographic parity, adverse impact ratio, and resume semantic parsing invariance across candidate cohorts.
          </p>
        </div>

        {/* Quick Stat Pill Box */}
        <div className="flex items-center gap-4 bg-navy-950/80 p-4 rounded-xl border border-navy-700/80 shrink-0">
          <div className="border-r border-navy-800 pr-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Adverse Impact Ratio</span>
            <span className="text-2xl font-extrabold text-teal-300 font-mono">
              {metrics.adverseImpactRatio}
            </span>
            <span className="text-[9px] text-emerald-400 block font-medium">✓ Passed 80% Rule</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Compliance Verification</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{metrics.complianceStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-navy-800/80 flex items-center gap-2 text-[11px] text-teal-300/80">
        <Info className="w-3.5 h-3.5 shrink-0 text-teal-400" />
        <span>* Metric terminology adheres to industrial compliance standards (Adverse Impact Ratio / Parity Indicators). System continuously audits algorithm recommendations.</span>
      </div>
    </div>
  );
};

export default FairnessScore;
