'use client';

import React, { useState, useEffect } from 'react';

interface EstimateItem {
  id: string;
  sno: number;
  category: string;
  type: string;
  brand: string;
  size: string;
  quantity: string;
  units: string;
  rate: string;
  amount: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
  projectLocation: string;
  deliveryAddress: string;
}

const EstimatePageNew: React.FC = () => {
  const [estimateNumber, setEstimateNumber] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    projectLocation: '',
    deliveryAddress: ''
  });
  const [items, setItems] = useState<EstimateItem[]>([
    {
      id: '1',
      sno: 1,
      category: '',
      type: '',
      brand: '',
      size: '',
      quantity: '',
      units: '',
      rate: '',
      amount: 0
    }
  ]);
  const [notes, setNotes] = useState<string>('');
  const [subtotal, setSubtotal] = useState<number>(0);
  const [cgst, setCgst] = useState<number>(0);
  const [sgst, setSgst] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [customerHistory, setCustomerHistory] = useState<any[]>([]);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [gstEnabled, setGstEnabled] = useState<boolean>(false);

  const CGST_RATE = 0.09; // 9%
  const SGST_RATE = 0.09; // 9%
  const TOTAL_GST_RATE = CGST_RATE + SGST_RATE; // 18% total GST

  // Categories and types data (reusing from existing system)
  const CATEGORIES: Record<string, { sizes: string[]; types: string[]; units: string[] }> = {
    'Cement': {
      sizes: ['50kg', '25kg'],
      types: ['PPC', 'OPC 43', 'OPC 53', 'PSC'],
      units: ['Bags']
    },
    'Steel': {
      sizes: ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm'],
      types: ['TMT', 'MS'],
      units: ['Ton', 'Kgs', 'Pieces']
    },
    'Bricks': {
      sizes: ['4" 6" 9"', 'Modular'],
      types: ['Red Brick', 'Fly Ash Brick', 'Wire Cut Brick'],
      units: ['Pieces']
    },
    'Blocks': {
      sizes: ['4"', '6"', '8"', '4" Jumbo', '6" Jumbo', '8" Jumbo'],
      types: ['Standard', 'Jumbo'],
      units: ['Pieces', '1000 Nos']
    },
    'Sand': {
      sizes: ['Fine', 'Coarse', 'Mix'],
      types: ['River Sand', 'P-Sand', 'Manufactured Sand'],
      units: ['Cubic Feet', 'Cubic Meter', 'Ton']
    },
    'Aggregate': {
      sizes: ['20mm', '12mm', '6mm'],
      types: ['Blue Metal', 'Granite'],
      units: ['Cubic Feet', 'Cubic Meter', 'Ton']
    }
  };

  const BRANDS: Record<string, string[]> = {
    'PPC': ['Ramco', 'Ultratech', 'ACC', 'JK Lakshmi', 'Shree Cement', 'Bharathi'],
    'OPC 43': ['Ramco', 'Ultratech', 'ACC', 'JK Lakshmi', 'Shree Cement', 'Bharathi'],
    'OPC 53': ['Ramco', 'Ultratech', 'ACC', 'JK Lakshmi', 'Shree Cement', 'Bharathi'],
    'PSC': ['Ramco', 'Ultratech', 'ACC', 'JK Lakshmi', 'Shree Cement', 'Bharathi'],
    'TMT': ['TATA Tiscon', 'JSW Steel', 'SAIL', 'Vizag Steel', 'Kamdhenu', 'SRMB'],
    'MS': ['TATA Tiscon', 'JSW Steel', 'SAIL', 'Vizag Steel', 'Kamdhenu', 'SRMB'],
    'Red Brick': ['Kashmir Bricks', 'AP Bricks', 'Local Bricks'],
    'Fly Ash Brick': ['Kashmir Bricks', 'AP Bricks', 'Local Bricks'],
    'Wire Cut Brick': ['Kashmir Bricks', 'AP Bricks', 'Local Bricks'],
    'Standard': ['AAC Blocks Ltd', 'Magicrete', 'HIL'],
    'Jumbo': ['AAC Blocks Ltd', 'Magicrete', 'HIL'],
    'River Sand': ['Local Sand Suppliers', 'Construction Sand Co'],
    'P-Sand': ['Local Sand Suppliers', 'Construction Sand Co'],
    'Manufactured Sand': ['Local Sand Suppliers', 'Construction Sand Co'],
    'Blue Metal': ['Local Quarry', 'Stone Crushers'],
    'Granite': ['Local Quarry', 'Stone Crushers']
  };

  // Generate estimate number on component mount
  useEffect(() => {
    const generateEstimateNumber = async () => {
      try {
        // Fetch all estimates to determine next number
        const response = await fetch('/api/billing');
        const estimates = await response.json();
        
        // Find the highest sequence number from existing estimates
        const highestSequence = estimates.reduce((max: number, estimate: any) => {
          const match = estimate.billingNo?.match(/TE-(\d+)/);
          if (match) {
            const sequence = parseInt(match[1]);
            return sequence > max ? sequence : max;
          }
          return max;
        }, 0);
        
        const nextSequence = highestSequence + 1;
        const nextEstimateNo = `TE-${String(nextSequence).padStart(4, '0')}`;
        setEstimateNumber(nextEstimateNo);
      } catch (error) {
        console.error('Error fetching estimates for next number:', error);
        // Fallback to timestamp-based number if API fails
        const timestamp = Date.now().toString().slice(-6);
        setEstimateNumber(`TE-${timestamp}`);
      }
    };
    generateEstimateNumber();
  }, []);

  useEffect(() => {
    const loadCustomerHistory = async () => {
      try {
        const response = await fetch('/api/billing');
        const estimates = await response.json();
        
        const uniqueCustomers = estimates.reduce((acc: any[], estimate: any) => {
          const existingCustomer = acc.find((c: any) => c.name === estimate.customerName && c.phone === estimate.phone);
          if (!existingCustomer) {
            acc.push({
              name: estimate.customerName,
              phone: estimate.phone,
              area: estimate.area,
              lastUsed: estimate.date
            });
          }
          return acc;
        }, []);
        setCustomerHistory(uniqueCustomers);
      } catch (error) {
        console.error('Error loading customer history:', error);
      }
    };
    
    loadCustomerHistory();
  }, []);

  // Calculate totals whenever items change (GST-optional calculation)
  useEffect(() => {
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    
    if (gstEnabled) {
      // GST-inclusive calculation
      const baseAmount = totalAmount / (1 + TOTAL_GST_RATE);
      const newCgst = baseAmount * CGST_RATE;
      const newSgst = baseAmount * SGST_RATE;
      const newGrandTotal = totalAmount;

      setSubtotal(baseAmount);
      setCgst(newCgst);
      setSgst(newSgst);
      setGrandTotal(newGrandTotal);
    } else {
      // No GST calculation
      setSubtotal(totalAmount);
      setCgst(0);
      setSgst(0);
      setGrandTotal(totalAmount);
    }
  }, [items, gstEnabled]);

  const updateItem = (id: string, field: keyof EstimateItem, value: string) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Reset brand if type changes
          if (field === 'type') {
            updatedItem.brand = '';
          }
          
          // Calculate amount if quantity or rate changes
          if (field === 'quantity' || field === 'rate') {
            const qty = parseFloat(updatedItem.quantity) || 0;
            const rate = parseFloat(updatedItem.rate) || 0;
            updatedItem.amount = qty * rate;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };

  const addRow = () => {
    const newSno = Math.max(...items.map(item => item.sno)) + 1;
    const newItem: EstimateItem = {
      id: Date.now().toString(),
      sno: newSno,
      category: '',
      type: '',
      brand: '',
      size: '',
      quantity: '',
      units: '',
      rate: '',
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeRow = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = generatePrintContent();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = () => {
    // For PDF download, we'll use the print functionality
    // In a real implementation, you might use a library like jsPDF
    handlePrint();
  };

  const handleSave = async () => {
    // Validate required fields
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.projectLocation || items.length === 0 || items.every(item => !item.quantity || !item.rate)) {
      alert('Please fill in all required fields (customer name, phone, project location, and at least one item with quantity and rate)');
      return;
    }

    try {
      // Prepare estimate data for API - matching the expected structure
      const estimateData = {
        billingNo: estimateNumber,
        date: date,
        customerName: customerDetails.name,
        phone: customerDetails.phone,
        area: customerDetails.projectLocation,
        items: items.map(item => ({
          sno: item.sno,
          category: item.category || '',
          type: item.type || '',
          brand: item.brand || '',
          size: item.size || '',
          quantity: parseFloat(item.quantity) || 0,
          units: item.units || '',
          rate: parseFloat(item.rate) || 0,
          amount: item.amount || 0
        })),
        deliveryCharge: 0,
        subtotal: subtotal,
        gstEnabled: gstEnabled,
        gstAmount: cgst + sgst, // API expects combined GST amount
        roundOff: 0,
        totalAmount: grandTotal
      };

      console.log('Saving estimate:', estimateData);

      // Make API call to save estimate
      const response = await fetch('/api/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estimateData),
      });

      if (response.ok) {
        const savedEstimate = await response.json();
        console.log('Estimate saved successfully:', savedEstimate);
        
        // Show success message
        alert(`Estimate ${savedEstimate.billingNo} saved successfully!`);
        
        // Redirect to admin dashboard estimates view after successful save
        setTimeout(() => {
          window.location.href = '/admin'; // Use direct navigation instead of window.open
        }, 1000);
        
      } else {
        const errorData = await response.json();
        console.error('Error saving estimate:', errorData);
        alert(`Error saving estimate: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving estimate:', error);
      alert('Error saving estimate. Please try again.');
    }
  };

  const generatePrintContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Estimate - ${estimateNumber}</title>
        <style>
          @page {
            margin: 15mm;
            size: A4 portrait;
          }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .estimate-container {
            background: white;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #caa75e;
            padding-bottom: 20px;
          }
          .logo {
            margin-bottom: 10px;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 10px 0 5px;
          }
          .tagline {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
          }
          .contact {
            font-size: 14px;
            color: #caa75e;
            font-weight: 600;
          }
          .estimate-title {
            font-size: 28px;
            font-weight: bold;
            color: #caa75e;
            text-align: center;
            margin: 30px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .estimate-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 15px;
            background: #fafafa;
            border-radius: 5px;
          }
          .customer-details {
            margin-bottom: 30px;
            padding: 20px;
            background: #fafafa;
            border-radius: 5px;
          }
          .customer-details h3 {
            color: #caa75e;
            margin-bottom: 15px;
            border-bottom: 1px solid #caa75e;
            padding-bottom: 5px;
          }
          .customer-details p {
            margin: 8px 0;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background: #caa75e;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #caa75e;
          }
          td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
          }
          .text-right {
            text-align: right;
          }
          .totals {
            margin-bottom: 30px;
          }
          .totals table {
            width: 300px;
            margin-left: auto;
          }
          .totals td {
            padding: 8px;
            border: none;
          }
          .totals .total-row {
            font-weight: bold;
            border-top: 2px solid #caa75e;
          }
          .notes {
            margin-bottom: 30px;
            padding: 20px;
            background: #fafafa;
            border-radius: 5px;
          }
          .notes h3 {
            color: #caa75e;
            margin-bottom: 10px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            border-top: 2px solid #caa75e;
            padding-top: 20px;
          }
          .signature {
            margin-top: 40px;
            text-align: right;
          }
          .signature-line {
            border-top: 1px solid #333;
            width: 200px;
            margin-left: auto;
            text-align: center;
            padding-top: 5px;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .estimate-container {
              box-shadow: none;
              border-radius: 0;
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="estimate-container">
          <div class="header">
            <div class="estimate-title">ESTIMATE</div>
          </div>
          
          <div class="estimate-info">
            <div>
              <strong>Estimate Number:</strong> ${estimateNumber}
            </div>
            <div>
              <strong>Date:</strong> ${new Date(date).toLocaleDateString('en-IN')}
            </div>
          </div>
          
          <div class="customer-details">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${customerDetails.name}</p>
            <p><strong>Phone:</strong> ${customerDetails.phone}</p>
            <p><strong>Project Location:</strong> ${customerDetails.projectLocation}</p>
            <p><strong>Delivery Address:</strong> ${customerDetails.deliveryAddress}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Category</th>
                <th>Type</th>
                <th>Brand</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Units</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.sno}</td>
                  <td>${item.category || '-'}</td>
                  <td>${item.type || '-'}</td>
                  <td>${item.brand || '-'}</td>
                  <td>${item.size || '-'}</td>
                  <td class="text-right">${item.quantity || '-'}</td>
                  <td>${item.units || '-'}</td>
                  <td class="text-right">${item.rate || '-'}</td>
                  <td class="text-right">${item.amount ? item.amount.toFixed(2) : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <table>
              <tr>
                <td>${gstEnabled ? "Base Amount:" : "Subtotal:"}</td>
                <td class="text-right">₹${subtotal.toFixed(2)}</td>
              </tr>
              ${gstEnabled ? `
                <tr>
                  <td>CGST (9%):</td>
                  <td class="text-right">₹${cgst.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>SGST (9%):</td>
                  <td class="text-right">₹${sgst.toFixed(2)}</td>
                </tr>
              ` : ''}
              <tr class="total-row">
                <td><strong>${gstEnabled ? "Total (GST Inclusive):" : "Total:"}</strong></td>
                <td class="text-right"><strong>₹${grandTotal.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>
          
          ${notes ? `
            <div class="notes">
              <h3>Notes</h3>
              <p>${notes.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p><strong>Authorized Signature</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-5xl mx-auto px-3">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-indigo-600 tracking-wider">ESTIMATE</h2>
          </div>
        </div>

        {/* Estimate Info */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Estimate Number</label>
              <input
                type="text"
                value={estimateNumber}
                readOnly
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-base font-semibold text-indigo-600 mb-3 border-b border-indigo-200 pb-1">Customer Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={customerDetails.name}
                onChange={(e) => {
                  setCustomerDetails({...customerDetails, name: e.target.value});
                  setShowCustomerSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowCustomerSuggestions(customerDetails.name.length > 0)}
                onBlur={() => setTimeout(() => setShowCustomerSuggestions(false), 200)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter customer name"
              />
              {showCustomerSuggestions && customerHistory.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-32 overflow-y-auto">
                  {customerHistory
                    .filter(customer => customer.name.toLowerCase().includes(customerDetails.name.toLowerCase()))
                    .slice(0, 5)
                    .map((customer, index) => (
                      <div
                        key={index}
                        className="px-2 py-1 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-xs"
                        onClick={() => {
                          setCustomerDetails({
                            name: customer.name,
                            phone: customer.phone,
                            projectLocation: customer.area,
                            deliveryAddress: ''
                          });
                          setShowCustomerSuggestions(false);
                        }}
                      >
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.phone} • {customer.area}</div>
                        <div className="text-xs text-gray-400">Last used: {new Date(customer.lastUsed).toLocaleDateString('en-IN')}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Project Location</label>
              <input
                type="text"
                value={customerDetails.projectLocation}
                onChange={(e) => setCustomerDetails({...customerDetails, projectLocation: e.target.value})}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter project location"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Address</label>
              <input
                type="text"
                value={customerDetails.deliveryAddress}
                onChange={(e) => setCustomerDetails({...customerDetails, deliveryAddress: e.target.value})}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter delivery address"
              />
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-semibold text-indigo-600">Materials</h3>
            <button
              onClick={addRow}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
            >
              Add Row
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Estimate No</th>
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Category</th>
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Type</th>
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Brand</th>
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Size</th>
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Qty</th>
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Units</th>
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Rate (₹)</th>
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Amount (₹)</th>
                  <th className="border border-indigo-200 px-2 py-1 text-left text-xs font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-indigo-200 px-2 py-1">
                      <input
                        type="text"
                        value={estimateNumber}
                        readOnly
                        className="w-full px-1 py-0 text-xs border-0 bg-gray-50"
                      />
                    </td>
                    <td className="border border-indigo-200 px-2 py-1">
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        className="w-full px-1 py-0 text-xs border-0 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="border border-indigo-200 px-2 py-1">
                      <input
                        type="text"
                        value={item.type}
                        onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                        className="w-full px-1 py-0 text-xs border-0 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="border border-indigo-200 px-2 py-1">
                      <input
                        type="text"
                        value={item.brand}
                        onChange={(e) => updateItem(item.id, 'brand', e.target.value)}
                        className="w-full px-1 py-0 text-xs border-0 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="border border-indigo-200 px-2 py-1">
                      <input
                        type="text"
                        value={item.size}
                        onChange={(e) => updateItem(item.id, 'size', e.target.value)}
                        className="w-full px-1 py-0 text-xs border-0 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="border border-indigo-200 px-2 py-1">
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="w-full px-1 py-0 text-xs border-0 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="border border-indigo-200 px-2 py-1">
                      <input
                        type="text"
                        value={item.units}
                        onChange={(e) => updateItem(item.id, 'units', e.target.value)}
                        className="w-full px-1 py-0 text-xs border-0 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="border border-indigo-200 px-2 py-1">
                      <input
                        type="text"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                        className="w-full px-1 py-0 text-xs border-0 focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="border border-indigo-200 px-2 py-1 text-right">
                      ₹{item.amount.toFixed(2)}
                    </td>
                    <td className="border border-indigo-200 px-2 py-1 text-center">
                      <button
                        onClick={() => removeRow(item.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax and Total Calculation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-amber-600 mb-4">Tax and Total Calculation</h3>
          
          {/* GST Option */}
          <div className="mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                id="gst-enabled"
                checked={gstEnabled}
                onChange={(e) => setGstEnabled(e.target.checked)}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable GST (CGST 9% + SGST 9% = 18% Total)
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              {gstEnabled 
                ? "Rates entered are GST-inclusive. GST will be calculated and displayed separately." 
                : "No GST will be applied. Rates are final amounts."}
            </p>
          </div>

          <div className="w-full md:w-1/3 ml-auto">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">
                  {gstEnabled ? "Base Amount:" : "Subtotal:"}
                </span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              {gstEnabled && (
                <>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">CGST (9%):</span>
                    <span>₹{cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="font-medium">SGST (9%):</span>
                    <span>₹{sgst.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              <div className="flex justify-between py-2 font-bold text-lg border-t-2 border-amber-600">
                <span>
                  {gstEnabled ? "Total (GST Inclusive):" : "Total:"}
                </span>
                <span className="text-amber-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-base font-semibold text-indigo-600 mb-3">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter notes such as price validity, delivery terms, payment conditions..."
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-medium"
          >
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-medium"
          >
            Print Estimate
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
          >
            Save Estimate
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimatePageNew;
