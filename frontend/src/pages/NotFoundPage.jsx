import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-black text-slate-800 tracking-tight">404</h1>
      <p className="text-sm font-semibold text-slate-500 mt-2">Page Not Found</p>
      <Link
        to="/dashboard"
        className="mt-6 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/20 transition"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};
