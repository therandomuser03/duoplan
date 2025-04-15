'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`${
          type === 'success'
            ? 'bg-green-50 text-green-800 border-green-200'
            : 'bg-red-50 text-red-800 border-red-200'
        } rounded-lg p-4 shadow-lg border flex items-center max-w-md`}
      >
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
        ) : (
          <XCircle className="h-5 w-5 text-red-400 mr-3" />
        )}
        <p className="text-sm flex-1">{message}</p>
        <button
          onClick={onClose}
          className={`ml-4 inline-flex rounded-md p-1.5 ${
            type === 'success'
              ? 'text-green-500 hover:bg-green-100'
              : 'text-red-500 hover:bg-red-100'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            type === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'
          }`}
        >
          <span className="sr-only">Dismiss</span>
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 