import React from 'react';

const Background = ({ variant = 'animated' }) => {
  if (variant === 'professional') {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Solid professional gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"></div>
      </div>
    );
  }

  // Original animated gradient with floating blobs
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-800 to-pink-700 bg-[length:200%_200%] animate-[gradientShift_12s_ease_infinite]"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-1"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-2"></div>
      <div className="absolute top-1/3 left-1/2 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-3"></div>
      <div className="absolute bottom-1/3 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-4"></div>
      <div className="absolute top-2/3 right-20 w-56 h-56 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-1" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default Background;