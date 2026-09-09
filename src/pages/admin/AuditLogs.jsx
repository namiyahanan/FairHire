import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import AuditLogTable from '../../components/compliance/AuditLogTable';
import Loader from '../../components/common/Loader';
import { complianceApi } from '../../services/complianceApi';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (params = {}) => {
    setLoading(true);
    const res = await complianceApi.getAuditLogs(params);
    if (res.success) {
      setLogs(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Enterprise System Audit Logs"
        subtitle="Complete chronological audit trail tracking user authentication, status modifications, and AI evaluations (GET /admin/audit-log)."
      />

      {loading && logs.length === 0 ? (
        <div className="h-96 flex items-center justify-center">
          <Loader size="lg" color="teal" />
        </div>
      ) : (
        <AuditLogTable logs={logs} onFilterChange={fetchLogs} />
      )}
    </DashboardLayout>
  );
};

export default AuditLogs;
