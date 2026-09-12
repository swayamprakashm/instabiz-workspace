import React from 'react';

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="h-10 w-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
    <p className="text-sm text-gray-500">Generating your AI storefront...</p>
  </div>
);

export default LoadingState;
