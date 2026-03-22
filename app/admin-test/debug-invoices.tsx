'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function DebugInvoicesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [invoiceFormat, setInvoiceFormat] = useState<'gst' | 'non-gst'>('gst');

  console.log('DebugInvoicesPage rendered');
  console.log('showCreateModal:', showCreateModal);
  console.log('invoiceFormat:', invoiceFormat);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start bg-gradient-to-r from-emerald-600/20 to-green-600/20 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_32px_rgba(16,185,129,0.15)] border border-emerald-500/30">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Sales Invoices (DEBUG)</h1>
          <p className="text-emerald-100 font-medium ml-4 text-sm">DEBUG VERSION - Manage customer invoices with GST and non-GST formats</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600/30">
            <label className="text-slate-300 text-sm">Format:</label>
            <select
              value={invoiceFormat}
              onChange={(e) => {
                console.log('Format changed to:', e.target.value);
                setInvoiceFormat(e.target.value as 'gst' | 'non-gst');
              }}
              className="bg-slate-600/50 border border-slate-500/30 rounded text-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="gst">GST Invoice</option>
              <option value="non-gst">Non-GST Invoice</option>
            </select>
          </div>
          <button
            onClick={() => {
              console.log('Create Invoice button clicked!');
              setShowCreateModal(true);
            }}
            className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Invoice (DEBUG)
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-2">Debug Information</h2>
        <p className="text-slate-300">showCreateModal: {showCreateModal.toString()}</p>
        <p className="text-slate-300">invoiceFormat: {invoiceFormat}</p>
      </div>

      {/* Simple Content */}
      <div className="bg-slate-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">Invoices List</h2>
        <p className="text-slate-300">No invoices to display. Click "Create Invoice (DEBUG)" to test the button.</p>
      </div>

      {/* Debug Modal */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            console.log('Modal backdrop clicked');
            setShowCreateModal(false);
          }}
        >
          <div 
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-600/30"
            onClick={(e) => {
              console.log('Modal content clicked');
              e.stopPropagation();
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">DEBUG MODAL - Create New Invoice</h2>
                <button
                  onClick={() => {
                    console.log('Close modal clicked');
                    setShowCreateModal(false);
                  }}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700"
                >
                  ✕
                </button>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-white">This is a debug modal to test if the button works!</p>
                <p className="text-slate-300 mt-2">If you can see this modal, the Create Invoice button is working correctly.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
