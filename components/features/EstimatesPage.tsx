'use client';

import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    Eye, 
    Printer, 
    Edit, 
    Trash2, 
    X, 
    ChevronDown,
    Download,
    User,
    Phone,
    MapPin,
    Calendar,
    FileText
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { CATEGORIES, BRANDS, CATEGORY_LIST, GST_RATE } from '@/lib/billingData';

interface EstimateItem {
    category: string;
    type?: string;
    brand?: string;
    size?: string;
    quantity: number;
    units: string;
    rate: number;
    amount: number;
}

interface Estimate {
    id: string;
    estimateNo: string;
    customerName: string;
    phone: string;
    email?: string;
    area: string;
    address?: string;
    date: string;
    validUntil: string;
    items: EstimateItem[];
    subtotal: number;
    deliveryCharge: number;
    gstEnabled: boolean;
    cgst: number;
    sgst: number;
    totalAmount: number;
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
    notes?: string;
    terms?: string;
}

export default function EstimatesPage() {
    const [estimates, setEstimates] = useState<Estimate[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
    const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        email: '',
        area: '',
        address: '',
        validUntil: '',
        notes: '',
        terms: '1. Prices are valid for 30 days\n2. Delivery charges extra as applicable\n3. Payment terms: 50% advance, 50% on delivery\n4. Warranty as per manufacturer terms'
    });

    const [items, setItems] = useState([{
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

    // Invoice form state
    const [invoiceFormData, setInvoiceFormData] = useState({
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

    const [invoiceItems, setInvoiceItems] = useState([{
        category: '',
        type: '',
        brand: '',
        size: '',
        quantity: 1,
        units: 'pcs',
        rate: 0,
        amount: 0
    }]);

    const [invoiceGstEnabled, setInvoiceGstEnabled] = useState(false);
    const [invoiceDeliveryCharge, setInvoiceDeliveryCharge] = useState(0);

    // Invoice calculation functions
    const calculateInvoiceSubtotal = () => {
        return invoiceItems.reduce((sum, item) => sum + item.amount, 0);
    };

    const calculateInvoiceGST = () => {
        const taxableAmount = calculateInvoiceSubtotal() + invoiceDeliveryCharge - (invoiceFormData.discount || 0);
        return invoiceGstEnabled ? taxableAmount * GST_RATE / 100 : 0;
    };

    const calculateInvoiceTotal = () => {
        return calculateInvoiceSubtotal() + invoiceDeliveryCharge - (invoiceFormData.discount || 0) + calculateInvoiceGST();
    };

    // Generate GST Invoice for Invoice object
    const generateGSTInvoiceForInvoice = (invoice: any) => {
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
                        </div>
                    </div>

                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Brand</th>
                                <th>Size</th>
                                <th class="text-center">Qty</th>
                                <th>Units</th>
                                <th class="text-right">Rate</th>
                                <th class="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map((item: any, index: number) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.category}</td>
                                    <td>${item.type || '-'}</td>
                                    <td>${item.brand || '-'}</td>
                                    <td>${item.size || '-'}</td>
                                    <td class="text-center">${item.quantity}</td>
                                    <td>${item.units}</td>
                                    <td class="text-right">₹${item.rate.toFixed(2)}</td>
                                    <td class="text-right">₹${item.amount.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="amount-words">
                        <strong>Amount in Words:</strong> ${numberToWords(invoice.totalAmount)} Rupees Only
                    </div>

                    <table class="totals-table">
                        <tr>
                            <td class="label">Subtotal:</td>
                            <td class="amount">₹${invoice.subtotal.toFixed(2)}</td>
                        </tr>
                        ${invoice.deliveryCharge > 0 ? `
                        <tr>
                            <td class="label">Delivery Charge:</td>
                            <td class="amount">₹${invoice.deliveryCharge.toFixed(2)}</td>
                        </tr>
                        ` : ''}
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
                            <td class="label">Total Amount:</td>
                            <td class="amount">₹${invoice.totalAmount.toFixed(2)}</td>
                        </tr>
                    </table>

                    <div class="bank-details">
                        <h4>🏦 Bank Details</h4>
                        <p><strong>Bank:</strong> State Bank of India</p>
                        <p><strong>Account Name:</strong> THOON ENTERPRISES</p>
                        <p><strong>Account Number:</strong> 123456789012345</p>
                        <p><strong>IFSC Code:</strong> SBIN0001234</p>
                        <p><strong>Branch:</strong> Chennai, Industrial Estate</p>
                    </div>

                    <div class="qr-section">
                        <div class="qr-placeholder">
                            📱<br>Scan to Pay
                        </div>
                        <div class="payment-info">
                            <h4>💳 Payment Information</h4>
                            <p>UPI ID: thoonenterprises@okicici</p>
                            <p>PayTM: 9876543210</p>
                            <p>Google Pay: 9876543210</p>
                            <p>PhonePe: 9876543210</p>
                        </div>
                    </div>

                    ${invoice.notes ? `
                    <div class="terms-section">
                        <h4>📝 Notes</h4>
                        <p>${invoice.notes.replace(/\n/g, '<br>')}</p>
                    </div>
                    ` : ''}

                    ${invoice.terms ? `
                    <div class="terms-section">
                        <h4>📋 Terms & Conditions</h4>
                        <p>${invoice.terms.replace(/\n/g, '<br>')}</p>
                    </div>
                    ` : ''}

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

                    <div class="footer">
                        <p>This is a computer-generated invoice. Prices are subject to change without prior notice.</p>
                        <p>Thank you for your business with Thoon Enterprises!</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    };

    const handleCreateInvoice = () => {
        // Basic validation
        if (!invoiceFormData.customerName || !invoiceFormData.phone || !invoiceFormData.area || !invoiceFormData.dueDate) {
            alert('Please fill all required fields');
            return;
        }
        
        // Validate at least one item with valid data
        const validItems = invoiceItems.filter(item => item.category && item.quantity > 0 && item.rate > 0);
        if (validItems.length === 0) {
            alert('Please add at least one valid item with category, quantity, and rate');
            return;
        }
        
        // Create invoice object
        const subtotal = calculateInvoiceSubtotal();
        const discount = invoiceFormData.discount || 0;
        const gstAmount = calculateInvoiceGST();
        const total = calculateInvoiceTotal();
        
        const invoice = {
            id: 'inv-' + Date.now(),
            invoiceNo: 'INV-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6),
            customerName: invoiceFormData.customerName,
            phone: invoiceFormData.phone,
            email: invoiceFormData.email || undefined,
            area: invoiceFormData.area,
            address: invoiceFormData.address || undefined,
            city: invoiceFormData.city || undefined,
            state: invoiceFormData.state || undefined,
            pincode: invoiceFormData.pincode || undefined,
            gstin: invoiceFormData.gstin || undefined,
            date: new Date().toISOString().split('T')[0],
            dueDate: invoiceFormData.dueDate,
            placeOfSupply: invoiceFormData.placeOfSupply || 'Tamil Nadu',
            items: validItems,
            subtotal: subtotal,
            discount: discount,
            deliveryCharge: invoiceDeliveryCharge,
            gstEnabled: invoiceGstEnabled,
            cgst: invoiceGstEnabled ? gstAmount / 2 : 0,
            sgst: invoiceGstEnabled ? gstAmount / 2 : 0,
            totalAmount: total,
            status: 'pending' as const,
            notes: invoiceFormData.notes || undefined,
            terms: invoiceFormData.terms || undefined
        };
        
        // Generate GST Invoice
        generateGSTInvoiceForInvoice(invoice);
        setShowInvoiceModal(false);
        alert('Tax Invoice created successfully!');
    };
    const [editFormData, setEditFormData] = useState({
        customerName: '',
        phone: '',
        email: '',
        area: '',
        address: '',
        validUntil: '',
        notes: '',
        terms: ''
    });

    const [editItems, setEditItems] = useState([{
        category: '',
        type: '',
        brand: '',
        size: '',
        quantity: 1,
        units: 'pcs',
        rate: 0,
        amount: 0
    }]);

    const [editGstEnabled, setEditGstEnabled] = useState(false);
    const [editDeliveryCharge, setEditDeliveryCharge] = useState(0);

    // Product selection state
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedUnits, setSelectedUnits] = useState('');
    const [itemQuantity, setItemQuantity] = useState(1);
    const [itemRate, setItemRate] = useState(0);

    // Get available options based on selections
    const getAvailableTypes = () => {
        if (!selectedCategory || !CATEGORIES[selectedCategory]) return [];
        return CATEGORIES[selectedCategory].types;
    };

    const getAvailableSizes = () => {
        if (!selectedCategory || !CATEGORIES[selectedCategory]) return [];
        return CATEGORIES[selectedCategory].sizes;
    };

    const getAvailableUnits = () => {
        if (!selectedCategory || !CATEGORIES[selectedCategory]) return [];
        return CATEGORIES[selectedCategory].units;
    };

    const getAvailableBrands = () => {
        if (!selectedType) return [];
        return BRANDS[selectedType] || [];
    };

    // Load estimates
    useEffect(() => {
        loadEstimates();
    }, []);

    const loadEstimates = async () => {
        setLoading(true);
        try {
            // Mock data - replace with actual API call
            const mockEstimates: Estimate[] = [
                {
                    id: '1',
                    estimateNo: 'EST-2024-001',
                    customerName: 'Rahul Kumar',
                    phone: '9876543210',
                    email: 'rahul@example.com',
                    area: 'Anna Nagar, Chennai',
                    address: '123, Main Street, Anna Nagar',
                    date: '2024-03-15',
                    validUntil: '2024-04-14',
                    items: [
                        {
                            category: 'Cement',
                            type: 'OPC',
                            brand: 'ACC',
                            size: '50kg',
                            quantity: 100,
                            units: 'bags',
                            rate: 350,
                            amount: 35000
                        },
                        {
                            category: 'Steel',
                            type: 'TMT',
                            brand: 'TATA',
                            size: '12mm',
                            quantity: 2,
                            units: 'tons',
                            rate: 45000,
                            amount: 90000
                        }
                    ],
                    subtotal: 125000,
                    deliveryCharge: 2000,
                    gstEnabled: true,
                    cgst: 11250,
                    sgst: 11250,
                    totalAmount: 147500,
                    status: 'sent',
                    notes: 'Prices include transportation within Chennai city limits',
                    terms: '1. Prices are valid for 30 days\n2. Delivery charges extra as applicable\n3. Payment terms: 50% advance, 50% on delivery'
                },
                {
                    id: '2',
                    estimateNo: 'EST-2024-002',
                    customerName: 'Priya Sharma',
                    phone: '9876543211',
                    area: 'T. Nagar, Chennai',
                    date: '2024-03-14',
                    validUntil: '2024-04-13',
                    items: [
                        {
                            category: 'Bricks',
                            type: 'Clay',
                            brand: 'Local',
                            size: '9inch',
                            quantity: 5000,
                            units: 'pieces',
                            rate: 6,
                            amount: 30000
                        }
                    ],
                    subtotal: 30000,
                    deliveryCharge: 1500,
                    gstEnabled: false,
                    cgst: 0,
                    sgst: 0,
                    totalAmount: 31500,
                    status: 'draft'
                }
            ];
            setEstimates(mockEstimates);
        } catch (error) {
            console.error('Error loading estimates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEstimate = () => {
        setShowCreateModal(true);
    };

    const handleViewEstimate = (estimate: Estimate) => {
        setSelectedEstimate(estimate);
        setShowViewModal(true);
    };

    const handleEditEstimate = (estimate: Estimate) => {
        setEditingEstimate(estimate);
        setEditFormData({
            customerName: estimate.customerName,
            phone: estimate.phone,
            email: estimate.email || '',
            area: estimate.area,
            address: estimate.address || '',
            validUntil: estimate.validUntil,
            notes: estimate.notes || '',
            terms: estimate.terms || ''
        });
        
        // Convert EstimateItem[] to editItems format with all required properties
        const convertedItems = estimate.items.length > 0 ? estimate.items.map(item => ({
            category: item.category || '',
            type: item.type || '',
            brand: item.brand || '',
            size: item.size || '',
            quantity: item.quantity,
            units: item.units,
            rate: item.rate,
            amount: item.amount
        })) : [{
            category: '',
            type: '',
            brand: '',
            size: '',
            quantity: 1,
            units: 'pcs',
            rate: 0,
            amount: 0
        }];
        
        setEditItems(convertedItems);
        setEditGstEnabled(estimate.gstEnabled);
        setEditDeliveryCharge(estimate.deliveryCharge);
        setShowEditModal(true);
    };

    // Item management functions
    const addItem = () => {
        setItems([...items, {
            category: '',
            type: '',
            brand: '',
            size: '',
            quantity: 1,
            units: 'pcs',
            rate: 0,
            amount: 0
        }]);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems.length > 0 ? newItems : [{
            category: '',
            type: '',
            brand: '',
            size: '',
            quantity: 1,
            units: 'pcs',
            rate: 0,
            amount: 0
        }]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // Calculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
            const quantity = parseFloat(value.toString()) || 0;
            const rate = parseFloat(newItems[index].rate.toString()) || 0;
            newItems[index].amount = quantity * rate;
        }
        
        setItems(newItems);
    };

    // Calculate totals
    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (parseFloat(item.amount.toString()) || 0), 0);
    };

    const calculateGST = () => {
        const subtotal = calculateSubtotal();
        return gstEnabled ? subtotal * 0.18 : 0;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + deliveryCharge + calculateGST();
    };

    // Edit item management functions
    const addEditItem = () => {
        setEditItems([...editItems, {
            category: '',
            type: '',
            brand: '',
            size: '',
            quantity: 1,
            units: 'pcs',
            rate: 0,
            amount: 0
        }]);
    };

    const removeEditItem = (index: number) => {
        const newItems = editItems.filter((_, i) => i !== index);
        setEditItems(newItems.length > 0 ? newItems : [{
            category: '',
            type: '',
            brand: '',
            size: '',
            quantity: 1,
            units: 'pcs',
            rate: 0,
            amount: 0
        }]);
    };

    const updateEditItem = (index: number, field: string, value: any) => {
        const newItems = [...editItems];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // Calculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
            const quantity = parseFloat(value.toString()) || 0;
            const rate = parseFloat(newItems[index].rate.toString()) || 0;
            newItems[index].amount = quantity * rate;
        }
        
        setEditItems(newItems);
    };

    // Edit calculation functions
    const calculateEditSubtotal = () => {
        return editItems.reduce((sum, item) => sum + (parseFloat(item.amount.toString()) || 0), 0);
    };

    const calculateEditGST = () => {
        const subtotal = calculateEditSubtotal();
        return editGstEnabled ? subtotal * 0.18 : 0;
    };

    const calculateEditTotal = () => {
        return calculateEditSubtotal() + editDeliveryCharge + calculateEditGST();
    };

    // Product selection functions
    const resetProductSelector = () => {
        setSelectedCategory('');
        setSelectedType('');
        setSelectedBrand('');
        setSelectedSize('');
        setSelectedUnits('');
        setItemQuantity(1);
        setItemRate(0);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setSelectedType('');
        setSelectedBrand('');
        setSelectedSize('');
        setSelectedUnits('');
    };

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        setSelectedBrand('');
    };

    const addProductFromSelector = () => {
        if (!selectedCategory || !selectedType || itemQuantity <= 0 || itemRate <= 0) {
            alert('Please select category, type and enter valid quantity and rate');
            return;
        }

        const newItem = {
            category: selectedCategory,
            type: selectedType,
            brand: selectedBrand,
            size: selectedSize,
            quantity: itemQuantity,
            units: selectedUnits,
            rate: itemRate,
            amount: itemQuantity * itemRate
        };

        setItems([...items, newItem]);
        resetProductSelector();
        setShowProductSelector(false);
    };

    const handlePrintEstimate = (estimate: Estimate) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Estimate - ${estimate.estimateNo}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                    .estimate-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
                    .company-name { font-size: 28px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
                    .document-title { font-size: 20px; font-weight: bold; color: #dc2626; margin: 15px 0; }
                    .estimate-number { font-size: 18px; color: #374151; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
                    .info-section h3 { font-size: 14px; font-weight: bold; color: #6b7280; margin-bottom: 10px; text-transform: uppercase; }
                    .info-section p { margin: 5px 0; color: #374151; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .items-table th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; color: #374151; border: 1px solid #e5e7eb; }
                    .items-table td { padding: 12px; border: 1px solid #e5e7eb; }
                    .items-table .text-right { text-align: right; }
                    .totals-section { margin-top: 30px; }
                    .totals-table { width: 300px; margin-left: auto; border-collapse: collapse; }
                    .totals-table td { padding: 8px 12px; border: none; }
                    .totals-table .label { font-weight: 600; color: #374151; }
                    .totals-table .amount { text-align: right; font-family: 'Courier New', monospace; font-weight: bold; }
                    .totals-table .total-row { border-top: 2px solid #374151; font-size: 16px; font-weight: bold; color: #1f2937; }
                    .notes-section { margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 6px; }
                    .notes-section h3 { font-size: 14px; font-weight: bold; color: #6b7280; margin-bottom: 10px; text-transform: uppercase; }
                    .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
                    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
                    .status-draft { background: #fef3c7; color: #92400e; }
                    .status-sent { background: #dbeafe; color: #1e40af; }
                    .status-accepted { background: #d1fae5; color: #065f46; }
                    .status-rejected { background: #fee2e2; color: #991b1b; }
                    .status-expired { background: #f3f4f6; color: #6b7280; }
                </style>
            </head>
            <body>
                <div class="estimate-container">
                    <div class="header">
                        <div class="company-name">THOON ENTERPRISES</div>
                        <div class="document-price-list">PRICE ESTIMATE</div>
                        <div class="estimate-number">Estimate No: ${estimate.estimateNo}</div>
                        <div class="status-badge status-${estimate.status}">${estimate.status}</div>
                    </div>

                    <div class="info-grid">
                        <div class="info-section">
                            <h3>Customer Details</h3>
                            <p><strong>Name:</strong> ${estimate.customerName}</p>
                            <p><strong>Phone:</strong> ${estimate.phone}</p>
                            ${estimate.email ? `<p><strong>Email:</strong> ${estimate.email}</p>` : ''}
                            <p><strong>Area:</strong> ${estimate.area}</p>
                            ${estimate.address ? `<p><strong>Address:</strong> ${estimate.address}</p>` : ''}
                        </div>
                        <div class="info-section">
                            <h3>Estimate Details</h3>
                            <p><strong>Estimate Date:</strong> ${new Date(estimate.date).toLocaleDateString()}</p>
                            <p><strong>Valid Until:</strong> ${new Date(estimate.validUntil).toLocaleDateString()}</p>
                            <p><strong>Sales Person:</strong> Admin</p>
                        </div>
                    </div>

                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Category</th>
                                <th>Type</th>
                                <th>Brand</th>
                                <th>Size</th>
                                <th class="text-center">Qty</th>
                                <th>Units</th>
                                <th class="text-right">Rate</th>
                                <th class="text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${estimate.items.map((item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.category}</td>
                                    <td>${item.type || '-'}</td>
                                    <td>${item.brand || '-'}</td>
                                    <td>${item.size || '-'}</td>
                                    <td class="text-center">${item.quantity}</td>
                                    <td>${item.units}</td>
                                    <td class="text-right">₹${item.rate.toLocaleString()}</td>
                                    <td class="text-right">₹${item.amount.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="totals-section">
                        <table class="totals-table">
                            <tr>
                                <td class="label">Subtotal:</td>
                                <td class="amount">₹${estimate.subtotal.toLocaleString()}</td>
                            </tr>
                            ${estimate.deliveryCharge > 0 ? `
                                <tr>
                                    <td class="label">Delivery Charge:</td>
                                    <td class="amount">₹${estimate.deliveryCharge.toLocaleString()}</td>
                                </tr>
                            ` : ''}
                            ${estimate.gstEnabled ? `
                                <tr>
                                    <td class="label">CGST @ 9%:</td>
                                    <td class="amount">₹${estimate.cgst.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td class="label">SGST @ 9%:</td>
                                    <td class="amount">₹${estimate.sgst.toLocaleString()}</td>
                                </tr>
                            ` : ''}
                            <tr class="total-row">
                                <td class="label">Total Estimate:</td>
                                <td class="amount">₹${estimate.totalAmount.toLocaleString()}</td>
                            </tr>
                        </table>
                    </div>

                    ${estimate.notes ? `
                        <div class="notes-section">
                            <h3>Notes</h3>
                            <p>${estimate.notes.replace(/\n/g, '<br>')}</p>
                        </div>
                    ` : ''}

                    ${estimate.terms ? `
                        <div class="notes-section">
                            <h3>Terms & Conditions</h3>
                            <p>${estimate.terms.replace(/\n/g, '<br>')}</p>
                        </div>
                    ` : ''}

                    <div class="footer">
                        <p>This is a computer-generated estimate. Prices are subject to change without prior notice.</p>
                        <p>Thank you for your business with Thoon Enterprises!</p>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    };

    // Generate GST Invoice
    const generateGSTInvoice = (estimate: Estimate) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Tax Invoice - ${estimate.estimateNo}</title>
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
                            <div class="invoice-number">Invoice No: INV-${estimate.estimateNo.replace('EST-', '')}</div>
                            <div class="invoice-date">Date: ${new Date().toLocaleDateString()}</div>
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
                            <p><strong>${estimate.customerName}</strong></p>
                            <p>${estimate.address || estimate.area}</p>
                            <p>${estimate.area}</p>
                            ${estimate.email ? `<p>Email: ${estimate.email}</p>` : ''}
                            <p>Phone: ${estimate.phone}</p>
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
                            ${estimate.items.map((item, index) => {
                                const hsnCode = item.category === 'Cement' ? '2523' : 
                                             item.category === 'Steel' ? '7308' : 
                                             item.category === 'Bricks' ? '6901' : '9705';
                                const gstRate = estimate.gstEnabled ? 18 : 0;
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
                                <td class="amount">₹${estimate.subtotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td class="label">Delivery Charge:</td>
                                <td class="amount">₹${estimate.deliveryCharge.toFixed(2)}</td>
                            </tr>
                            ${estimate.gstEnabled ? `
                                <tr>
                                    <td class="label">CGST (9%):</td>
                                    <td class="amount">₹${estimate.cgst.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td class="label">SGST (9%):</td>
                                    <td class="amount">₹${estimate.sgst.toFixed(2)}</td>
                                </tr>
                            ` : ''}
                            <tr class="total-row">
                                <td class="label">Grand Total:</td>
                                <td class="amount">₹${estimate.totalAmount.toFixed(2)}</td>
                            </tr>
                        </table>
                    </div>

                    <div class="amount-words">
                        <strong>Amount in Words:</strong> ${numberToWords(estimate.totalAmount)} Rupees Only
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
                            <p><strong>Amount:</strong> ₹${estimate.totalAmount.toFixed(2)}</p>
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

    const filteredEstimates = estimates.filter(estimate => {
        const matchesSearch = estimate.customerName.toLowerCase().includes(search.toLowerCase()) ||
                            estimate.estimateNo.toLowerCase().includes(search.toLowerCase()) ||
                            estimate.phone.includes(search);
        const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'expired': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Price Estimates</h1>
                        <p className="text-gray-600 mt-2">Manage customer price estimates and quotations</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Create Invoice
                        </button>
                        <button
                            onClick={handleCreateEstimate}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Create Estimate
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search estimates..."
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
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Estimates List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Estimate No</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Customer</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Phone</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Date</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Valid Until</th>
                                <th className="text-right py-3 px-6 font-medium text-gray-900">Amount</th>
                                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                                <th className="text-center py-3 px-6 font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEstimates.map((estimate) => (
                                <tr key={estimate.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-6">
                                        <button
                                            onClick={() => handleViewEstimate(estimate)}
                                            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            {estimate.estimateNo}
                                        </button>
                                    </td>
                                    <td className="py-3 px-6 text-gray-900 font-medium">{estimate.customerName}</td>
                                    <td className="py-3 px-6 text-gray-900">{estimate.phone}</td>
                                    <td className="py-3 px-6 text-gray-900">{new Date(estimate.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-6 text-gray-900">{new Date(estimate.validUntil).toLocaleDateString()}</td>
                                    <td className="py-3 px-6 text-right">
                                        <span className="font-medium text-gray-900">₹{estimate.totalAmount.toLocaleString()}</span>
                                    </td>
                                    <td className="py-3 px-6">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(estimate.status)}`}>
                                            {estimate.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleViewEstimate(estimate)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePrintEstimate(estimate)}
                                                className="text-green-600 hover:text-green-800 transition-colors"
                                                title="Print Estimate"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => generateGSTInvoice(estimate)}
                                                className="text-purple-600 hover:text-purple-800 transition-colors"
                                                title="Generate GST Invoice"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditEstimate(estimate)}
                                                className="text-amber-600 hover:text-amber-800 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {showViewModal && selectedEstimate && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowViewModal(false)}
                >
                    <div 
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-600/30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Estimate Details - {selectedEstimate.estimateNo}</h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Customer Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                                    <h3 className="text-lg font-semibold text-cyan-100 mb-3">Customer Details</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-300">{selectedEstimate.customerName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-300">{selectedEstimate.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-300">{selectedEstimate.area}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                                    <h3 className="text-lg font-semibold text-cyan-100 mb-3">Estimate Details</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-300">{selectedEstimate.estimateNo}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-300">Valid until {new Date(selectedEstimate.validUntil).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                selectedEstimate.status === 'accepted' ? 'bg-green-400' :
                                                selectedEstimate.status === 'sent' ? 'bg-blue-400' :
                                                selectedEstimate.status === 'rejected' ? 'bg-red-400' :
                                                'bg-amber-400'
                                            }`}></div>
                                            <span className="text-slate-300 capitalize">{selectedEstimate.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30 mb-6">
                                <h3 className="text-lg font-semibold text-cyan-100 mb-3">Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-600/30">
                                                <th className="text-left py-2 px-3 text-cyan-100">S.No</th>
                                                <th className="text-left py-2 px-3 text-cyan-100">Category</th>
                                                <th className="text-left py-2 px-3 text-cyan-100">Type</th>
                                                <th className="text-left py-2 px-3 text-cyan-100">Brand</th>
                                                <th className="text-left py-2 px-3 text-cyan-100">Size</th>
                                                <th className="text-center py-2 px-3 text-cyan-100">Qty</th>
                                                <th className="text-right py-2 px-3 text-cyan-100">Rate</th>
                                                <th className="text-right py-2 px-3 text-cyan-100">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedEstimate.items.map((item, index) => (
                                                <tr key={index} className="border-b border-slate-600/20">
                                                    <td className="py-2 px-3 text-slate-300">{index + 1}</td>
                                                    <td className="py-2 px-3 text-slate-300">{item.category}</td>
                                                    <td className="py-2 px-3 text-slate-300">{item.type || '-'}</td>
                                                    <td className="py-2 px-3 text-slate-300">{item.brand || '-'}</td>
                                                    <td className="py-2 px-3 text-slate-300">{item.size || '-'}</td>
                                                    <td className="py-2 px-3 text-center text-slate-300">{item.quantity}</td>
                                                    <td className="py-2 px-3 text-right text-slate-300">₹{item.rate.toLocaleString()}</td>
                                                    <td className="py-2 px-3 text-right font-mono text-emerald-400">₹{item.amount.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30 mb-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-300">Subtotal</span>
                                        <span className="font-mono font-semibold text-slate-300">₹{selectedEstimate.subtotal.toLocaleString()}</span>
                                    </div>
                                    {selectedEstimate.deliveryCharge > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-300">Delivery Charge</span>
                                            <span className="font-mono font-semibold text-slate-300">₹{selectedEstimate.deliveryCharge.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {selectedEstimate.gstEnabled && (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-300">CGST (9%)</span>
                                                <span className="font-mono font-semibold text-slate-300">₹{selectedEstimate.cgst.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-300">SGST (9%)</span>
                                                <span className="font-mono font-semibold text-slate-300">₹{selectedEstimate.sgst.toLocaleString()}</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="h-px bg-slate-600 my-2"></div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-white">Total Amount</span>
                                        <span className="font-mono font-bold text-xl text-emerald-400">₹{selectedEstimate.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => handlePrintEstimate(selectedEstimate)}
                                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                                >
                                    <Printer className="h-4 w-4" />
                                    Print Estimate
                                </button>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="bg-slate-600 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Estimate Modal */}
            {showCreateModal && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div 
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-slate-600/30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Create New Estimate</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Customer Details */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">Customer Details</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Customer Name *</label>
                                        <input
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter customer name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone *</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>

                                {/* Address & Validity */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">Address & Validity</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Area *</label>
                                        <input
                                            type="text"
                                            value={formData.area}
                                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter area/location"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter full address"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Valid Until *</label>
                                        <input
                                            type="date"
                                            value={formData.validUntil}
                                            onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">Items / Products</h3>
                                    <button
                                        type="button"
                                        onClick={() => setShowProductSelector(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Product
                                    </button>
                                </div>
                                
                                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="text-left py-3 px-4 font-semibold text-slate-800 text-sm">Category</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-slate-800 text-sm">Type</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-slate-800 text-sm">Brand</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-slate-800 text-sm">Size</th>
                                                    <th className="text-center py-3 px-4 font-semibold text-slate-800 text-sm">Quantity</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-slate-800 text-sm">Units</th>
                                                    <th className="text-right py-3 px-4 font-semibold text-slate-800 text-sm">Rate (₹)</th>
                                                    <th className="text-right py-3 px-4 font-semibold text-slate-800 text-sm">Amount (₹)</th>
                                                    <th className="text-center py-3 px-4 font-semibold text-slate-800 text-sm">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map((item, index) => (
                                                    <tr key={index} className="border-b border-slate-100">
                                                        <td className="py-3 px-4">
                                                            <input
                                                                type="text"
                                                                value={item.category}
                                                                onChange={(e) => updateItem(index, 'category', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Category"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <input
                                                                type="text"
                                                                value={item.type}
                                                                onChange={(e) => updateItem(index, 'type', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Type"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <input
                                                                type="text"
                                                                value={item.brand}
                                                                onChange={(e) => updateItem(index, 'brand', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Brand"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <input
                                                                type="text"
                                                                value={item.size}
                                                                onChange={(e) => updateItem(index, 'size', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Size"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                                                placeholder="Qty"
                                                                min="1"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <select
                                                                value={item.units}
                                                                onChange={(e) => updateItem(index, 'units', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="pcs">Pcs</option>
                                                                <option value="kg">Kg</option>
                                                                <option value="tons">Tons</option>
                                                                <option value="bags">Bags</option>
                                                                <option value="meters">Meters</option>
                                                                <option value="feet">Feet</option>
                                                                <option value="liters">Liters</option>
                                                            </select>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <input
                                                                type="number"
                                                                value={item.rate}
                                                                onChange={(e) => updateItem(index, 'rate', e.target.value)}
                                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                                                placeholder="Rate"
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 text-sm text-right font-medium">
                                                                ₹{item.amount.toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                                title="Remove Item"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Amount Calculation Section */}
                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Amount Calculation</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">Subtotal:</span>
                                        <span className="font-mono font-semibold text-slate-900">₹{calculateSubtotal().toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between gap-4">
                                        <label className="text-slate-600">Delivery Charge:</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-900">₹</span>
                                            <input
                                                type="number"
                                                value={deliveryCharge}
                                                onChange={(e) => setDeliveryCharge(parseFloat(e.target.value) || 0)}
                                                className="w-32 px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between gap-4">
                                        <label className="text-slate-600">Enable GST (18%):</label>
                                        <input
                                            type="checkbox"
                                            checked={gstEnabled}
                                            onChange={(e) => setGstEnabled(e.target.checked)}
                                            className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    {gstEnabled && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-600">GST Amount (18%):</span>
                                            <span className="font-mono font-semibold text-slate-900">₹{calculateGST().toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    <div className="border-t border-slate-300 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-slate-800">Total Amount:</span>
                                            <span className="font-mono font-bold text-lg text-green-600">₹{calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes & Terms */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                        placeholder="Enter notes (optional)"
                                        rows={4}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Terms & Conditions</label>
                                    <textarea
                                        value={formData.terms}
                                        onChange={(e) => setFormData({...formData, terms: e.target.value})}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                        placeholder="Enter terms and conditions"
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="bg-slate-600 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // Basic validation
                                        if (!formData.customerName || !formData.phone || !formData.area || !formData.validUntil) {
                                            alert('Please fill all required fields');
                                            return;
                                        }
                                        
                                        // Validate at least one item with valid data
                                        const validItems = items.filter(item => item.category && item.quantity > 0 && item.rate > 0);
                                        if (validItems.length === 0) {
                                            alert('Please add at least one valid item with category, quantity, and rate');
                                            return;
                                        }
                                        
                                        // Create new estimate with proper calculations
                                        const subtotal = calculateSubtotal();
                                        const gstAmount = calculateGST();
                                        const total = calculateTotal();
                                        
                                        const newEstimate = {
                                            id: Date.now().toString(),
                                            estimateNo: `EST-2024-${String(estimates.length + 1).padStart(3, '0')}`,
                                            customerName: formData.customerName,
                                            phone: formData.phone,
                                            email: formData.email || undefined,
                                            area: formData.area,
                                            address: formData.address || undefined,
                                            date: new Date().toISOString().split('T')[0],
                                            validUntil: formData.validUntil,
                                            items: validItems,
                                            subtotal: subtotal,
                                            deliveryCharge: deliveryCharge,
                                            gstEnabled: gstEnabled,
                                            cgst: gstEnabled ? gstAmount / 2 : 0,
                                            sgst: gstEnabled ? gstAmount / 2 : 0,
                                            totalAmount: total,
                                            status: 'draft' as const,
                                            notes: formData.notes || undefined,
                                            terms: formData.terms || undefined
                                        };
                                        
                                        setEstimates([...estimates, newEstimate]);
                                        setShowCreateModal(false);
                                        
                                        // Reset form
                                        setFormData({
                                            customerName: '',
                                            phone: '',
                                            email: '',
                                            area: '',
                                            address: '',
                                            validUntil: '',
                                            notes: '',
                                            terms: '1. Prices are valid for 30 days\n2. Delivery charges extra as applicable\n3. Payment terms: 50% advance, 50% on delivery\n4. Warranty as per manufacturer terms'
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
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                                >
                                    Create Estimate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Selector Modal */}
            {showProductSelector && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowProductSelector(false)}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Add Product</h2>
                                <button
                                    onClick={() => {
                                        setShowProductSelector(false);
                                        resetProductSelector();
                                    }}
                                    className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Category Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Category</option>
                                        {CATEGORY_LIST.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => handleTypeChange(e.target.value)}
                                        disabled={!selectedCategory}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                    >
                                        <option value="">Select Type</option>
                                        {getAvailableTypes().map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Brand Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                                    <select
                                        value={selectedBrand}
                                        onChange={(e) => setSelectedBrand(e.target.value)}
                                        disabled={!selectedType}
                                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                    >
                                        <option value="">Select Brand</option>
                                        {getAvailableBrands().map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quantity and Rate */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Quantity *</label>
                                        <input
                                            type="number"
                                            value={itemQuantity}
                                            onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Quantity"
                                            min="1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Rate (₹) *</label>
                                        <input
                                            type="number"
                                            value={itemRate}
                                            onChange={(e) => setItemRate(parseFloat(e.target.value) || 0)}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Rate per unit"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>

                                {/* Amount Display */}
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-slate-700">Total Amount:</span>
                                        <span className="text-xl font-bold text-green-600">₹{(itemQuantity * itemRate).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 justify-end pt-4">
                                    <button
                                        onClick={() => {
                                            setShowProductSelector(false);
                                            resetProductSelector();
                                        }}
                                        className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addProductFromSelector}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
                                    >
                                        Add Product
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Estimate Modal */}
            {showEditModal && editingEstimate && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20"
                    onClick={() => setShowEditModal(false)}
                >
                    <div 
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[80vh] overflow-y-auto border border-slate-600/30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Edit Estimate - {editingEstimate.estimateNo}</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Customer Details */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">Customer Details</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Customer Name *</label>
                                        <input
                                            type="text"
                                            value={editFormData.customerName}
                                            onChange={(e) => setEditFormData({...editFormData, customerName: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter customer name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone *</label>
                                        <input
                                            type="tel"
                                            value={editFormData.phone}
                                            onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={editFormData.email}
                                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>

                                {/* Address & Validity */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">Address & Validity</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Area *</label>
                                        <input
                                            type="text"
                                            value={editFormData.area}
                                            onChange={(e) => setEditFormData({...editFormData, area: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter area/location"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                                        <textarea
                                            value={editFormData.address}
                                            onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter full address"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Valid Until *</label>
                                        <input
                                            type="date"
                                            value={editFormData.validUntil}
                                            onChange={(e) => setEditFormData({...editFormData, validUntil: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Edit Action Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="bg-slate-600 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // Basic validation
                                        if (!editFormData.customerName || !editFormData.phone || !editFormData.area || !editFormData.validUntil) {
                                            alert('Please fill all required fields');
                                            return;
                                        }
                                        
                                        // Update estimate with proper calculations
                                        const subtotal = calculateEditSubtotal();
                                        const gstAmount = calculateEditGST();
                                        const total = calculateEditTotal();
                                        
                                        const updatedEstimate = {
                                            ...editingEstimate,
                                            customerName: editFormData.customerName,
                                            phone: editFormData.phone,
                                            email: editFormData.email || undefined,
                                            area: editFormData.area,
                                            address: editFormData.address || undefined,
                                            validUntil: editFormData.validUntil,
                                            items: editItems,
                                            subtotal: subtotal,
                                            deliveryCharge: editDeliveryCharge,
                                            gstEnabled: editGstEnabled,
                                            cgst: editGstEnabled ? gstAmount / 2 : 0,
                                            sgst: editGstEnabled ? gstAmount / 2 : 0,
                                            totalAmount: total,
                                            notes: editFormData.notes || undefined,
                                            terms: editFormData.terms || undefined
                                        };
                                        
                                        // Update the estimate in the list
                                        setEstimates(estimates.map(est => 
                                            est.id === editingEstimate.id ? updatedEstimate : est
                                        ));
                                        
                                        setShowEditModal(false);
                                        alert('Estimate updated successfully!');
                                    }}
                                    className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/25"
                                >
                                    Update Estimate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Create Tax Invoice Modal */}
            {showInvoiceModal && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20"
                    onClick={() => setShowInvoiceModal(false)}
                >
                    <div 
                        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[80vh] overflow-y-auto border border-slate-600/30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Create Tax Invoice</h2>
                                <button
                                    onClick={() => setShowInvoiceModal(false)}
                                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Invoice Header Information */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Invoice Number *</label>
                                    <input
                                        type="text"
                                        value={`INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`}
                                        readOnly
                                        className="w-full px-3 py-2 bg-slate-600/50 border border-slate-600/50 rounded-lg text-slate-300 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Invoice Date *</label>
                                    <input
                                        type="date"
                                        value={new Date().toISOString().split('T')[0]}
                                        readOnly
                                        className="w-full px-3 py-2 bg-slate-600/50 border border-slate-600/50 rounded-lg text-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Due Date *</label>
                                    <input
                                        type="date"
                                        value={invoiceFormData.dueDate}
                                        onChange={(e) => setInvoiceFormData({...invoiceFormData, dueDate: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Customer Details */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">👤 Customer Details</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Customer Name *</label>
                                        <input
                                            type="text"
                                            value={invoiceFormData.customerName}
                                            onChange={(e) => setInvoiceFormData({...invoiceFormData, customerName: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter customer name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone *</label>
                                        <input
                                            type="tel"
                                            value={invoiceFormData.phone}
                                            onChange={(e) => setInvoiceFormData({...invoiceFormData, phone: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={invoiceFormData.email}
                                            onChange={(e) => setInvoiceFormData({...invoiceFormData, email: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter email address"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">GSTIN (Optional)</label>
                                        <input
                                            type="text"
                                            value={invoiceFormData.gstin || ''}
                                            onChange={(e) => setInvoiceFormData({...invoiceFormData, gstin: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter GSTIN number"
                                        />
                                    </div>
                                </div>

                                {/* Address & Billing */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">📍 Billing Address</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Area/Location *</label>
                                        <input
                                            type="text"
                                            value={invoiceFormData.area}
                                            onChange={(e) => setInvoiceFormData({...invoiceFormData, area: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter area/location"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Street Address</label>
                                        <textarea
                                            value={invoiceFormData.address}
                                            onChange={(e) => setInvoiceFormData({...invoiceFormData, address: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                            placeholder="Enter full street address"
                                            rows={2}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
                                            <input
                                                type="text"
                                                value={invoiceFormData.city || ''}
                                                onChange={(e) => setInvoiceFormData({...invoiceFormData, city: e.target.value})}
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                value={invoiceFormData.pincode || ''}
                                                onChange={(e) => setInvoiceFormData({...invoiceFormData, pincode: e.target.value})}
                                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Pincode"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
                                        <select
                                            value={invoiceFormData.state || 'Tamil Nadu'}
                                            onChange={(e) => setInvoiceFormData({...invoiceFormData, state: e.target.value})}
                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Kerala">Kerala</option>
                                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                                            <option value="Telangana">Telangana</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Tax Invoice Items */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-blue-100 mb-4">📦 Invoice Items</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-700/50 border border-slate-600/30">
                                                <th className="text-left py-3 px-4 text-blue-100 font-medium">Category</th>
                                                <th className="text-left py-3 px-4 text-blue-100 font-medium">Type</th>
                                                <th className="text-left py-3 px-4 text-blue-100 font-medium">Brand</th>
                                                <th className="text-left py-3 px-4 text-blue-100 font-medium">Size</th>
                                                <th className="text-center py-3 px-4 text-blue-100 font-medium">Qty</th>
                                                <th className="text-center py-3 px-4 text-blue-100 font-medium">Units</th>
                                                <th className="text-right py-3 px-4 text-blue-100 font-medium">Rate</th>
                                                <th className="text-right py-3 px-4 text-blue-100 font-medium">Amount</th>
                                                <th className="text-center py-3 px-4 text-blue-100 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoiceItems.map((item, index) => (
                                                <tr key={index} className="border border-slate-600/30">
                                                    <td className="py-2 px-4">
                                                        <select
                                                            value={item.category}
                                                            onChange={(e) => {
                                                                const newItems = [...invoiceItems];
                                                                newItems[index].category = e.target.value;
                                                                newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                                                                setInvoiceItems(newItems);
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select</option>
                                                            {CATEGORY_LIST.map(cat => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="text"
                                                            value={item.type}
                                                            onChange={(e) => {
                                                                const newItems = [...invoiceItems];
                                                                newItems[index].type = e.target.value;
                                                                setInvoiceItems(newItems);
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            placeholder="Type"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="text"
                                                            value={item.brand}
                                                            onChange={(e) => {
                                                                const newItems = [...invoiceItems];
                                                                newItems[index].brand = e.target.value;
                                                                setInvoiceItems(newItems);
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            placeholder="Brand"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="text"
                                                            value={item.size}
                                                            onChange={(e) => {
                                                                const newItems = [...invoiceItems];
                                                                newItems[index].size = e.target.value;
                                                                setInvoiceItems(newItems);
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            placeholder="Size"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const newItems = [...invoiceItems];
                                                                newItems[index].quantity = parseInt(e.target.value) || 0;
                                                                newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                                                                setInvoiceItems(newItems);
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            placeholder="Qty"
                                                            min="0"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <select
                                                            value={item.units}
                                                            onChange={(e) => {
                                                                const newItems = [...invoiceItems];
                                                                newItems[index].units = e.target.value;
                                                                setInvoiceItems(newItems);
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="number"
                                                            value={item.rate}
                                                            onChange={(e) => {
                                                                const newItems = [...invoiceItems];
                                                                newItems[index].rate = parseFloat(e.target.value) || 0;
                                                                newItems[index].amount = newItems[index].quantity * newItems[index].rate;
                                                                setInvoiceItems(newItems);
                                                            }}
                                                            className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-sm text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            placeholder="Rate"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4">
                                                        <input
                                                            type="text"
                                                            value={item.amount.toFixed(2)}
                                                            readOnly
                                                            className="w-full px-2 py-1 bg-slate-600/50 border border-slate-600/50 rounded text-slate-300 text-sm text-right font-mono"
                                                        />
                                                    </td>
                                                    <td className="py-2 px-4 text-center">
                                                        <button
                                                            onClick={() => {
                                                                if (invoiceItems.length > 1) {
                                                                    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
                                                                }
                                                            }}
                                                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                            disabled={invoiceItems.length === 1}
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
                                    onClick={() => setInvoiceItems([...invoiceItems, {
                                        category: '',
                                        type: '',
                                        brand: '',
                                        size: '',
                                        quantity: 1,
                                        units: 'pcs',
                                        rate: 0,
                                        amount: 0
                                    }])}
                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Item Row
                                </button>
                            </div>

                            {/* Tax Calculation Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {/* Charges */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">💰 Charges</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-300">Subtotal:</label>
                                            <span className="font-mono font-semibold text-slate-200">₹{calculateInvoiceSubtotal().toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-300">Delivery Charge:</label>
                                            <input
                                                type="number"
                                                value={invoiceDeliveryCharge}
                                                onChange={(e) => setInvoiceDeliveryCharge(parseFloat(e.target.value) || 0)}
                                                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="0"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-300">Discount:</label>
                                            <input
                                                type="number"
                                                value={invoiceFormData.discount || 0}
                                                onChange={(e) => setInvoiceFormData({...invoiceFormData, discount: parseFloat(e.target.value) || 0})}
                                                className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="0"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tax Details */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">🧾 Tax Details</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-300">Place of Supply:</label>
                                            <select
                                                value={invoiceFormData.placeOfSupply || 'Tamil Nadu'}
                                                onChange={(e) => setInvoiceFormData({...invoiceFormData, placeOfSupply: e.target.value})}
                                                className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="Tamil Nadu (33)">Tamil Nadu (33)</option>
                                                <option value="Karnataka (29)">Karnataka (29)</option>
                                                <option value="Kerala (32)">Kerala (32)</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-300">Enable GST (18%):</label>
                                            <input
                                                type="checkbox"
                                                checked={invoiceGstEnabled}
                                                onChange={(e) => setInvoiceGstEnabled(e.target.checked)}
                                                className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                                            />
                                        </div>
                                        
                                        {invoiceGstEnabled && (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-300">CGST (9%):</span>
                                                    <span className="font-mono font-semibold text-emerald-400">₹{(calculateInvoiceGST() / 2).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-300">SGST (9%):</span>
                                                    <span className="font-mono font-semibold text-emerald-400">₹{(calculateInvoiceGST() / 2).toFixed(2)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">📊 Total</h3>
                                    
                                    <div className="space-y-3">
                                        <div className="border-t border-slate-600/30 pt-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-slate-300">Taxable Amount:</span>
                                                <span className="font-mono font-semibold text-slate-200">₹{(calculateInvoiceSubtotal() + invoiceDeliveryCharge - (invoiceFormData.discount || 0)).toFixed(2)}</span>
                                            </div>
                                            {invoiceGstEnabled && (
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-slate-300">Total GST:</span>
                                                    <span className="font-mono font-semibold text-emerald-400">₹{calculateInvoiceGST().toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-slate-200">Total Amount:</span>
                                                <span className="font-mono font-bold text-lg text-emerald-400">₹{calculateInvoiceTotal().toFixed(2)}</span>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-2">
                                                Amount in Words: <span className="font-medium">{numberToWords(calculateInvoiceTotal())} Rupees Only</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">📝 Notes</h3>
                                    <textarea
                                        value={invoiceFormData.notes}
                                        onChange={(e) => setInvoiceFormData({...invoiceFormData, notes: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter invoice notes (optional)"
                                        rows={4}
                                    />
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-100 mb-4">📋 Terms & Conditions</h3>
                                    <textarea
                                        value={invoiceFormData.terms}
                                        onChange={(e) => setInvoiceFormData({...invoiceFormData, terms: e.target.value})}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter terms and conditions"
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowInvoiceModal(false)}
                                    className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateInvoice}
                                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Generate Tax Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
