import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({
  message,
  type = 'success', // 'success' | 'error' | 'info'
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
  };

  const borderColors = {
    success: 'border-emerald-200 bg-white',
    error: 'border-rose-200 bg-white',
    info: 'border-sky-200 bg-white'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${borderColors[type]} max-w-md`}>
        {icons[type]}
        <p className="text-xs font-medium text-slate-800 flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
