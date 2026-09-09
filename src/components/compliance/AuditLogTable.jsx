import React, { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Badge from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';
import { Search, Filter, Shield } from 'lucide-react';

const AuditLogTable = ({ logs = [], onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (onFilterChange) onFilterChange({ search: val, role: roleFilter });
  };

  const handleRoleChange = (e) => {
    const val = e.target.value;
    setRoleFilter(val);
    if (onFilterChange) onFilterChange({ search, role: val });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search audit logs by actor, action, resource..."
            value={search}
            onChange={handleSearchChange}
            icon={Search}
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            value={roleFilter}
            onChange={handleRoleChange}
            options={[
              { label: 'All User Roles', value: 'all' },
              { label: 'Candidate', value: 'candidate' },
              { label: 'Recruiter', value: 'recruiter' },
              { label: 'Interviewer', value: 'interviewer' },
              { label: 'Admin', value: 'admin' },
              { label: 'System AI Engine', value: 'system' }
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Actor</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">Resource Target</th>
              <th className="py-3.5 px-4">Candidate ID</th>
              <th className="py-3.5 px-4">Job ID</th>
              <th className="py-3.5 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-bold text-navy-900">{log.actor}</td>
                  <td className="py-3 px-4">
                    <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">{log.action}</td>
                  <td className="py-3 px-4 text-slate-600">{log.resource}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{log.candidateId}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{log.jobId}</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={log.status === 'SUCCESS' ? 'success' : 'error'} size="sm">
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400">
                  No audit log entries match the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogTable;
