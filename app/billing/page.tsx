'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Search, Download, Printer, FileText, Eye, Calendar, User, Phone, MapPin, Package, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Estimate {
  id: string;
  billingNo: string;
  date: string;
  customerName: string;
  phone: string;
  area: string;
  items: any[];
  totalAmount: number;
  gstEnabled: boolean;
  deliveryCharge?: number;
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
}

export default function BillingPage() {
  const { user, isAuthenticated } = useAuth();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'estimates' | 'invoices'>('invoices');
  const [invoices, setInvoices] = useState([]);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadEstimates();
    }
  }, [isAuthenticated]);

  const loadEstimates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/billing');
      const data = await response.json();
      setEstimates(data);
    } catch (error) {
      console.error('Error loading estimates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = (estimate: Estimate) => {
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      const subtotal = estimate.items.reduce((s: number, item: any) => s + item.amount, 0);
      const deliveryCharge = estimate.deliveryCharge || 0;
      const gstAmount = estimate.gstEnabled ? Math.round((subtotal + deliveryCharge) * 0.18 * 100) / 100 : 0;
      const cgstAmount = estimate.gstEnabled ? Math.round(gstAmount / 2 * 100) / 100 : 0;
      const sgstAmount = estimate.gstEnabled ? Math.round(gstAmount / 2 * 100) / 100 : 0;
      const finalTotal = Math.round(subtotal + deliveryCharge + gstAmount);
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>TAX INVOICE - ${estimate.billingNo}</title>
            <style>
              @page {
                margin: 15mm;
                size: A4 portrait;
              }
              body { 
                font-family: 'Segoe UI', Arial, sans-serif; 
                margin: 0; 
                padding: 20px;
                background: #f5f5f5;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .invoice-container {
                background: white;
                max-width: 800px;
                margin: 0 auto;
                padding: 30px;
                border: 2px solid #1a1a1a;
                position: relative;
              }
              .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 30px;
                border-bottom: 3px solid #1a1a1a;
                padding-bottom: 20px;
              }
              .company-section {
                flex: 1;
              }
              .company-name {
                font-size: 32px;
                font-weight: bold;
                color: #1a1a1a;
                margin: 0 0 5px 0;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              .company-tagline {
                font-size: 14px;
                color: #666;
                margin: 0 0 10px 0;
                font-weight: 600;
              }
              .company-address {
                font-size: 12px;
                color: #333;
                margin: 0 0 5px 0;
                line-height: 1.4;
              }
              .company-contact {
                font-size: 12px;
                color: #333;
                margin: 0;
                font-weight: 600;
              }
              .invoice-details {
                text-align: right;
                min-width: 200px;
              }
              .invoice-title {
                font-size: 36px;
                font-weight: bold;
                color: #1a1a1a;
                margin: 0 0 10px 0;
                text-transform: uppercase;
                letter-spacing: 3px;
                border: 3px solid #1a1a1a;
                padding: 10px 20px;
                display: inline-block;
                transform: rotate(-2deg);
              }
              .invoice-meta {
                font-size: 14px;
                margin: 10px 0;
                line-height: 1.6;
              }
              .invoice-meta strong {
                color: #1a1a1a;
                display: inline-block;
                min-width: 120px;
              }
              .billing-section {
                display: flex;
                gap: 30px;
                margin-bottom: 30px;
              }
              .billing-block {
                flex: 1;
                padding: 20px;
                border: 2px solid #ddd;
                border-radius: 8px;
              }
              .billing-block h3 {
                margin: 0 0 15px 0;
                color: #1a1a1a;
                font-size: 16px;
                text-transform: uppercase;
                border-bottom: 2px solid #1a1a1a;
                padding-bottom: 8px;
              }
              .billing-block p {
                margin: 8px 0;
                font-size: 14px;
                line-height: 1.5;
              }
              .billing-block strong {
                color: #333;
              }
              .items-table {
                width: 100%;
                border-collapse: collapse;
                margin: 30px 0;
                font-size: 12px;
              }
              .items-table th {
                background: #1a1a1a;
                color: white;
                padding: 12px 8px;
                text-align: left;
                font-weight: bold;
                text-transform: uppercase;
                border: 1px solid #1a1a1a;
              }
              .items-table td {
                padding: 10px 8px;
                border: 1px solid #ddd;
                vertical-align: top;
              }
              .items-table .text-right {
                text-align: right;
                font-family: 'Courier New', monospace;
              }
              .items-table .text-center {
                text-align: center;
              }
              .items-table tbody tr:nth-child(even) {
                background: #f9f9f9;
              }
              .totals-section {
                margin: 30px 0;
                padding: 20px;
                background: #f5f5f5;
                border: 2px solid #ddd;
                border-radius: 8px;
              }
              .totals-table {
                width: 400px;
                margin-left: auto;
                border-collapse: collapse;
              }
              .totals-table td {
                padding: 8px 12px;
                border: none;
                font-size: 14px;
              }
              .totals-table .label {
                font-weight: 600;
                color: #333;
              }
              .totals-table .amount {
                text-align: right;
                font-family: 'Courier New', monospace;
                font-weight: bold;
              }
              .totals-table .total-row {
                border-top: 3px double #1a1a1a;
                font-size: 16px;
                font-weight: bold;
                color: #1a1a1a;
              }
              .totals-table .gst-row {
                color: #0066cc;
                font-size: 13px;
              }
              .bank-details {
                margin: 30px 0;
                padding: 20px;
                background: #e8f4f8;
                border: 2px solid #0066cc;
                border-radius: 8px;
              }
              .bank-details h3 {
                margin: 0 0 15px 0;
                color: #0066cc;
                font-size: 16px;
                text-transform: uppercase;
                border-bottom: 2px solid #0066cc;
                padding-bottom: 8px;
              }
              .bank-details p {
                margin: 8px 0;
                font-size: 14px;
                line-height: 1.5;
              }
              .terms-section {
                margin: 30px 0;
                padding: 20px;
                background: #fff8e1;
                border: 2px solid #f39c12;
                border-radius: 8px;
              }
              .terms-section h3 {
                margin: 0 0 15px 0;
                color: #f39c12;
                font-size: 16px;
                text-transform: uppercase;
                border-bottom: 2px solid #f39c12;
                padding-bottom: 8px;
              }
              .terms-section ul {
                margin: 10px 0;
                padding-left: 20px;
              }
              .terms-section li {
                margin: 8px 0;
                font-size: 13px;
                line-height: 1.5;
              }
              .signature-section {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
              }
              .signature-block {
                text-align: center;
                min-width: 200px;
              }
              .signature-line {
                border-top: 2px solid #1a1a1a;
                margin: 40px 0 10px 0;
                height: 40px;
              }
              .signature-text {
                font-size: 14px;
                font-weight: bold;
                color: #1a1a1a;
              }
              .gst-number {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #0066cc;
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 12px;
                z-index: 2;
              }
              @media print {
                body {
                  background: white;
                  padding: 0;
                }
                .invoice-container {
                  box-shadow: none;
                  border-radius: 0;
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <div class="gst-number">GSTIN: 33AAJFT5678B1ZC</div>
              
              <div class="invoice-header">
                <div class="company-section">
                  <h1 class="company-name">Thoon Enterprises</h1>
                  <div class="company-tagline">Premium Construction Materials Supplier</div>
                  <p class="company-address">
                    123, Industrial Estate, Chennai - 600 001<br>
                    Tamil Nadu, India
                  </p>
                  <p class="company-contact">
                    📱 +91 97915 46123 | 📧 info@thoonenterprises.com<br>
                    🌐 www.thoonenterprises.com
                  </p>
                </div>
                <div class="invoice-details">
                  <div class="invoice-title">Tax Invoice</div>
                  <div class="invoice-meta">
                    <strong>Invoice No:</strong> ${estimate.billingNo}<br>
                    <strong>Date:</strong> ${new Date(estimate.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}<br>
                    <strong>Time:</strong> ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}<br>
                    <strong>State:</strong> Tamil Nadu (33)<br>
                    <strong>Supply State:</strong> Tamil Nadu (33)
                  </div>
                </div>
              </div>
              
              <div class="billing-section">
                <div class="billing-block">
                  <h3>Bill To Party</h3>
                  <p><strong>Name:</strong> ${estimate.customerName}</p>
                  <p><strong>Phone:</strong> ${estimate.phone}</p>
                  <p><strong>Location:</strong> ${estimate.area}</p>
                  <p><strong>State:</strong> Tamil Nadu (33)</p>
                  <p><strong>GSTIN:</strong> N/A (Unregistered)</p>
                </div>
                <div class="billing-block">
                  <h3>Shipping Details</h3>
                  <p><strong>Delivery Address:</strong> ${estimate.area}</p>
                  <p><strong>Delivery Date:</strong> As per discussion</p>
                  <p><strong>Delivery Mode:</strong> Direct Delivery</p>
                  <p><strong>Vehicle Type:</strong> As per requirement</p>
                </div>
              </div>
              
              <table class="items-table">
                <thead>
                  <tr>
                    <th width="5%">S.No</th>
                    <th width="12%">Category</th>
                    <th width="15%">Type/Brand</th>
                    <th width="10%">Size</th>
                    <th width="8%" class="text-center">Qty</th>
                    <th width="8%">Unit</th>
                    <th width="12%" class="text-right">Rate (₹)</th>
                    <th width="12%" class="text-right">Amount (₹)</th>
                    <th width="18%" class="text-right">HSN/SAC</th>
                  </tr>
                </thead>
                <tbody>
                  ${estimate.items.map((item: any, index: number) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${item.category}</td>
                      <td>${item.type || item.brand || '-'}</td>
                      <td>${item.size || '-'}</td>
                      <td class="text-center">${item.quantity}</td>
                      <td>${item.units}</td>
                      <td class="text-right">${item.rate.toFixed(2)}</td>
                      <td class="text-right">${item.amount.toFixed(2)}</td>
                      <td class="text-right">${getHSNCode(item.category)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div class="totals-section">
                <table class="totals-table">
                  <tr>
                    <td class="label">Subtotal (Taxable Value):</td>
                    <td class="amount">₹${subtotal.toFixed(2)}</td>
                  </tr>
                  ${deliveryCharge > 0 ? `
                    <tr>
                      <td class="label">Delivery & Handling:</td>
                      <td class="amount">₹${deliveryCharge.toFixed(2)}</td>
                    </tr>
                  ` : ''}
                  ${estimate.gstEnabled ? `
                    <tr class="gst-row">
                      <td class="label">CGST @ 9%:</td>
                      <td class="amount">₹${cgstAmount.toFixed(2)}</td>
                    </tr>
                    <tr class="gst-row">
                      <td class="label">SGST @ 9%:</td>
                      <td class="amount">₹${sgstAmount.toFixed(2)}</td>
                    </tr>
                    <tr class="gst-row">
                      <td class="label">Total GST:</td>
                      <td class="amount">₹${gstAmount.toFixed(2)}</td>
                    </tr>
                  ` : ''}
                  <tr class="total-row">
                    <td class="label">Invoice Total:</td>
                    <td class="amount">₹${finalTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td class="label">Amount in Words:</td>
                    <td class="amount" style="font-size: 12px;">${numberToWords(finalTotal)} Rupees Only</td>
                  </tr>
                </table>
              </div>
              
              <div class="bank-details">
                <h3>Bank Details for Payment</h3>
                <p><strong>Bank:</strong> State Bank of India</p>
                <p><strong>Account Name:</strong> Thoon Enterprises</p>
                <p><strong>Account Number:</strong> 678901234567</p>
                <p><strong>IFSC Code:</strong> SBIN0000123</p>
                <p><strong>Branch:</strong> Chennai Main Branch</p>
                <p><strong>UPI ID:</strong> thoon@paytm</p>
              </div>
              
              <div class="terms-section">
                <h3>Terms & Conditions</h3>
                <ul>
                  <li>Prices are inclusive of GST as applicable</li>
                  <li>Delivery will be made as per mutual agreement</li>
                  <li>Payment terms: 50% advance, 50% on delivery</li>
                  <li>Goods once sold will not be taken back</li>
                  <li>All disputes subject to Chennai jurisdiction</li>
                  <li>This is a computer-generated invoice</li>
                  <li>E-Way Bill will be generated if applicable</li>
                </ul>
              </div>
              
              <div class="signature-section">
                <div class="signature-block">
                  <div class="signature-line"></div>
                  <div class="signature-text">Customer Signature</div>
                </div>
                <div class="signature-block">
                  <div class="signature-line"></div>
                  <div class="signature-text">Authorized Signatory</div>
                  <div style="font-size: 12px; margin-top: 5px;">For Thoon Enterprises</div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Helper function to get HSN codes
  const getHSNCode = (category: string): string => {
    const hsnCodes: { [key: string]: string } = {
      'Cement': '2523',
      'Steel': '7308',
      'Bricks': '6901',
      'Blocks': '6801',
      'Sand': '2505',
      'Aggregate': '2517'
    };
    return hsnCodes[category] || 'N/A';
  };

  // Helper function to convert number to words
  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    const convert = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
    };
    
    return convert(num);
  };

  const filteredEstimates = estimates.filter(estimate =>
    estimate.customerName.toLowerCase().includes(search.toLowerCase()) ||
    estimate.billingNo.toLowerCase().includes(search.toLowerCase()) ||
    estimate.phone.includes(search)
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h2>
            <p className="text-slate-600 mb-6">Please log in to access billing and invoice features.</p>
            <Button onClick={() => window.location.href = '/login'} className="w-full">
              Login to Continue
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Billing & Estimates</h1>
              <p className="text-slate-600">Manage your estimates and tax invoices</p>
            </div>
            <div className="flex items-center space-x-4">
              {activeTab === 'invoices' && (
                <Button
                  onClick={() => setShowCreateInvoiceModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Invoice
                </Button>
              )}
              <div className="text-right">
                <p className="text-sm text-slate-500">Total Estimates</p>
                <p className="text-2xl font-bold text-indigo-600">{estimates.length}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{estimates.reduce((sum, est) => sum + est.totalAmount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <div className="border-b border-slate-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('estimates')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'estimates'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Estimates ({estimates.length})
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'invoices'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Invoices ({estimates.filter(est => est.status !== 'draft').length})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-slate-200">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer name, billing no, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'estimates' ? (
              <>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  </div>
                ) : filteredEstimates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No estimates found</h3>
                    <p className="text-slate-500">Get started by creating your first estimate.</p>
                    <Button
                      onClick={() => window.location.href = '/estimate'}
                      className="mt-4"
                    >
                      Create Estimate
                    </Button>
                  </div>
                ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Billing No</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Phone</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Location</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-700">GST</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-700">Amount</th>
                      <th className="text-center py-3 px-4 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEstimates.map((estimate) => (
                      <tr key={estimate.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              setSelectedEstimate(estimate);
                              setShowViewModal(true);
                            }}
                            className="font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            {estimate.billingNo}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(estimate.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-slate-900 font-medium">
                          {estimate.customerName}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{estimate.phone}</td>
                        <td className="py-3 px-4 text-slate-600">{estimate.area}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            estimate.gstEnabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {estimate.gstEnabled ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold">
                          ₹{estimate.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handlePrintInvoice(estimate)}
                              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEstimate(estimate);
                                setShowViewModal(true);
                              }}
                              className="text-slate-600 hover:text-slate-800 font-medium text-sm"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                )}
              </>
            ) : (
              /* Invoices Tab Content */
              <div className="space-y-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Premium Invoice Management</h3>
                  <p className="text-slate-500">Create and manage professional GST invoices</p>
                  <Button
                    onClick={() => setShowCreateInvoiceModal(true)}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                  >
                    Create Your First Invoice
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedEstimate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowViewModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Estimate Details - {selectedEstimate.billingNo}
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Customer Name</p>
                    <p className="font-semibold text-slate-900">{selectedEstimate.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone Number</p>
                    <p className="font-semibold text-slate-900">{selectedEstimate.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="font-semibold text-slate-900">{selectedEstimate.area}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(selectedEstimate.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">Items</p>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-2">Category</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-right p-2">Quantity</th>
                          <th className="text-right p-2">Rate</th>
                          <th className="text-right p-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEstimate.items.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{item.category}</td>
                            <td className="p-2">{item.type || '-'}</td>
                            <td className="p-2 text-right">{item.quantity}</td>
                            <td className="p-2 text-right">₹{item.rate}</td>
                            <td className="p-2 text-right font-semibold">₹{item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-slate-500">GST Status</p>
                    <p className="font-semibold">
                      {selectedEstimate.gstEnabled ? 'GST Enabled' : 'No GST'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total Amount</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      ₹{selectedEstimate.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    onClick={() => handlePrintInvoice(selectedEstimate)}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print Invoice
                  </Button>
                  <Button
                    onClick={() => setShowViewModal(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Create Premium Invoice</h2>
                <button
                  onClick={() => setShowCreateInvoiceModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-3 rounded-full hover:bg-slate-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-center py-12">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Redirecting to Invoice Page</h3>
                <p className="text-slate-600 mb-6">You'll be redirected to the advanced invoice creation page with all premium features.</p>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={() => {
                      window.location.href = '/invoices';
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Go to Invoice Page
                  </Button>
                  <Button
                    onClick={() => setShowCreateInvoiceModal(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
