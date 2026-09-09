import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import FairnessScore from '../../components/compliance/FairnessScore';
import AuditLogTable from '../../components/compliance/AuditLogTable';
import Loader from '../../components/common/Loader';
import { complianceApi } from '../../services/complianceApi';
import { ShieldCheck, FileSpreadsheet, Activity, Cpu, ArrowRight } from 'lucide-react';

const AdminConsole = () => {
  const [fairnessMetrics, setFairnessMetrics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      const [fRes, aRes] = await Promise.all([
        complianceApi.getFairnessMetrics('all'),
        complianceApi.getAuditLogs({ limit: 5 })
      ]);
      if (fRes.success) setFairnessMetrics(fRes.data);
      if (aRes.success) setAuditLogs(aRes.data);
      setLoading(false);
    };
    loadAdminData();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="FairHire System Admin Console"
        subtitle="System health, algorithmic equity metrics, AI throughput stats, and enterprise audit logs."
      />

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader size="lg" color="teal" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* AI Metrics & Health Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-teal-50 text-teal-600 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Fairness Score</span>
                <span className="text-2xl font-extrabold text-navy-900 font-sans">{fairnessMetrics?.overallFairnessScore}%</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sky-50 text-sky-600 font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Impact Ratio</span>
                <span className="text-2xl font-extrabold text-navy-900 font-mono">{fairnessMetrics?.adverseImpactRatio}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">AI Evaluated</span>
                <span className="text-2xl font-extrabold text-navy-900 font-sans">{fairnessMetrics?.totalCandidatesEvaluated}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Audit Events</span>
                <span className="text-2xl font-extrabold text-navy-900 font-sans">{auditLogs.length} Records</span>
              </div>
            </div>
          </div>

          {/* Fairness Banner */}
          <FairnessScore metrics={fairnessMetrics} />

          {/* Audit Log Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-navy-900">Recent Audit Log Events</h3>
              <Link to="/admin/audit-logs" className="text-xs font-bold text-teal-600 hover:text-navy-900 flex items-center gap-1">
                <span>View Full Audit Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <AuditLogTable logs={auditLogs.slice(0, 5)} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminConsole;
