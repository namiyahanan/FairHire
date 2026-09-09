import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while communicating with the service.',
  onRetry = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-rose-50/50 border border-rose-200 rounded-2xl ${className}`}>
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-rose-900 mb-1">{title}</h4>
      <p className="text-xs text-rose-700 max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
