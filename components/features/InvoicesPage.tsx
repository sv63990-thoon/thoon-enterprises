"use client";

import React, { useState } from 'react';
import { Plus, Search, Filter, Printer, FileText, DollarSign, Users, AlertCircle } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';

interface Invoice {
    id: string;
    invoiceNo: string;
    customerName: string;
    phone: string;
    email?: string;
    area: string;
    address?: string;
    date: string;
    dueDate: string;
    items: {
        category: string;
        type?: string;
        brand?: string;
        size?: string;
        quantity: number;
        units: string;
        rate: number;
        amount: number;
    }[];
    subtotal: number;
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
            date: '2024-01-15',
            dueDate: '2024-02-14',
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
            date: '2024-01-20',
            dueDate: '2024-02-19',
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
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                    .invoice-container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px; }
                    .company-info { flex: 1; }
                    .company-name { font-size: 32px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
                    .company-address { font-size: 14px; color: #6b7280; line-height: 1.4; }
                    .invoice-details { text-align: right; }
                    .invoice-title { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 10px; }
                    .invoice-number { font-size: 18px; font-weight: bold; color: #374151; margin-bottom: 5px; }
                    .invoice-date { font-size: 14px; color: #6b7280; }
                    .gst-info { background: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #f59e0b; }
                    .gst-info h4 { margin: 0 0 10px 0; color: #92400e; font-size: 16px; }
                    .gst-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; }
                    .party-section { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
                    .party-box { border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; }
                    .party-box h3 { margin: 0 0 15px 0; color: #1e40af; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
                    .party-box p { margin: 5px 0; color: #374151; font-size: 14px; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .items-table th { background: #1e40af; color: white; padding: 12px 8px; text-align: left; font-weight: bold; font-size: 14px; border: 1px solid #1e40af; }
                    .items-table td { padding: 10px 8px; border: 1px solid #e5e7eb; font-size: 14px; }
                    .items-table .text-right { text-align: right; }
                    .items-table .text-center { text-align: center; }
                    .totals-table { width: 400px; margin-left: auto; border-collapse: collapse; }
                    .totals-table td { padding: 10px 12px; border: 1px solid #e5e7eb; font-size: 14px; }
                    .totals-table .label { font-weight: 600; color: #374151; }
                    .totals-table .amount { text-align: right; font-family: 'Courier New', monospace; font-weight: bold; }
                    .totals-table .total-row { background: #1e40af; color: white; font-size: 16px; font-weight: bold; }
                    .totals-table .total-row .label { color: white; }
                    .totals-table .total-row .amount { color: white; }
                    .amount-words { margin-bottom: 20px; padding: 15px; background: #f3f4f6; border-radius: 6px; font-size: 14px; color: #374151; }
                    .bank-details { margin-bottom: 20px; padding: 15px; background: #ecfdf5; border-radius: 6px; border-left: 4px solid #10b981; }
                    .bank-details h4 { margin: 0 0 10px 0; color: #065f46; font-size: 16px; }
                    .qr-section { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 6px; }
                    .qr-placeholder { width: 120px; height: 120px; border: 2px dashed #9ca3af; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px; text-align: center; }
                    .payment-info { flex: 1; margin-left: 20px; }
                    .payment-info h4 { margin: 0 0 10px 0; color: #374151; font-size: 16px; }
                    .payment-info p { margin: 5px 0; color: #6b7280; font-size: 14px; }
                    .terms-section { margin-top: 20px; padding: 15px; background: #fef2f2; border-radius: 6px; border-left: 4px solid #ef4444; }
                    .terms-section h4 { margin: 0 0 10px 0; color: #991b1b; font-size: 16px; }
                    .terms-section p { margin: 5px 0; color: #7f1d1d; font-size: 13px; }
                    .signature-section { margin-top: 30px; display: flex; justify-content: space-between; }
                    .signature-box { width: 200px; text-align: center; }
                    .signature-line { border-bottom: 1px solid #374151; height: 40px; margin-bottom: 5px; }
                    .signature-label { font-size: 14px; color: #6b7280; }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <div class="company-info">
                            <div class="company-name">THOON ENTERPRISES</div>
                            <div class="company-address">
                                123, Industrial Estate, Chennai - 600001<br>
                                Tamil Nadu, India<br>
                                GSTIN: 33AAKFT7803C1ZV<br>
                                Phone: +91 98765 43210 | Email: info@thoonenterprises.com
                            </div>
                        </div>
                        <div class="invoice-details">
                            <div class="invoice-title">TAX INVOICE</div>
                            <div class="invoice-number">Invoice No: ${invoice.invoiceNo}</div>
                            <div class="invoice-date">Date: ${new Date(invoice.date).toLocaleDateString()}</div>
                            <div class="invoice-date">Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div class="gst-info">
                        <h4>📋 Tax Details</h4>
                        <div class="gst-grid">
                            <div><strong>Place of Supply:</strong> Tamil Nadu (33)</div>
                            <div><strong>Reverse Charge:</strong> No</div>
                            <div><strong>Invoice Type:</strong> Tax Invoice</div>
                            <div><strong>Payment Terms:</strong> 50% Advance, 50% on Delivery</div>
                        </div>
                    </div>

                    <div class="party-section">
                        <div class="party-box">
                            <h3>🏢 Billing Details (Seller)</h3>
                            <p><strong>THOON ENTERPRISES</strong></p>
                            <p>123, Industrial Estate</p>
                            <p>Chennai - 600001, Tamil Nadu</p>
                            <p>GSTIN: 33AAKFT7803C1ZV</p>
                            <p>Phone: +91 98765 43210</p>
                            <p>Email: info@thoonenterprises.com</p>
                        </div>
                        <div class="party-box">
                            <h3>👤 Shipping Details (Buyer)</h3>
                            <p><strong>${invoice.customerName}</strong></p>
                            <p>${invoice.address || invoice.area}</p>
                            <p>${invoice.area}</p>
                            ${invoice.email ? `<p>Email: ${invoice.email}</p>` : ''}
                            <p>Phone: ${invoice.phone}</p>
                            <p>State: Tamil Nadu</p>
                        </div>
                    </div>

                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Description of Goods</th>
                                <th>HSN Code</th>
                                <th class="text-center">Qty</th>
                                <th class="text-right">Rate</th>
                                <th class="text-right">Amount</th>
                                <th class="text-center">GST %</th>
                                <th class="text-right">CGST</th>
                                <th class="text-right">SGST</th>
                                <th class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map((item, index) => {
                                const hsnCode = item.category === 'Cement' ? '2523' : 
                                             item.category === 'Steel' ? '7308' : 
                                             item.category === 'Bricks' ? '6901' : '9705';
                                const gstRate = invoice.gstEnabled ? 18 : 0;
                                const cgst = (item.amount * gstRate / 100) / 2;
                                const sgst = (item.amount * gstRate / 100) / 2;
                                const totalWithGST = item.amount + cgst + sgst;
                                
                                return `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${item.brand ? item.brand + ' - ' : ''}${item.type || item.category} ${item.size !== '-' ? '(' + item.size + ')' : ''}</td>
                                        <td>${hsnCode}</td>
                                        <td class="text-center">${item.quantity}</td>
                                        <td class="text-right">₹${item.rate.toFixed(2)}</td>
                                        <td class="text-right">₹${item.amount.toFixed(2)}</td>
                                        <td class="text-center">${gstRate}%</td>
                                        <td class="text-right">₹${cgst.toFixed(2)}</td>
                                        <td class="text-right">₹${sgst.toFixed(2)}</td>
                                        <td class="text-right">₹${totalWithGST.toFixed(2)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <div class="totals-section">
                        <table class="totals-table">
                            <tr>
                                <td class="label">Subtotal:</td>
                                <td class="amount">₹${invoice.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td class="label">Delivery Charge:</td>
                                <td class="amount">₹${invoice.deliveryCharge.toFixed(2)}</td>
                            </tr>
                            ${invoice.gstEnabled ? `
                                <tr>
                                    <td class="label">CGST (9%):</td>
                                    <td class="amount">₹${invoice.cgst.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td class="label">SGST (9%):</td>
                                    <td class="amount">₹${invoice.sgst.toFixed(2)}</td>
                                </tr>
                            ` : ''}
                            <tr class="total-row">
                                <td class="label">Grand Total:</td>
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

                    <div class="qr-section">
                        <div class="qr-placeholder">
                            📱<br>QR Code<br>for Payment
                        </div>
                        <div class="payment-info">
                            <h4>💳 Payment Information</h4>
                            <p><strong>UPI ID:</strong> thoonenterprise@okicici</p>
                            <p><strong>Paytm:</strong> 9876543210</p>
                            <p><strong>Google Pay:</strong> 9876543210</p>
                            <p><strong>PhonePe:</strong> 9876543210</p>
                            <p><strong>Amount:</strong> ₹${invoice.totalAmount.toFixed(2)}</p>
                            <p><em>Scan QR code or use above UPI details for payment</em></p>
                        </div>
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

    // Create and print sample invoice directly
    const createAndPrintInvoice = () => {
        alert('Create Invoice button clicked! Generating sample invoice...');
        
        const sampleInvoice: Invoice = {
            id: 'inv-' + Date.now(),
            invoiceNo: 'INV-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6),
            customerName: 'Sample Customer',
            phone: '9876543210',
            email: 'customer@example.com',
            area: 'Chennai',
            address: '123 Sample Address, Chennai',
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
                    brand: 'TATA Tiscon',
                    size: '12mm',
                    quantity: 1,
                    units: 'Tons',
                    rate: 45000,
                    amount: 45000
                }
            ],
            subtotal: 80000,
            deliveryCharge: 1000,
            gstEnabled: true,
            cgst: 7290,
            sgst: 7290,
            totalAmount: 95580,
            status: 'pending',
            notes: 'Sample invoice for demonstration purposes',
            terms: 'Payment terms: 50% advance, 50% on delivery'
        };

        // Add to invoices list
        setInvoices([sampleInvoice, ...invoices]);
        
        // Generate and print invoice directly
        generateGSTInvoice(sampleInvoice);
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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingAmount = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.totalAmount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                        <p className="text-gray-600 mt-1">Manage customer invoices and billing</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{invoices.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">₹{pendingAmount.toLocaleString()}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{invoices.filter(inv => inv.status === 'paid').length}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Invoice No</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Customer</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Phone</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Due Date</th>
                                <th className="text-right py-3 px-6 font-medium text-gray-900">Amount</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                                <th className="text-center py-3 px-6 font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-6">
                                        <span className="font-medium text-blue-600">{invoice.invoiceNo}</span>
                                    </td>
                                    <td className="py-3 px-6 text-gray-900 font-medium">{invoice.customerName}</td>
                                    <td className="py-3 px-6 text-gray-900">{invoice.phone}</td>
                                    <td className="py-3 px-6 text-gray-900">{new Date(invoice.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-6 text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td className="py-3 px-6 text-right">
                                        <span className="font-medium text-gray-900">₹{invoice.totalAmount.toLocaleString()}</span>
                                    </td>
                                    <td className="py-3 px-6">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => generateGSTInvoice(invoice)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
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
        </div>
    );
}
