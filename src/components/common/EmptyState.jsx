import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There is no data to display at this time.',
  actionLabel = '',
  onAction = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-slate-200 rounded-2xl ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-navy-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
