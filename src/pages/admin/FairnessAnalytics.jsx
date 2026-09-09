import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import FairnessScore from '../../components/compliance/FairnessScore';
import BiasMetrics from '../../components/compliance/BiasMetrics';
import Loader from '../../components/common/Loader';
import { complianceApi } from '../../services/complianceApi';

const FairnessAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await complianceApi.getFairnessMetrics('all');
      if (res.success) {
        setMetrics(res.data);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Fairness & Parity Analytics"
        subtitle="Continuous algorithmic verification of Adverse Impact Ratio and demographic selection equalization (GET /compliance/fairness)."
      />

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <Loader size="lg" color="teal" />
        </div>
      ) : (
        <div className="space-y-8">
          <FairnessScore metrics={metrics} />
          <BiasMetrics metrics={metrics} />
        </div>
      )}
    </DashboardLayout>
  );
};

export default FairnessAnalytics;
