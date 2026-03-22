"use client";

import React, { useState } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    Download, 
    Printer, 
    Eye, 
    FileText, 
    Calendar, 
    TrendingUp, 
    ChevronDown,
    DollarSign,
    Users,
    Receipt,
    AlertCircle,
    CheckCircle,
    Clock,
    X,
    Edit,
    Trash2,
    Save
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { CATEGORIES, CATEGORY_LIST, GST_RATE } from '@/lib/billingData';

interface InvoiceItem {
    category: string;
    type?: string;
    brand?: string;
    size?: string;
    quantity: number;
    units: string;
    rate: number;
    amount: number;
}

interface Invoice {
    id: string;
    invoiceNo: string;
    customerName: string;
    phone: string;
    email?: string;
    area: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    gstin?: string;
    date: string;
    dueDate: string;
    placeOfSupply?: string;
    items: InvoiceItem[];
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    gstEnabled: boolean;
    cgst: number;
    sgst: number;
    totalAmount: number;
    status: 'paid' | 'pending' | 'overdue';
    notes?: string;
    terms?: string;
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([
        {
            id: '1',
            invoiceNo: 'INV-2024-001',
            customerName: 'Ramesh Kumar',
            phone: '9876543210',
            email: 'ramesh@example.com',
            area: 'T. Nagar',
            address: '123, Anna Salai, Chennai',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600017',
            gstin: '33AAJFT5678B1ZC',
            date: '2024-01-15',
            dueDate: '2024-02-14',
            placeOfSupply: 'Tamil Nadu',
            items: [
                {
                    category: 'Cement',
                    type: 'OPC 53',
                    brand: 'Ultratech',
                    size: '50kg',
                    quantity: 100,
                    units: 'Bags',
                    rate: 350,
                    amount: 35000
                },
                {
                    category: 'Steel',
                    type: 'TMT',
                    brand: 'TATA',
                    size: '12mm',
                    quantity: 2,
                    units: 'Tons',
                    rate: 45000,
                    amount: 90000
                }
            ],
            subtotal: 125000,
            discount: 0,
            deliveryCharge: 2000,
            gstEnabled: true,
            cgst: 11490,
            sgst: 11490,
            totalAmount: 149980,
            status: 'paid',
            notes: 'Payment received via bank transfer',
            terms: 'Payment terms: 50% advance, 50% on delivery'
        },
        {
            id: '2',
            invoiceNo: 'INV-2024-002',
            customerName: 'Suresh Builders',
            phone: '9876543211',
            area: 'Velachery',
            address: '456, 100 Feet Road, Chennai',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600042',
            date: '2024-01-20',
            dueDate: '2024-02-19',
            placeOfSupply: 'Tamil Nadu',
            items: [
                {
                    category: 'Bricks',
                    type: 'Red Brick',
                    brand: 'Kashmir Bricks',
                    size: '9×4×3',
                    quantity: 10000,
                    units: 'Nos',
                    rate: 6,
                    amount: 60000
                }
            ],
            subtotal: 60000,
            discount: 1000,
            deliveryCharge: 1500,
            gstEnabled: true,
            cgst: 5535,
            sgst: 5535,
            totalAmount: 72570,
            status: 'pending',
            notes: 'Payment pending - follow up required',
            terms: 'Payment terms: 50% advance, 50% on delivery'
        }
    ]);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    // Form state for new invoice
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        email: '',
        area: '',
        address: '',
        city: '',
        state: 'Tamil Nadu',
        pincode: '',
        gstin: '',
        dueDate: '',
        placeOfSupply: 'Tamil Nadu',
        discount: 0,
        notes: '',
        terms: '1. Payment to be made within 30 days from invoice date\n2. Goods once sold will not be taken back\n3. Interest @ 18% will be charged on overdue payments\n4. Subject to Chennai jurisdiction only'
    });

    const [items, setItems] = useState<InvoiceItem[]>([{
        category: '',
        type: '',
        brand: '',
        size: '',
        quantity: 1,
        units: 'pcs',
        rate: 0,
        amount: 0
    }]);

    const [gstEnabled, setGstEnabled] = useState(false);
    const [deliveryCharge, setDeliveryCharge] = useState(0);

    // Calculation functions
    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + item.amount, 0);
    };

    const calculateGST = () => {
        const taxableAmount = calculateSubtotal() + deliveryCharge - formData.discount;
        return gstEnabled ? taxableAmount * GST_RATE / 100 : 0;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + deliveryCharge - formData.discount + calculateGST();
    };

    // Generate GST Invoice
    const generateGSTInvoice = (invoice: Invoice) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        // Helper function to convert number to words
        const numberToWords = (num: number): string => {
            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            
            if (num === 0) return 'Zero';
            
            const convert = (n: number): string => {
                if (n < 10) return ones[n];
                if (n < 20) return teens[n - 10];
                if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
                if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
                if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
                if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
                return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
            };
            
            return convert(Math.floor(num));
        };

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Tax Invoice - ${invoice.invoiceNo}</title>
                <style>
                    @page { margin: 15mm; size: A4 portrait; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
                    .invoice-container { background: white; max-width: 800px; margin: 0 auto; padding: 40px; border: 2px solid #2c3e50; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 3px solid #3498db; padding-bottom: 20px; }
                    .company-name { font-size: 36px; font-weight: bold; color: #2c3e50; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 2px; }
                    .invoice-title { font-size: 42px; font-weight: bold; color: #e74c3c; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 3px; border: 3px solid #e74c3c; padding: 15px 25px; display: inline-block; transform: rotate(-2deg); }
                    .billing-section { display: flex; gap: 40px; margin-bottom: 30px; }
                    .billing-block { flex: 1; padding: 25px; border: 2px solid #bdc3c7; border-radius: 10px; background: #f8f9fa; }
                    .billing-block h3 { margin: 0 0 20px 0; color: #2c3e50; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                    .billing-block p { margin: 8px 0; color: #34495e; font-size: 14px; line-height: 1.5; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; font-size: 12px; }
                    .items-table th { background: #2c3e50; color: white; padding: 15px 10px; text-align: left; font-weight: bold; text-transform: uppercase; border: 1px solid #2c3e50; }
                    .items-table td { padding: 12px 10px; border: 1px solid #bdc3c7; vertical-align: top; }
                    .items-table .text-right { text-align: right; font-family: 'Courier New', monospace; }
                    .totals-section { margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white; }
                    .totals-table { width: 450px; margin-left: auto; border-collapse: collapse; }
                    .totals-table td { padding: 12px 15px; border: none; font-size: 14px; }
                    .totals-table .label { font-weight: 600; }
                    .totals-table .amount { text-align: right; font-family: 'Courier New', monospace; font-weight: bold; }
                    .totals-table .total-row { border-top: 3px double white; font-size: 18px; font-weight: bold; }
                    .gst-number { position: absolute; top: 15px; right: 15px; background: #27ae60; color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; font-size: 14px; }
                    .amount-words { margin: 20px 0; padding: 20px; background: #ecf0f1; border-radius: 8px; font-size: 14px; border-left: 4px solid #3498db; }
                    .bank-details { margin: 20px 0; padding: 20px; background: #d5f4e6; border-radius: 8px; border-left: 4px solid #27ae60; }
                    .bank-details h4 { margin: 0 0 15px 0; color: #27ae60; font-size: 16px; }
                    .terms-section { margin-top: 20px; padding: 20px; background: #fdf2f2; border-radius: 8px; border-left: 4px solid #e74c3c; }
                    .terms-section h4 { margin: 0 0 15px 0; color: #e74c3c; font-size: 16px; }
                    .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
                    .signature-box { width: 200px; text-align: center; }
                    .signature-line { border-bottom: 2px solid #34495e; height: 50px; margin-bottom: 10px; }
                    .signature-label { font-size: 14px; color: #7f8c8d; font-weight: 600; }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="gst-number">GSTIN: 33AAJFT5678B1ZC</div>
                    <div class="invoice-header">
                        <div class="company-section">
                            <h1 class="company-name">Thoon Enterprises</h1>
                            <div style="font-size: 16px; color: #7f8c8d; margin-bottom: 10px;">Premium Construction Materials Supplier</div>
                            <p style="margin: 5px 0; color: #34495e;">123, Industrial Estate, Chennai - 600 001</p>
                            <p style="margin: 5px 0; color: #34495e;">Tamil Nadu, India</p>
                            <p style="margin: 5px 0; color: #34495e;">📱 +91 97915 46123 | 📧 info@thoonenterprises.com</p>
                        </div>
                        <div class="invoice-details">
                            <div class="invoice-title">Tax Invoice</div>
                            <div style="font-size: 18px; margin: 10px 0;"><strong>Invoice No:</strong> ${invoice.invoiceNo}</div>
                            <div style="font-size: 16px; margin: 5px 0;"><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString('en-IN')}</div>
                            <div style="font-size: 16px; margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}</div>
                        </div>
                    </div>
                    <div class="billing-section">
                        <div class="billing-block">
                            <h3>🏢 Billing Details (Seller)</h3>
                            <p><strong>THOON ENTERPRISES</strong></p>
                            <p>123, Industrial Estate</p>
                            <p>Chennai - 600001, Tamil Nadu</p>
                            <p>GSTIN: 33AAJFT5678B1ZC</p>
                            <p>Phone: +91 97915 46123</p>
                            <p>Email: info@thoonenterprises.com</p>
                        </div>
                        <div class="billing-block">
                            <h3>👤 Shipping Details (Buyer)</h3>
                            <p><strong>${invoice.customerName}</strong></p>
                            <p>${invoice.address || ''}</p>
                            <p>${invoice.area}, ${invoice.city || ''}</p>
                            <p>${invoice.state || ''} - ${invoice.pincode || ''}</p>
                            ${invoice.gstin ? `<p>GSTIN: ${invoice.gstin}</p>` : ''}
                            <p>Phone: ${invoice.phone}</p>
                            ${invoice.email ? `<p>Email: ${invoice.email}</p>` : ''}
                        </div>
                    </div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th width="5%">S.No</th>
                                <th width="15%">Category</th>
                                <th width="20%">Description</th>
                                <th width="10%" class="text-center">Qty</th>
                                <th width="8%">Unit</th>
                                <th width="12%" class="text-right">Rate (₹)</th>
                                <th width="12%" class="text-right">Amount (₹)</th>
                                <th width="18%" class="text-right">HSN/SAC</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map((item, index) => {
                                const hsnCode = item.category === 'Cement' ? '2523' : 
                                             item.category === 'Steel' ? '7308' : 
                                             item.category === 'Bricks' ? '6901' : 
                                             item.category === 'Blocks' ? '6801' : 
                                             item.category === 'Sand' ? '2505' : '9705';
                                return `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${item.category}</td>
                                        <td>${item.brand ? item.brand + ' - ' : ''}${item.type || 'N/A'} ${item.size ? '(' + item.size + ')' : ''}</td>
                                        <td class="text-center">${item.quantity}</td>
                                        <td>${item.units}</td>
                                        <td class="text-right">${item.rate.toFixed(2)}</td>
                                        <td class="text-right">${item.amount.toFixed(2)}</td>
                                        <td class="text-right">${hsnCode}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    <div class="totals-section">
                        <table class="totals-table">
                            <tr>
                                <td class="label">Subtotal (Taxable Value):</td>
                                <td class="amount">₹${invoice.subtotal.toFixed(2)}</td>
                            </tr>
                            ${invoice.discount > 0 ? `
                                <tr>
                                    <td class="label">Discount:</td>
                                    <td class="amount">-₹${invoice.discount.toFixed(2)}</td>
                                </tr>
                            ` : ''}
                            ${invoice.deliveryCharge > 0 ? `
                                <tr>
                                    <td class="label">Delivery & Handling:</td>
                                    <td class="amount">₹${invoice.deliveryCharge.toFixed(2)}</td>
                                </tr>
                            ` : ''}
                            ${invoice.gstEnabled ? `
                                <tr>
                                    <td class="label">CGST @ 9%:</td>
                                    <td class="amount">₹${invoice.cgst.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td class="label">SGST @ 9%:</td>
                                    <td class="amount">₹${invoice.sgst.toFixed(2)}</td>
                                </tr>
                            ` : ''}
                            <tr class="total-row">
                                <td class="label">Invoice Total:</td>
                                <td class="amount">₹${invoice.totalAmount.toFixed(2)}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="amount-words">
                        <strong>Amount in Words:</strong> ${numberToWords(invoice.totalAmount)} Rupees Only
                    </div>
                    <div class="bank-details">
                        <h4>🏦 Bank Details</h4>
                        <p><strong>Bank:</strong> ICICI Bank Ltd</p>
                        <p><strong>Account Name:</strong> THOON ENTERPRISES</p>
                        <p><strong>Account Number:</strong> 123456789012</p>
                        <p><strong>IFSC Code:</strong> ICIC0001234</p>
                        <p><strong>Branch:</strong> Chennai, Industrial Estate</p>
                    </div>
                    <div class="terms-section">
                        <h4>📋 Terms & Conditions</h4>
                        <p>1. Goods once sold will not be taken back or exchanged</p>
                        <p>2. Interest @ 18% per annum will be charged on overdue payments</p>
                        <p>3. Subject to Chennai jurisdiction only</p>
                        <p>4. Payment should be made within 30 days from invoice date</p>
                        <p>5. E.& O.E. (Errors and Omissions Excepted)</p>
                    </div>
                    <div class="signature-section">
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div class="signature-label">Customer Signature</div>
                        </div>
                        <div class="signature-box">
                            <div class="signature-line"></div>
                            <div class="signature-label">Authorized Signatory</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    };

    // Create new invoice
    const handleCreateInvoice = () => {
        if (!formData.customerName || !formData.phone || !formData.area || !formData.dueDate) {
            alert('Please fill all required fields');
            return;
        }
        
        const validItems = items.filter(item => item.category && item.quantity > 0 && item.rate > 0);
        if (validItems.length === 0) {
            alert('Please add at least one valid item');
            return;
        }
        
        const subtotal = calculateSubtotal();
        const gstAmount = calculateGST();
        const total = calculateTotal();
        
        const newInvoice: Invoice = {
            id: 'inv-' + Date.now(),
            invoiceNo: 'INV-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6),
            customerName: formData.customerName,
            phone: formData.phone,
            email: formData.email || undefined,
            area: formData.area,
            address: formData.address || undefined,
            city: formData.city || undefined,
            state: formData.state || undefined,
            pincode: formData.pincode || undefined,
            gstin: formData.gstin || undefined,
            date: new Date().toISOString().split('T')[0],
            dueDate: formData.dueDate,
            placeOfSupply: formData.placeOfSupply || 'Tamil Nadu',
            items: validItems,
            subtotal: subtotal,
            discount: formData.discount || 0,
            deliveryCharge: deliveryCharge,
            gstEnabled: gstEnabled,
            cgst: gstEnabled ? gstAmount / 2 : 0,
            sgst: gstEnabled ? gstAmount / 2 : 0,
            totalAmount: total,
            status: 'pending',
            notes: formData.notes || undefined,
            terms: formData.terms || undefined
        };
        
        setInvoices([newInvoice, ...invoices]);
        setShowCreateModal(false);
        generateGSTInvoice(newInvoice);
        
        // Reset form
        setFormData({
            customerName: '',
            phone: '',
            email: '',
            area: '',
            address: '',
            city: '',
            state: 'Tamil Nadu',
            pincode: '',
            gstin: '',
            dueDate: '',
            placeOfSupply: 'Tamil Nadu',
            discount: 0,
            notes: '',
            terms: '1. Payment to be made within 30 days from invoice date\n2. Goods once sold will not be taken back\n3. Interest @ 18% will be charged on overdue payments\n4. Subject to Chennai jurisdiction only'
        });
        setItems([{
            category: '',
            type: '',
            brand: '',
            size: '',
            quantity: 1,
            units: 'pcs',
            rate: 0,
            amount: 0
        }]);
        setGstEnabled(false);
        setDeliveryCharge(0);
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.customerName.toLowerCase().includes(search.toLowerCase()) ||
                            invoice.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
                            invoice.phone.includes(search);
        const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'overdue':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingAmount = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0);

    return (
        <div className="space-y-6">
            {/* Premium Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 shadow-2xl border border-purple-500/20">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400/10 rounded-full blur-2xl" />
                
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-2 h-12 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-yellow-400/50" />
                            <h1 className="text-4xl font-bold text-white uppercase tracking-tight">Premium Invoice Management</h1>
                        </div>
                        <p className="text-purple-100 font-medium text-lg ml-6">Professional GST invoicing with advanced features</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-indigo-900 px-8 py-4 rounded-2xl transition-all shadow-xl shadow-yellow-400/30 flex items-center gap-3 font-bold text-lg transform hover:scale-105"
                    >
                        <Plus className="h-6 w-6" />
                        Create Invoice
                    </button>
                </div>
            </div>

            {/* Premium Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 shadow-xl border border-blue-400/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <Receipt className="h-8 w-8 text-white/80" />
                            <span className="text-white/60 text-sm font-medium">Total</span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{invoices.length}</p>
                        <p className="text-blue-100 font-medium">Invoices Generated</p>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-xl border border-emerald-400/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="h-8 w-8 text-white/80" />
                            <span className="text-white/60 text-sm font-medium">Revenue</span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">₹{totalRevenue.toLocaleString()}</p>
                        <p className="text-emerald-100 font-medium">Total Collected</p>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-6 shadow-xl border border-amber-400/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="h-8 w-8 text-white/80" />
                            <span className="text-white/60 text-sm font-medium">Pending</span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">₹{pendingAmount.toLocaleString()}</p>
                        <p className="text-amber-100 font-medium">Awaiting Payment</p>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl border border-purple-400/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="h-8 w-8 text-white/80" />
                            <span className="text-white/60 text-sm font-medium">Clients</span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{invoices.filter(inv => inv.status === 'paid').length}</p>
                        <p className="text-purple-100 font-medium">Happy Customers</p>
                    </div>
                </div>
            </div>

            {/* Premium Filters */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 shadow-lg border border-slate-200/50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search invoices by customer, invoice number, or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-12 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none shadow-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Premium Invoices Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                                <th className="text-left py-4 px-6 font-bold text-slate-800">Invoice No</th>
                                <th className="text-left py-4 px-6 font-bold text-slate-800">Customer</th>
                                <th className="text-left py-4 px-6 font-bold text-slate-800">Phone</th>
                                <th className="text-left py-4 px-6 font-bold text-slate-800">Date</th>
                                <th className="text-left py-4 px-6 font-bold text-slate-800">Due Date</th>
                                <th className="text-right py-4 px-6 font-bold text-slate-800">Amount</th>
                                <th className="text-left py-4 px-6 font-bold text-slate-800">Status</th>
                                <th className="text-center py-4 px-6 font-bold text-slate-800">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
                                    <td className="py-4 px-6">
                                        <span className="font-mono font-bold text-purple-600 text-lg">{invoice.invoiceNo}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="text-slate-900 font-semibold">{invoice.customerName}</p>
                                            <p className="text-slate-500 text-sm">{invoice.area}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-slate-900">{invoice.phone}</td>
                                    <td className="py-4 px-6 text-slate-900 font-medium">{new Date(invoice.date).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-slate-900 font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-right">
                                        <span className="font-mono font-bold text-emerald-600 text-lg">₹{invoice.totalAmount.toLocaleString()}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
                                            {getStatusIcon(invoice.status)}
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedInvoice(invoice);
                                                    setShowViewModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                                title="View Invoice"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => generateGSTInvoice(invoice)}
                                                className="text-purple-600 hover:text-purple-800 transition-colors p-2 hover:bg-purple-50 rounded-lg"
                                                title="Print Invoice"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-y-auto border border-slate-600/30">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-white">Create Premium Invoice</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-3 rounded-full hover:bg-slate-700"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Invoice Header */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Invoice Number</label>
                                    <input
                                        type="text"
                                        value={`INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`}
                                        readOnly
                                        className="w-full px-4 py-3 bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Invoice Date</label>
                                    <input
                                        type="date"
                                        value={new Date().toISOString().split('T')[0]}
                                        readOnly
                                        className="w-full px-4 py-3 bg-slate-600/50 border border-slate-600/50 rounded-xl text-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Due Date *</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Customer Details */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-purple-300 mb-6 flex items-center gap-3">
                                        <Users className="h-5 w-5" />
                                        Customer Details
                                    </h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Customer Name *</label>
                                        <input
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter customer name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone *</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter email address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">GSTIN (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.gstin}
                                            onChange={(e) => setFormData({...formData, gstin: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter GSTIN number"
                                        />
                                    </div>
                                </div>

                                {/* Address Details */}
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-purple-300 mb-6 flex items-center gap-3">
                                        <FileText className="h-5 w-5" />
                                        Billing Address
                                    </h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Area/Location *</label>
                                        <input
                                            type="text"
                                            value={formData.area}
                                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter area/location"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Street Address</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter full street address"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                value={formData.pincode}
                                                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                placeholder="Pincode"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
                                        <select
                                            value={formData.state}
                                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Kerala">Kerala</option>
                                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Delhi">Delhi</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-purple-300 mb-6 flex items-center gap-3">
                                    <Receipt className="h-5 w-5" />
                                    Invoice Items
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-700/50 border border-slate-600/30">
                                                <th className="text-left py-3 px-4 text-purple-200 font-medium">Category</th>
                                                <th className="text-left py-3 px-4 text-purple-200 font-medium">Type</th>
                                                <th className="text-left py-3 px-4 text-purple-200 font-medium">Brand</th>
                                                <th className="text-left py-3 px-4 text-purple-200 font-medium">Size</th>
                                                <th className="text-center py-3 px-4 text-purple-200 font-medium">Qty</th>
                                                <th className="text-center py-3 px-4 text-purple-200 font-medium">Units</th>
                                                <th className="text-right py-3 px-4 text-purple-200 font-medium">Rate</th>
                                                <th className="text-right py-3 px-4 text-purple-200 font-medium">Amount</th>
                                                <th className="text-center py-3 px-4 text-purple-200 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item, index) => (
                                                <tr key={index} className="border border-slate-600/30">
                                                    <td className="py-3 px-4">
                                                        <select
                                                            value={item.category}
                                                            onChange={(e) => {
                                                                const newItems = [...items];
                                                                newItems[index].category = e.target.value;
                                                                newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                                                                setItems(newItems);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                        >
                                                            <option value="">Select</option>
                                                            {CATEGORY_LIST.map(cat => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="text"
                                                            value={item.type}
                                                            onChange={(e) => {
                                                                const newItems = [...items];
                                                                newItems[index].type = e.target.value;
                                                                setItems(newItems);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                            placeholder="Type"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="text"
                                                            value={item.brand}
                                                            onChange={(e) => {
                                                                const newItems = [...items];
                                                                newItems[index].brand = e.target.value;
                                                                setItems(newItems);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                            placeholder="Brand"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="text"
                                                            value={item.size}
                                                            onChange={(e) => {
                                                                const newItems = [...items];
                                                                newItems[index].size = e.target.value;
                                                                setItems(newItems);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                            placeholder="Size"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const newItems = [...items];
                                                                newItems[index].quantity = parseInt(e.target.value) || 0;
                                                                newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                                                                setItems(newItems);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm text-center focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                            placeholder="Qty"
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <select
                                                            value={item.units}
                                                            onChange={(e) => {
                                                                const newItems = [...items];
                                                                newItems[index].units = e.target.value;
                                                                setItems(newItems);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                        >
                                                            <option value="pcs">Pcs</option>
                                                            <option value="bags">Bags</option>
                                                            <option value="tons">Tons</option>
                                                            <option value="kg">Kg</option>
                                                            <option value="meters">Meters</option>
                                                            <option value="feet">Feet</option>
                                                            <option value="boxes">Boxes</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="number"
                                                            value={item.rate}
                                                            onChange={(e) => {
                                                                const newItems = [...items];
                                                                newItems[index].rate = parseFloat(e.target.value) || 0;
                                                                newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                                                                setItems(newItems);
                                                            }}
                                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm text-right focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                            placeholder="Rate"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <input
                                                            type="text"
                                                            value={item.amount.toFixed(2)}
                                                            readOnly
                                                            className="w-full px-3 py-2 bg-slate-600/50 border border-slate-600/50 rounded-lg text-slate-300 text-sm text-right font-mono"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <button
                                                            onClick={() => {
                                                                if (items.length > 1) {
                                                                    setItems(items.filter((_, i) => i !== index));
                                                                }
                                                            }}
                                                            className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                            disabled={items.length === 1}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <button
                                    onClick={() => setItems([...items, {
                                        category: '',
                                        type: '',
                                        brand: '',
                                        size: '',
                                        quantity: 1,
                                        units: 'pcs',
                                        rate: 0,
                                        amount: 0
                                    }])}
                                    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Item Row
                                </button>
                            </div>

                            {/* Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-purple-300 mb-4">💰 Charges</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-300">Subtotal:</span>
                                            <span className="font-mono font-semibold text-slate-200">₹{calculateSubtotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-300">Discount:</span>
                                            <input
                                                type="number"
                                                value={formData.discount}
                                                onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                                                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                placeholder="0"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-300">Delivery:</span>
                                            <input
                                                type="number"
                                                value={deliveryCharge}
                                                onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                                                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                placeholder="0"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-purple-300 mb-4">🧾 Tax Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-300">Place of Supply:</span>
                                            <select
                                                value={formData.placeOfSupply}
                                                onChange={(e) => setFormData({...formData, placeOfSupply: e.target.value})}
                                                className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            >
                                                <option value="Tamil Nadu">Tamil Nadu</option>
                                                <option value="Karnataka">Karnataka</option>
                                                <option value="Kerala">Kerala</option>
                                            </select>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-300">Enable GST (18%):</span>
                                            <input
                                                type="checkbox"
                                                checked={gstEnabled}
                                                onChange={(e) => setGstEnabled(e.target.checked)}
                                                className="w-4 h-4 text-purple-600 bg-white border-slate-300 rounded focus:ring-purple-500"
                                            />
                                        </div>
                                        {gstEnabled && (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-300">CGST (9%):</span>
                                                    <span className="font-mono font-semibold text-emerald-400">₹{(calculateGST() / 2).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-300">SGST (9%):</span>
                                                    <span className="font-mono font-semibold text-emerald-400">₹{(calculateGST() / 2).toFixed(2)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-purple-300 mb-4">📊 Total</h3>
                                    <div className="space-y-3">
                                        <div className="border-t border-slate-600/30 pt-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-slate-300">Taxable Amount:</span>
                                                <span className="font-mono font-semibold text-slate-200">₹{(calculateSubtotal() + deliveryCharge - formData.discount).toFixed(2)}</span>
                                            </div>
                                            {gstEnabled && (
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-slate-300">Total GST:</span>
                                                    <span className="font-mono font-semibold text-emerald-400">₹{calculateGST().toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-slate-200">Total Amount:</span>
                                                <span className="font-mono font-bold text-xl text-emerald-400">₹{calculateTotal().toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-300 mb-4">📝 Notes</h3>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Enter invoice notes (optional)"
                                        rows={4}
                                    />
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-300 mb-4">📋 Terms & Conditions</h3>
                                    <textarea
                                        value={formData.terms}
                                        onChange={(e) => setFormData({...formData, terms: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Enter terms and conditions"
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-end">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-8 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateInvoice}
                                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 flex items-center gap-2"
                                >
                                    <Plus className="h-5 w-5" />
                                    Create & Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Invoice Modal */}
            {showViewModal && selectedInvoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Invoice Details - {selectedInvoice.invoiceNo}</h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors p-3 rounded-full hover:bg-slate-100"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="p-6 bg-slate-50 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Customer Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-slate-600">Name:</span>
                                            <p className="font-semibold text-slate-900">{selectedInvoice.customerName}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-600">Phone:</span>
                                            <p className="font-semibold text-slate-900">{selectedInvoice.phone}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-600">Address:</span>
                                            <p className="font-semibold text-slate-900">{selectedInvoice.address || selectedInvoice.area}</p>
                                        </div>
                                        {selectedInvoice.gstin && (
                                            <div>
                                                <span className="text-sm text-slate-600">GSTIN:</span>
                                                <p className="font-semibold text-slate-900">{selectedInvoice.gstin}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 rounded-2xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Invoice Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-slate-600">Invoice Number:</span>
                                            <p className="font-semibold text-slate-900">{selectedInvoice.invoiceNo}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-600">Date:</span>
                                            <p className="font-semibold text-slate-900">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-600">Due Date:</span>
                                            <p className="font-semibold text-slate-900">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-600">Status:</span>
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedInvoice.status)}`}>
                                                {getStatusIcon(selectedInvoice.status)}
                                                {selectedInvoice.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border border-slate-200 rounded-xl">
                                        <thead>
                                            <tr className="bg-slate-100">
                                                <th className="text-left py-3 px-4 font-medium text-slate-700">S.No</th>
                                                <th className="text-left py-3 px-4 font-medium text-slate-700">Category</th>
                                                <th className="text-left py-3 px-4 font-medium text-slate-700">Description</th>
                                                <th className="text-center py-3 px-4 font-medium text-slate-700">Qty</th>
                                                <th className="text-right py-3 px-4 font-medium text-slate-700">Rate</th>
                                                <th className="text-right py-3 px-4 font-medium text-slate-700">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedInvoice.items.map((item, index) => (
                                                <tr key={index} className="border-b border-slate-100">
                                                    <td className="py-3 px-4">{index + 1}</td>
                                                    <td className="py-3 px-4">{item.category}</td>
                                                    <td className="py-3 px-4">{item.brand ? item.brand + ' - ' : ''}{item.type || 'N/A'} {item.size ? '(' + item.size + ')' : ''}</td>
                                                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                                                    <td className="py-3 px-4 text-right font-mono">₹{item.rate.toFixed(2)}</td>
                                                    <td className="py-3 px-4 text-right font-mono font-semibold">₹{item.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Summary</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Subtotal:</span>
                                        <span className="font-mono font-semibold">₹{selectedInvoice.subtotal.toFixed(2)}</span>
                                    </div>
                                    {selectedInvoice.discount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Discount:</span>
                                            <span className="font-mono font-semibold">-₹{selectedInvoice.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {selectedInvoice.deliveryCharge > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Delivery Charge:</span>
                                            <span className="font-mono font-semibold">₹{selectedInvoice.deliveryCharge.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {selectedInvoice.gstEnabled && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">CGST (9%):</span>
                                                <span className="font-mono font-semibold">₹{selectedInvoice.cgst.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">SGST (9%):</span>
                                                <span className="font-mono font-semibold">₹{selectedInvoice.sgst.toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="h-px bg-slate-300 my-2"></div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-slate-900">Total Amount:</span>
                                        <span className="font-mono text-emerald-600">₹{selectedInvoice.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-end mt-8">
                                <button
                                    onClick={() => generateGSTInvoice(selectedInvoice)}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
                                >
                                    <Printer className="h-4 w-4" />
                                    Print Invoice
                                </button>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
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
