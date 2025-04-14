'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#ffffff',
          color: '#1f2937',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '0.5rem',
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#059669',
            secondary: '#ffffff',
          },
          style: {
            borderLeft: '4px solid #059669',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#dc2626',
            secondary: '#ffffff',
          },
          style: {
            borderLeft: '4px solid #dc2626',
          },
        },
      }}
    />
  );
} 