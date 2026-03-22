'use client';

import React, { useState, useEffect } from 'react';
import { 
    BarChart3, 
    Users, 
    DollarSign, 
    TrendingUp, 
    Settings, 
    Shield,
    Activity,
    FileText,
    Clock,
    Check,
    CheckCircle,
    AlertCircle,
    Wrench,
    ShoppingCart,
    Package,
    Truck,
    ChevronDown,
    ChevronRight,
    Search,
    Eye,
    Trash2,
    Loader2,
    Plus,
    Save,
    Printer,
    User,
    Phone,
    MapPin,
    X,
    Edit,
    Download
} from 'lucide-react';
import EstimatesPage from './EstimatesPage';
import InvoicesPage from './InvoicesPage';
import { Card, CardBody } from '@/components/ui/Card';
import { CATEGORIES, GST_RATE, BRANDS } from '@/lib/billingData';

// Estimates List Content Component
function EstimatesListContent({ estimates, setEstimates, search, setSearch, categoryFilter, setCategoryFilter, selectedEstimate, setSelectedEstimate, showViewModal, setShowViewModal, loading, setLoading, loadEstimates, handlePrintEstimate }: {
    estimates: any[];
    setEstimates: (estimates: any[]) => void;
    search: string;
    setSearch: (search: string) => void;
    categoryFilter: string;
    setCategoryFilter: (filter: string) => void;
    selectedEstimate: any;
    setSelectedEstimate: (estimate: any) => void;
    showViewModal: boolean;
    setShowViewModal: (show: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    loadEstimates: () => void;
    handlePrintEstimate: (estimate: any, isRough?: boolean) => void;
}) {

    useEffect(() => {
        loadEstimates();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`/api/billing/search?search=${search}&category=${categoryFilter}`);
            const data = await response.json();
            setEstimates(data);
        } catch (error) {
            console.error('Error searching estimates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (estimate: any) => {
        setSelectedEstimate(estimate);
        setShowViewModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this estimate?')) {
            try {
                await fetch(`/api/billing/${id}`, { method: 'DELETE' });
                loadEstimates();
            } catch (error) {
                console.error('Error deleting estimate:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-200/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#caa75e]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-8 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
                        <h1 className="text-3xl font-bold text-[#1f2a30] uppercase tracking-tight">View Estimates</h1>
                    </div>
                    <p className="text-slate-600 font-medium ml-4 text-sm">Manage and search all billing estimates.</p>
                </div>
            </div>

            <Card className="hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl">
                <CardBody className="p-6">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by customer name, billing no, or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] bg-white/80"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] bg-white/80"
                        >
                            <option value="">All Categories</option>
                            {Object.keys(CATEGORIES).map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="bg-[#caa75e] hover:bg-[#b89653] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-[0_4px_16px_rgba(202,167,94,0.3)]"
                        >
                            Search
                        </button>
                    </form>

                    {/* Estimates Table */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#caa75e]"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-4 py-3 text-left font-medium text-slate-700">Billing No</th>
                                        <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
                                        <th className="px-4 py-3 text-left font-medium text-slate-700">Customer</th>
                                        <th className="px-4 py-3 text-left font-medium text-slate-700">Phone</th>
                                        <th className="px-4 py-3 text-left font-medium text-slate-700">Location</th>
                                        <th className="px-4 py-3 text-center font-medium text-slate-700">GST</th>
                                        <th className="px-4 py-3 text-right font-medium text-slate-700">Amount</th>
                                        <th className="px-4 py-3 text-center font-medium text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {estimates.map((est) => (
                                        <tr key={est.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleView(est)}
                                                    className="font-medium text-[#caa75e] hover:text-[#b89653]"
                                                >
                                                    {est.billingNo}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {new Date(est.date).toLocaleDateString('en-IN')}
                                            </td>
                                            <td className="px-4 py-3 text-slate-900 font-medium">
                                                {est.customerName}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{est.phone}</td>
                                            <td className="px-4 py-3 text-slate-600">{est.area}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    est.gstEnabled
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                    {est.gstEnabled ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono font-semibold">
                                                ₹{est.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handlePrintEstimate(est, false)}
                                                        className="text-[#caa75e] hover:text-[#b89653] font-medium text-sm"
                                                    >
                                                        <Printer className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleView(est)}
                                                        className="text-slate-600 hover:text-slate-800 font-medium text-sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(est.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* View Modal */}
            {showViewModal && selectedEstimate && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    onClick={() => setShowViewModal(false)}
                >
                    <div 
                        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">
                                    Estimate Details - {selectedEstimate.billingNo}
                                </h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="px-6 py-6 border-b border-slate-200 bg-slate-50 rounded-xl mb-6">
                                <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Customer Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-600">Customer Name</p>
                                        <p className="font-semibold text-slate-800">{selectedEstimate.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Phone Number</p>
                                        <p className="font-semibold text-slate-800">{selectedEstimate.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-600">Location</p>
                                        <p className="font-semibold text-slate-800">{selectedEstimate.area}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-6 border-b border-slate-200 bg-slate-50 rounded-xl mb-6">
                                <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Billing Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-100">
                                                <th className="px-3 py-2 text-left font-medium text-slate-700">S.No</th>
                                                <th className="px-3 py-2 text-left font-medium text-slate-700">Category</th>
                                                <th className="px-3 py-2 text-left font-medium text-slate-700">Type</th>
                                                <th className="px-3 py-2 text-left font-medium text-slate-700">Brand</th>
                                                <th className="px-3 py-2 text-left font-medium text-slate-700">Size</th>
                                                <th className="px-3 py-2 text-center font-medium text-slate-700">Qty</th>
                                                <th className="px-3 py-2 text-left font-medium text-slate-700">Units</th>
                                                <th className="px-3 py-2 text-right font-medium text-slate-700">Rate</th>
                                                <th className="px-3 py-2 text-right font-medium text-slate-700">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedEstimate.items.map((item: any, index: number) => (
                                                <tr key={index} className="border-b border-slate-100">
                                                    <td className="px-3 py-2">{index + 1}</td>
                                                    <td className="px-3 py-2">{item.category}</td>
                                                    <td className="px-3 py-2">{item.type || '-'}</td>
                                                    <td className="px-3 py-2">{item.brand || '-'}</td>
                                                    <td className="px-3 py-2">{item.size || '-'}</td>
                                                    <td className="px-3 py-2 text-center">{item.quantity}</td>
                                                    <td className="px-3 py-2">{item.units}</td>
                                                    <td className="px-3 py-2 text-right font-mono">₹{item.rate}</td>
                                                    <td className="px-3 py-2 text-right font-mono font-semibold">₹{item.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="px-6 py-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl mb-6">
                                <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Billing Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Subtotal</span>
                                        <span className="font-mono font-semibold text-slate-800">₹{selectedEstimate.items.reduce((sum: number, item: any) => sum + item.amount, 0).toFixed(2)}</span>
                                    </div>
                                    {selectedEstimate.deliveryCharge > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Delivery Charge</span>
                                            <span className="font-mono font-semibold text-slate-800">₹{selectedEstimate.deliveryCharge.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {selectedEstimate.gstEnabled && (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600">CGST (9%)</span>
                                                <span className="font-mono font-semibold text-slate-800">₹{(selectedEstimate.items.reduce((sum: number, item: any) => sum + item.amount, 0) * 0.09).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600">SGST (9%)</span>
                                                <span className="font-mono font-semibold text-slate-800">₹{(selectedEstimate.items.reduce((sum: number, item: any) => sum + item.amount, 0) * 0.09).toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="h-px bg-slate-300 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-900">Total Amount</span>
                                        <span className="font-mono font-bold text-xl text-indigo-600">₹{selectedEstimate.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => handlePrintEstimate(selectedEstimate, false)}
                                    className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg"
                                >
                                    <Printer className="h-4 w-4" />
                                    Print Tax Invoice
                                </button>
                                <button
                                    onClick={() => handlePrintEstimate(selectedEstimate, true)}
                                    className="flex items-center gap-2 bg-amber-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-700 shadow-lg"
                                >
                                    <FileText className="h-4 w-4" />
                                    Rough Invoice
                                </button>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="flex items-center gap-2 bg-slate-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-700 shadow-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export function AdminDashboard() {
    const [expandedSections, setExpandedSections] = useState<string[]>(['dashboard']);
    const [activeSection, setActiveSection] = useState<string>('overview');
    
    // Admin data states
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Billing & Estimates states
    const [estimates, setEstimates] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [selectedEstimate, setSelectedEstimate] = useState<any>(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // Load estimates when component mounts
    useEffect(() => {
        if (activeSection === 'estimates' || activeSection === 'invoices') {
            loadEstimates();
        }
    }, [activeSection]);

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

    const handlePrintEstimate = (estimate: any, isRough = false) => {
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
            const subtotal = estimate.items.reduce((s: number, item: any) => s + item.amount, 0);
            const deliveryCharge = estimate.deliveryCharge || 0;
            const gstAmount = estimate.gstEnabled ? Math.round((subtotal + deliveryCharge) * 0.18 * 100) / 100 : 0;
            const cgstAmount = estimate.gstEnabled ? Math.round(gstAmount / 2 * 100) / 100 : 0;
            const sgstAmount = estimate.gstEnabled ? Math.round(gstAmount / 2 * 100) / 100 : 0;
            const finalTotal = Math.round(subtotal + deliveryCharge + gstAmount);
            
            printWindow.document.write(`
                <html>
                    <head>
                        <title>TAX INVOICE - ${estimate.billingNo}</title>
                        <style>
                            @page { margin: 15mm; size: A4 portrait; }
                            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; }
                            .invoice-container { background: white; max-width: 800px; margin: 0 auto; padding: 30px; border: 2px solid #1a1a1a; }
                            .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #1a1a1a; padding-bottom: 20px; }
                            .company-name { font-size: 32px; font-weight: bold; color: #1a1a1a; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 2px; }
                            .invoice-title { font-size: 36px; font-weight: bold; color: #1a1a1a; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 3px; border: 3px solid #1a1a1a; padding: 10px 20px; display: inline-block; transform: rotate(-2deg); }
                            .billing-section { display: flex; gap: 30px; margin-bottom: 30px; }
                            .billing-block { flex: 1; padding: 20px; border: 2px solid #ddd; border-radius: 8px; }
                            .billing-block h3 { margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px; text-transform: uppercase; border-bottom: 2px solid #1a1a1a; padding-bottom: 8px; }
                            .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; font-size: 12px; }
                            .items-table th { background: #1a1a1a; color: white; padding: 12px 8px; text-align: left; font-weight: bold; text-transform: uppercase; border: 1px solid #1a1a1a; }
                            .items-table td { padding: 10px 8px; border: 1px solid #ddd; vertical-align: top; }
                            .items-table .text-right { text-align: right; font-family: 'Courier New', monospace; }
                            .totals-section { margin: 30px 0; padding: 20px; background: #f5f5f5; border: 2px solid #ddd; border-radius: 8px; }
                            .totals-table { width: 400px; margin-left: auto; border-collapse: collapse; }
                            .totals-table td { padding: 8px 12px; border: none; font-size: 14px; }
                            .totals-table .label { font-weight: 600; color: #333; }
                            .totals-table .amount { text-align: right; font-family: 'Courier New', monospace; font-weight: bold; }
                            .totals-table .total-row { border-top: 3px double #1a1a1a; font-size: 16px; font-weight: bold; color: #1a1a1a; }
                            .gst-number { position: absolute; top: 10px; right: 10px; background: #0066cc; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 12px; }
                        </style>
                    </head>
                    <body>
                        <div class="invoice-container">
                            <div class="gst-number">GSTIN: 33AAJFT5678B1ZC</div>
                            <div class="invoice-header">
                                <div class="company-section">
                                    <h1 class="company-name">Thoon Enterprises</h1>
                                    <div>Premium Construction Materials Supplier</div>
                                    <p>123, Industrial Estate, Chennai - 600 001<br>Tamil Nadu, India</p>
                                    <p>📱 +91 97915 46123 | 📧 info@thoonenterprises.com</p>
                                </div>
                                <div class="invoice-details">
                                    <div class="invoice-title">Tax Invoice</div>
                                    <div><strong>Invoice No:</strong> ${estimate.billingNo}</div>
                                    <div><strong>Date:</strong> ${new Date(estimate.date).toLocaleDateString('en-IN')}</div>
                                </div>
                            </div>
                            <div class="billing-section">
                                <div class="billing-block">
                                    <h3>Bill To Party</h3>
                                    <p><strong>Name:</strong> ${estimate.customerName}</p>
                                    <p><strong>Phone:</strong> ${estimate.phone}</p>
                                    <p><strong>Location:</strong> ${estimate.area}</p>
                                    <p><strong>GSTIN:</strong> N/A (Unregistered)</p>
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
                                        <tr>
                                            <td class="label">CGST @ 9%:</td>
                                            <td class="amount">₹${cgstAmount.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td class="label">SGST @ 9%:</td>
                                            <td class="amount">₹${sgstAmount.toFixed(2)}</td>
                                        </tr>
                                    ` : ''}
                                    <tr class="total-row">
                                        <td class="label">Invoice Total:</td>
                                        <td class="amount">₹${finalTotal.toFixed(2)}</td>
                                    </tr>
                                </table>
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

    // Filter estimates for search
    const filteredEstimates = estimates.filter((estimate: any) =>
        estimate.customerName.toLowerCase().includes(search.toLowerCase()) ||
        estimate.billingNo.toLowerCase().includes(search.toLowerCase()) ||
        estimate.phone.includes(search)
    );

    // Type definitions
    interface User {
        id: number;
        name: string;
        email: string;
        phone: string;
        type: 'buyer' | 'seller';
        status: 'active' | 'pending' | 'inactive';
        joinDate: string;
        totalOrders: number;
    }

    interface Order {
        id: number;
        orderNo: string;
        customerName: string;
        items: number;
        total: number;
        status: 'pending' | 'processing' | 'completed';
        date: string;
        deliveryDate: string;
    }

    interface Report {
        id: number;
        name: string;
        type: 'sales' | 'inventory' | 'financial';
        date: string;
        size: string;
        generatedBy: string;
    }

    interface Notification {
        id: number;
        title: string;
        message: string;
        type: 'order' | 'inventory' | 'payment';
        read: boolean;
        date: string;
    }

    interface Analytics {
        totalRevenue: number;
        totalOrders: number;
        totalUsers: number;
        conversionRate: number;
        avgOrderValue: number;
        topProducts: string[];
        monthlyRevenue: number[];
        userGrowth: number[];
    }

    interface Settings {
        siteName: string;
        email: string;
        phone: string;
        address: string;
        gstEnabled: boolean;
        gstNumber: string;
        currency: string;
        timezone: string;
        emailNotifications: boolean;
        smsNotifications: boolean;
    }

    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [analytics, setAnalytics] = useState<Analytics>({} as Analytics);
    const [reports, setReports] = useState<Report[]>([]);
    const [settings, setSettings] = useState<Settings>({} as Settings);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load initial data
    useEffect(() => {
        loadUsers();
        loadOrders();
        loadAnalytics();
        loadReports();
        loadSettings();
        loadNotifications();
    }, []);

    // Data loading functions
    const loadUsers = async () => {
        try {
            // Mock data - replace with actual API call
            const mockUsers: User[] = [
                { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '9876543210', type: 'buyer', status: 'active', joinDate: '2024-01-15', totalOrders: 12 },
                { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543211', type: 'seller', status: 'pending', joinDate: '2024-01-20', totalOrders: 8 },
                { id: 3, name: 'Amit Patel', email: 'amit@example.com', phone: '9876543212', type: 'buyer', status: 'active', joinDate: '2024-02-01', totalOrders: 15 },
                { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', phone: '9876543213', type: 'seller', status: 'active', joinDate: '2024-02-10', totalOrders: 6 },
            ];
            setUsers(mockUsers);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadOrders = async () => {
        try {
            // Mock data - replace with actual API call
            const mockOrders: Order[] = [
                { id: 1, orderNo: 'ORD-001', customerName: 'Rahul Kumar', items: 5, total: 25000, status: 'pending', date: '2024-03-01', deliveryDate: '2024-03-05' },
                { id: 2, orderNo: 'ORD-002', customerName: 'Priya Sharma', items: 3, total: 18000, status: 'completed', date: '2024-03-02', deliveryDate: '2024-03-04' },
                { id: 3, orderNo: 'ORD-003', customerName: 'Amit Patel', items: 8, total: 42000, status: 'processing', date: '2024-03-03', deliveryDate: '2024-03-08' },
            ];
            setOrders(mockOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const loadAnalytics = async () => {
        try {
            // Mock analytics data
            const mockAnalytics: Analytics = {
                totalRevenue: 1234567,
                totalOrders: 456,
                totalUsers: 1234,
                conversionRate: 3.2,
                avgOrderValue: 2700,
                topProducts: ['Cement', 'Steel', 'Bricks'],
                monthlyRevenue: [45000, 52000, 48000, 61000, 58000, 67000],
                userGrowth: [120, 135, 142, 158, 171, 189],
            };
            setAnalytics(mockAnalytics);
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    };

    const loadReports = async () => {
        try {
            const mockReports: Report[] = [
                { id: 1, name: 'Sales Report - March 2024', type: 'sales', date: '2024-03-31', size: '2.4 MB', generatedBy: 'Admin' },
                { id: 2, name: 'Inventory Report - Q1 2024', type: 'inventory', date: '2024-03-31', size: '1.8 MB', generatedBy: 'Admin' },
                { id: 3, name: 'Financial Report - March 2024', type: 'financial', date: '2024-03-31', size: '3.1 MB', generatedBy: 'Admin' },
            ];
            setReports(mockReports);
        } catch (error) {
            console.error('Error loading reports:', error);
        }
    };

    const loadSettings = async () => {
        try {
            const mockSettings: Settings = {
                siteName: 'Thoon Enterprises',
                email: 'admin@thoon.com',
                phone: '+91-9876543210',
                address: 'Chennai, Tamil Nadu',
                gstEnabled: true,
                gstNumber: '33AAAPL1234C1ZV',
                currency: 'INR',
                timezone: 'Asia/Kolkata',
                emailNotifications: true,
                smsNotifications: false,
            };
            setSettings(mockSettings);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const loadNotifications = async () => {
        try {
            const mockNotifications: Notification[] = [
                { id: 1, title: 'New Order Received', message: 'Order ORD-004 from Customer', type: 'order', read: false, date: '2024-03-15 10:30 AM' },
                { id: 2, title: 'Low Stock Alert', message: 'Cement stock below threshold', type: 'inventory', read: true, date: '2024-03-15 09:15 AM' },
                { id: 3, title: 'Payment Received', message: 'Payment for ORD-002 received', type: 'payment', read: false, date: '2024-03-15 08:45 AM' },
            ];
            setNotifications(mockNotifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const menuSections = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: BarChart3,
            children: [
                { id: 'overview', title: 'Overview', icon: Activity },
                { id: 'analytics', title: 'Analytics', icon: TrendingUp },
                { id: 'reports', title: 'Reports', icon: FileText }
            ]
        },
        {
            id: 'users',
            title: 'User Management',
            icon: Users,
            children: [
                { id: 'buyers', title: 'Buyers', icon: User },
                { id: 'sellers', title: 'Sellers', icon: Users },
                { id: 'pending', title: 'Pending Approvals', icon: Clock }
            ]
        },
        {
            id: 'billing',
            title: 'Billing & Estimates',
            icon: DollarSign,
            children: [
                { id: 'professional-estimate', title: 'Professional Estimate', icon: FileText },
                { id: 'estimates', title: 'View Estimates', icon: ShoppingCart }
            ]
        },
        {
            id: 'orders',
            title: 'Order Management',
            icon: Package,
            children: [
                { id: 'all-orders', title: 'All Orders', icon: Package },
                { id: 'pending-orders', title: 'Pending Orders', icon: Clock },
                { id: 'completed-orders', title: 'Completed Orders', icon: Check }
            ]
        },
        {
            id: 'reports',
            title: 'Reports',
            icon: TrendingUp,
            children: [
                { id: 'sales-report', title: 'Sales Report', icon: TrendingUp },
                { id: 'inventory-report', title: 'Inventory Report', icon: Package },
                { id: 'financial-report', title: 'Financial Report', icon: DollarSign }
            ]
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: Settings,
            children: [
                { id: 'general', title: 'General Settings', icon: Settings },
                { id: 'notifications', title: 'Notifications', icon: FileText },
                { id: 'security', title: 'Security', icon: Shield }
            ]
        }
    ];

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => 
            prev.includes(sectionId) 
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
        setActiveSection(sectionId);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_32px_rgba(59,130,246,0.15)] border border-blue-500/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Dashboard Overview</h1>
                                </div>
                                <p className="text-blue-100 font-medium ml-4 text-sm">Complete overview of your business operations</p>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                                    <span className="text-sm text-blue-100">Live Data</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-md p-6 rounded-xl border border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/25 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <Users className="h-8 w-8 text-cyan-400" />
                                    <span className="text-xs font-bold text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded-full border border-cyan-400/30">+12%</span>
                                </div>
                                <h3 className="text-2xl font-bold text-cyan-100">{analytics.totalUsers || 1234}</h3>
                                <p className="text-sm text-cyan-300">Total Users</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-md p-6 rounded-xl border border-emerald-400/30 hover:shadow-xl hover:shadow-emerald-500/25 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <ShoppingCart className="h-8 w-8 text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-400/30">+8%</span>
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-100">{analytics.totalOrders || 456}</h3>
                                <p className="text-sm text-emerald-300">Total Orders</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-violet-500/20 to-purple-600/20 backdrop-blur-md p-6 rounded-xl border border-violet-400/30 hover:shadow-xl hover:shadow-violet-500/25 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <FileText className="h-8 w-8 text-violet-400" />
                                    <span className="text-xs font-bold text-violet-300 bg-violet-500/20 px-2 py-1 rounded-full border border-violet-400/30">+15%</span>
                                </div>
                                <h3 className="text-2xl font-bold text-violet-100">{estimates.length}</h3>
                                <p className="text-sm text-violet-300">Estimates</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-md p-6 rounded-xl border border-amber-400/30 hover:shadow-xl hover:shadow-amber-500/25 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <DollarSign className="h-8 w-8 text-amber-400" />
                                    <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-1 rounded-full border border-amber-400/30">+20%</span>
                                </div>
                                <h3 className="text-2xl font-bold text-amber-100">₹{((analytics.totalRevenue || 1234567) / 100000).toFixed(1)}L</h3>
                                <p className="text-sm text-amber-300">Revenue</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-6 rounded-xl border border-slate-600/30 hover:shadow-xl hover:shadow-slate-500/25 transition-all">
                                <h3 className="text-lg font-bold text-cyan-100 mb-4 flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-cyan-400" />
                                    Recent Orders
                                </h3>
                                <div className="space-y-3">
                                    {orders.slice(0, 5).map((order: any) => (
                                        <div key={order.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/20 hover:bg-slate-700/50 transition-all">
                                            <div>
                                                <p className="font-medium text-cyan-100">{order.orderNo}</p>
                                                <p className="text-sm text-slate-400">{order.customerName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono font-semibold text-emerald-400">₹{order.total.toLocaleString()}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' :
                                                    order.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' :
                                                    'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-6 rounded-xl border border-slate-600/30 hover:shadow-xl hover:shadow-slate-500/25 transition-all">
                                <h3 className="text-lg font-bold text-violet-100 mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-violet-400" />
                                    Recent Estimates
                                </h3>
                                <div className="space-y-3">
                                    {estimates.slice(0, 5).map((estimate: any) => (
                                        <div key={estimate.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/20 hover:bg-slate-700/50 transition-all">
                                            <div>
                                                <p className="font-medium text-violet-100">{estimate.billingNo}</p>
                                                <p className="text-sm text-slate-400">{estimate.customerName}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono font-semibold text-amber-400">₹{estimate.totalAmount.toLocaleString()}</p>
                                                <span className="text-xs text-slate-400">{new Date(estimate.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'analytics':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-200/60">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1f2a30] uppercase tracking-tight">Analytics</h1>
                                <p className="text-slate-600 font-medium ml-4 text-sm">Detailed business analytics and insights</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="hover:shadow-xl transition-all">
                                <CardBody className="p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue Overview</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">Total Revenue</span>
                                            <span className="font-bold text-xl text-green-600">₹{(analytics.totalRevenue || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">Average Order Value</span>
                                            <span className="font-bold text-slate-900">₹{(analytics.avgOrderValue || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">Conversion Rate</span>
                                            <span className="font-bold text-slate-900">{analytics.conversionRate || 0}%</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="hover:shadow-xl transition-all">
                                <CardBody className="p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Top Products</h3>
                                    <div className="space-y-3">
                                        {(analytics.topProducts || ['Cement', 'Steel', 'Bricks']).map((product: string, index: number) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <span className="font-medium text-slate-900">{product}</span>
                                                <span className="text-sm text-slate-600">#{index + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                );

            case 'buyers':
            case 'sellers':
                const userType = activeSection === 'buyers' ? 'buyer' : 'seller';
                const filteredUsers = users.filter((user: any) => user.type === userType);
                
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-200/60">
                            <div>
                                <h1 className="text-3xl font-bold text-[#1f2a30] uppercase tracking-tight">
                                    {userType === 'buyer' ? 'Buyers' : 'Sellers'}
                                </h1>
                                <p className="text-slate-600 font-medium ml-4 text-sm">Manage all {userType}s in the system</p>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Add {userType}
                            </button>
                        </div>

                        <Card className="hover:shadow-xl transition-all">
                            <CardBody className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left py-3 px-4 font-medium text-slate-700">Name</th>
                                                <th className="text-left py-3 px-4 font-medium text-slate-700">Email</th>
                                                <th className="text-left py-3 px-4 font-medium text-slate-700">Phone</th>
                                                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                                                <th className="text-left py-3 px-4 font-medium text-slate-700">Orders</th>
                                                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user: any) => (
                                                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <User className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <span className="font-medium text-slate-900">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-600">{user.email}</td>
                                                    <td className="py-3 px-4 text-slate-600">{user.phone}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                                                            user.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-slate-600">{user.totalOrders}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex gap-2">
                                                            <button className="text-blue-600 hover:text-blue-800">
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                            <button className="text-amber-600 hover:text-amber-800">
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                );

            case 'estimates':
                return <EstimatesListContent 
                    estimates={estimates}
                    setEstimates={setEstimates}
                    search={search}
                    setSearch={setSearch}
                    categoryFilter={categoryFilter}
                    setCategoryFilter={setCategoryFilter}
                    selectedEstimate={selectedEstimate}
                    setSelectedEstimate={setSelectedEstimate}
                    showViewModal={showViewModal}
                    setShowViewModal={setShowViewModal}
                    loading={loading}
                    setLoading={setLoading}
                    loadEstimates={loadEstimates}
                    handlePrintEstimate={handlePrintEstimate}
                />;

            case 'invoices':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start border-b border-indigo-900 bg-indigo-950 p-6 rounded-3xl shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-1 h-8 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Tax Invoices</h1>
                                </div>
                                <p className="text-indigo-200/60 font-medium ml-4 text-sm">Manage and generate GST-compliant tax invoices for all estimates.</p>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Total Invoices</p>
                                        <p className="text-2xl font-black text-white">{filteredEstimates.filter(est => est.status !== 'draft').length}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Total Value</p>
                                        <p className="text-2xl font-black text-white">₹{filteredEstimates.filter(est => est.status !== 'draft').reduce((sum, est) => sum + est.totalAmount, 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <Card className="hover:shadow-xl hover:shadow-indigo-100/40 transition-all">
                            <CardBody className="p-6">
                                {/* Invoice Statistics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">TOTAL</span>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-900">{filteredEstimates.length}</p>
                                        <p className="text-sm text-blue-700">All Invoices</p>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">PAID</span>
                                        </div>
                                        <p className="text-2xl font-bold text-green-900">{filteredEstimates.filter(est => est.status === 'paid').length}</p>
                                        <p className="text-sm text-green-700">Paid Invoices</p>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <Clock className="h-5 w-5 text-amber-600" />
                                            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">PENDING</span>
                                        </div>
                                        <p className="text-2xl font-bold text-amber-900">{filteredEstimates.filter(est => est.status === 'sent').length}</p>
                                        <p className="text-sm text-amber-700">Pending Payment</p>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <AlertCircle className="h-5 w-5 text-red-600" />
                                            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">OVERDUE</span>
                                        </div>
                                        <p className="text-2xl font-bold text-red-900">{filteredEstimates.filter(est => est.status === 'overdue').length}</p>
                                        <p className="text-sm text-red-700">Overdue Invoices</p>
                                    </div>
                                </div>

                                {/* Search Bar */}
                                <form onSubmit={(e) => { e.preventDefault(); }} className="flex items-center gap-3 mb-6">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search by customer name, invoice no, or phone..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 bg-white/80"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={loadEstimates}
                                        className="bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-[0_4px_16px_rgba(251,191,36,0.3)]"
                                    >
                                        Refresh
                                    </button>
                                </form>

                                {/* Invoices Table */}
                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-slate-800 text-white text-xs uppercase">
                                                    <th className="px-3 py-3 text-left">Invoice No</th>
                                                    <th className="px-3 py-3 text-left">Date</th>
                                                    <th className="px-3 py-3 text-left">Customer</th>
                                                    <th className="px-3 py-3 text-left">Phone</th>
                                                    <th className="px-3 py-3 text-left">Location</th>
                                                    <th className="px-3 py-3 text-center">GST</th>
                                                    <th className="px-3 py-3 text-right">Amount</th>
                                                    <th className="px-3 py-3 text-center">Status</th>
                                                    <th className="px-3 py-3 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700">
                                                {filteredEstimates.map((estimate: any) => (
                                                    <tr key={estimate.id} className="hover:bg-slate-700/50">
                                                        <td className="px-3 py-2.5">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedEstimate(estimate);
                                                                    setShowViewModal(true);
                                                                }}
                                                                className="font-medium text-amber-400 hover:text-amber-300"
                                                            >
                                                                {estimate.billingNo}
                                                            </button>
                                                        </td>
                                                        <td className="px-3 py-2.5 text-slate-300">
                                                            {new Date(estimate.date).toLocaleDateString('en-IN')}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-slate-300">
                                                            {estimate.customerName}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-slate-300">{estimate.phone}</td>
                                                        <td className="px-3 py-2.5 text-slate-300">{estimate.area}</td>
                                                        <td className="px-3 py-2.5 text-center">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                                estimate.gstEnabled
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-slate-100 text-slate-800'
                                                            }`}>
                                                                {estimate.gstEnabled ? 'Yes' : 'No'}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-800">
                                                            ₹{new Intl.NumberFormat('en-IN').format(estimate.totalAmount)}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                                estimate.status === 'paid' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                                estimate.status === 'sent' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                                                estimate.status === 'overdue' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                                'bg-slate-100 text-slate-700 border border-slate-200'
                                                            }`}>
                                                                {estimate.status === 'paid' ? 'Paid' :
                                                                 estimate.status === 'sent' ? 'Sent' :
                                                                 estimate.status === 'overdue' ? 'Overdue' :
                                                                 'Draft'}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2.5">
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <button
                                                                    onClick={() => handlePrintEstimate(estimate, false)}
                                                                    className="text-amber-400 hover:text-amber-300 font-medium text-sm"
                                                                    title="Print Tax Invoice"
                                                                >
                                                                    <Printer className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedEstimate(estimate);
                                                                        setShowViewModal(true);
                                                                    }}
                                                                    className="text-slate-400 hover:text-slate-300 font-medium text-sm"
                                                                    title="View Details"
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
                            </CardBody>
                        </Card>

                        {/* View Modal - Reuse the same modal from EstimatesListContent */}
                        {showViewModal && selectedEstimate && (
                            <div 
                                className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
                                onClick={() => setShowViewModal(false)}
                            >
                                <div className="flex-1 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
                                    <div className="p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">
                                                Invoice Details - {selectedEstimate.billingNo}
                                            </h2>
                                            <button
                                                onClick={() => setShowViewModal(false)}
                                                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="px-6 py-6 border-b border-slate-200 bg-slate-50 rounded-xl mb-6">
                                            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Customer Details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-sm text-slate-600">Customer Name</p>
                                                    <p className="font-semibold text-slate-800">{selectedEstimate.customerName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">Phone Number</p>
                                                    <p className="font-semibold text-slate-800">{selectedEstimate.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-600">Location</p>
                                                    <p className="font-semibold text-slate-800">{selectedEstimate.area}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-6 py-6 border-b border-slate-200 bg-slate-50 rounded-xl mb-6">
                                            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Billing Items</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="bg-slate-100">
                                                            <th className="px-3 py-2 text-left font-medium text-slate-700">S.No</th>
                                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Category</th>
                                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Type</th>
                                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Brand</th>
                                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Size</th>
                                                            <th className="px-3 py-2 text-center font-medium text-slate-700">Qty</th>
                                                            <th className="px-3 py-2 text-left font-medium text-slate-700">Units</th>
                                                            <th className="px-3 py-2 text-right font-medium text-slate-700">Rate</th>
                                                            <th className="px-3 py-2 text-right font-medium text-slate-700">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedEstimate.items.map((item: any, index: number) => (
                                                            <tr key={index} className="border-b border-slate-100">
                                                                <td className="px-3 py-2">{index + 1}</td>
                                                                <td className="px-3 py-2">{item.category}</td>
                                                                <td className="px-3 py-2">{item.type || '-'}</td>
                                                                <td className="px-3 py-2">{item.brand || '-'}</td>
                                                                <td className="px-3 py-2">{item.size || '-'}</td>
                                                                <td className="px-3 py-2 text-center">{item.quantity}</td>
                                                                <td className="px-3 py-2">{item.units}</td>
                                                                <td className="px-3 py-2 text-right font-mono">₹{item.rate}</td>
                                                                <td className="px-3 py-2 text-right font-mono font-semibold">₹{item.amount.toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="px-6 py-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl mb-6">
                                            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-4">Billing Summary</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600">Subtotal</span>
                                                    <span className="font-mono font-semibold text-slate-800">₹{selectedEstimate.items.reduce((sum: number, item: any) => sum + item.amount, 0).toFixed(2)}</span>
                                                </div>
                                                {selectedEstimate.deliveryCharge > 0 && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-slate-600">Delivery Charge</span>
                                                        <span className="font-mono font-semibold text-slate-800">₹{selectedEstimate.deliveryCharge.toFixed(2)}</span>
                                                    </div>
                                                )}
                                                {selectedEstimate.gstEnabled && (
                                                    <>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-slate-600">CGST (9%)</span>
                                                            <span className="font-mono font-semibold text-slate-800">₹{(selectedEstimate.items.reduce((sum: number, item: any) => sum + item.amount, 0) * 0.09).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-slate-600">SGST (9%)</span>
                                                            <span className="font-mono font-semibold text-slate-800">₹{(selectedEstimate.items.reduce((sum: number, item: any) => sum + item.amount, 0) * 0.09).toFixed(2)}</span>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="h-px bg-slate-300 my-2"></div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-slate-900">Total Amount</span>
                                                    <span className="font-mono font-bold text-xl text-indigo-600">₹{selectedEstimate.totalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                onClick={() => handlePrintEstimate(selectedEstimate, false)}
                                                className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg"
                                            >
                                                <Printer className="h-4 w-4" />
                                                Print Tax Invoice
                                            </button>
                                            <button
                                                onClick={() => handlePrintEstimate(selectedEstimate, true)}
                                                className="flex items-center gap-2 bg-amber-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-700 shadow-lg"
                                            >
                                                <FileText className="h-4 w-4" />
                                                Rough Invoice
                                            </button>
                                            <button
                                                onClick={() => setShowViewModal(false)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'professional-estimate':
                return <EstimatesPage />;

            case 'estimates':
                return <EstimatesPage />;

            case 'invoices':
                return <InvoicesPage />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Sidebar */}
            <div className="w-80 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-blue-500/30 shadow-2xl">
                <div className="p-6 border-b border-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Admin Panel</h2>
                    <p className="text-sm text-blue-100 mt-1">Manage your business</p>
                </div>
                
                <nav className="p-4">
                    {menuSections.map((section) => (
                        <div key={section.id} className="mb-2">
                            <button
                                onClick={() => toggleSection(section.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                                    expandedSections.includes(section.id)
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400'
                                        : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <section.icon className={`h-5 w-5 ${
                                        expandedSections.includes(section.id) ? 'text-white' : 'text-blue-400'
                                    }`} />
                                    <span className={`font-black text-sm uppercase tracking-widest ${
                                        expandedSections.includes(section.id) ? 'text-white' : 'text-slate-300'
                                    }`}>{section.title}</span>
                                </div>
                                <ChevronDown 
                                    className={`h-4 w-4 transition-transform ${
                                        expandedSections.includes(section.id) ? 'rotate-180 text-white' : 'text-slate-400'
                                    }`}
                                />
                            </button>
                            
                            {expandedSections.includes(section.id) && (
                                <div className="mt-2 ml-4 space-y-1">
                                    {section.children.map((child) => (
                                        <button
                                            key={child.id}
                                            onClick={() => setActiveSection(child.id)}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                                                activeSection === child.id
                                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/25'
                                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <child.icon className={`h-4 w-4 ${
                                                    activeSection === child.id ? 'text-white' : 'text-blue-400'
                                                }`} />
                                                <span className={activeSection === child.id ? 'text-white' : 'text-slate-300'}>{child.title}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
