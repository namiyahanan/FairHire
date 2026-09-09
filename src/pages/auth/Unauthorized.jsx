import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-navy-900">Access Denied</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          You do not have permission to access this role portal. Please switch roles in the topbar or sign in with an authorized account.
        </p>

        <div className="pt-2">
          <Link to="/login">
            <Button variant="primary" size="md" icon={ArrowLeft} className="w-full">
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
