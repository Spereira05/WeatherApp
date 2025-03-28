'use client';
import { useState } from 'react';

//Component to catch and display errors that error during rendering

export default function ErrorBoundary({
  children
}: {
  children: React.ReactNode
}) {
  const [hasError, setHasError] = useState(false);
  
  if(hasError) {
    return (
      <div className="p-6 bg-red-50 rounded/lg text-center">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Something went wrong
        </h2>
        <p className="text-red-600 mb-4">
          We&apos;re sorry, but there was an error loading this page.
        </p>
        <button
          onClick={() => {
            setHasError(false);
            window.location.href = '/';
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Back to Home
        </button>
      </div>
    )
  }
  
  return (
    <div onError={() => setHasError(true)}>
     {children}
    </div>
  )
}