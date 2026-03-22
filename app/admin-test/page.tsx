'use client';

import React from 'react';
import DebugInvoicesPage from './debug-invoices';
import InvoicesPage from '@/components/features/InvoicesPage';

export default function AdminTestPage() {
  const [showOriginal, setShowOriginal] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Admin Test - Invoices Page</h1>
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <p className="text-slate-300 mb-4">This is a test page to verify the InvoicesPage component works correctly.</p>
          <p className="text-slate-300 mb-4">You should see the Create Invoice button in the header below.</p>
          <p className="text-yellow-400 mb-2">🔍 DEBUG VERSION - Check browser console for logs</p>
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showOriginal ? 'Show Debug Version' : 'Show Original Version'}
          </button>
        </div>
        {showOriginal ? <InvoicesPage /> : <DebugInvoicesPage />}
      </div>
    </div>
  );
}
