'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Something went wrong!
        </h1>
        <p className="text-lg leading-8 text-gray-600">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 outline outline-offset-2 outline-indigo-600"
            >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
} 