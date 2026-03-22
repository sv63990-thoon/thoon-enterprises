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

const EstimatePage: React.FC = () => {
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
      units: 'Bags', // Default to Bags for cement
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
          
          // Reset dependent fields when category changes
          if (field === 'category') {
            updatedItem.type = '';
            updatedItem.brand = '';
            updatedItem.size = '';
            // Set default units based on category
            if (value === 'Cement') {
              updatedItem.units = 'Bags';
            } else if (value === 'Steel') {
              updatedItem.units = 'Ton';
            } else if (value === 'Bricks' || value === 'Blocks') {
              updatedItem.units = 'Pieces';
            } else if (value === 'Sand' || value === 'Aggregate') {
              updatedItem.units = 'Cubic Feet';
            }
          }
          
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

  // Debug function to check items state
  const debugItems = () => {
    alert(`Debug Info:\nTotal Items: ${items.length}\nFirst Item: ${JSON.stringify(items[0], null, 2)}\nConsole logs opened - check F12`);
    console.log('=== DEBUG START ===');
    console.log('Current items:', items);
    console.log('Items amount calculation:', items.map(item => ({ 
      id: item.id, 
      quantity: item.quantity, 
      rate: item.rate, 
      amount: item.amount,
      calculated: (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)
    })));
    console.log('=== DEBUG END ===');
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
      units: 'Bags', // Default to Bags, will update when category is selected
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
            background: linear-gradient(135deg, #eaaaaa 0%, #e8abab 100%);
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
            border-bottom: 2px solid #1310106d;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white border-opacity-30">
                <span className="text-white font-bold text-2xl">📋</span>
              </div>
              <h1 className="text-5xl font-bold text-white py-2 drop-shadow-lg">
                ESTIMATE
              </h1>
            </div>
            
            {/* Estimate Number and Date under header */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white border-opacity-30">
                <p className="text-white text-opacity-90 text-sm font-medium mb-1">Estimate Number</p>
                <p className="text-white text-2xl font-bold font-mono">{estimateNumber}</p>
              </div>
              
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white border-opacity-30">
                <p className="text-white text-opacity-90 text-sm font-medium mb-1">Date</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent text-white text-lg font-semibold border-none outline-none cursor-pointer placeholder-white placeholder-opacity-70"
                    style={{ colorScheme: 'dark' }}
                  />
                  <svg className="w-5 h-5 text-white text-opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        {/* Customer Details */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Customer Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={customerDetails.name}
                  onChange={(e) => {
                    setCustomerDetails({...customerDetails, name: e.target.value});
                    setShowCustomerSuggestions(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowCustomerSuggestions(customerDetails.name.length > 0)}
                  onBlur={() => setTimeout(() => setShowCustomerSuggestions(false), 200)}
                  className="w-full pl-8 pr-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter customer name"
                />
                {showCustomerSuggestions && customerHistory.length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-xl shadow-2xl mt-1 max-h-48 overflow-y-auto">
                    <div className="p-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Recent Customers</p>
                      {customerHistory
                        .filter(customer => customer.name.toLowerCase().includes(customerDetails.name.toLowerCase()))
                        .slice(0, 5)
                        .map((customer, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-indigo-50 cursor-pointer border border-gray-200 rounded-lg transition-all duration-200 mb-1"
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
                            <div className="font-medium text-gray-900 text-sm">{customer.name}</div>
                            <div className="text-xs text-gray-600">{customer.phone}</div>
                            <div className="text-xs text-gray-500">{customer.area}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                  className="w-full pl-8 pr-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Project Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={customerDetails.projectLocation}
                  onChange={(e) => setCustomerDetails({...customerDetails, projectLocation: e.target.value})}
                  className="w-full pl-8 pr-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Enter project location"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <textarea
                  value={customerDetails.deliveryAddress}
                  onChange={(e) => setCustomerDetails({...customerDetails, deliveryAddress: e.target.value})}
                  rows={2}
                  className="w-full pl-8 pr-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                  placeholder="Enter delivery address (optional)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border-gray-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Materials & Pricing</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={addRow}
                  className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 text-sm font-medium border-white border-opacity-30"
                >
                  + Add Item
                </button>
                <button
                  onClick={debugItems}
                  className="px-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm text-white rounded-lg hover:bg-opacity-20 transition-all duration-200 text-sm font-medium border-white border-opacity-20"
                >
                  Debug
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Brand</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Size</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Units</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Rate</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <select
                        name="category"
                        value={item.category}
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        <option value="">Select Category</option>
                        {Object.keys(CATEGORIES).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        name="type"
                        value={item.type}
                        onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        disabled={!item.category}
                      >
                        <option value="">Select Type</option>
                        {item.category && CATEGORIES[item.category]?.types.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        name="brand"
                        value={item.brand}
                        onChange={(e) => updateItem(item.id, 'brand', e.target.value)}
                        className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        disabled={!item.type}
                      >
                        <option value="">Select Brand</option>
                        {item.type && BRANDS[item.type]?.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        name="size"
                        value={item.size}
                        onChange={(e) => updateItem(item.id, 'size', e.target.value)}
                        className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        disabled={!item.category}
                      >
                        <option value="">Select Size</option>
                        {item.category && CATEGORIES[item.category]?.sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        name="units"
                        value={item.units}
                        onChange={(e) => updateItem(item.id, 'units', e.target.value)}
                        className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        disabled={!item.category}
                      >
                        <option value="">Select Units</option>
                        {item.category && CATEGORIES[item.category]?.units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        name="rate"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                        className="w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">₹{item.amount.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => removeRow(item.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border-red-200"
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
      </div>

        {/* Tax and Total Calculation */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl border-amber-200 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Tax & Total Calculation</h3>
            </div>
          </div>
          
          <div className="p-6">
            {/* GST Option */}
            <div className="mb-6">
              <label className="flex items-center space-x-3 cursor-pointer bg-white p-4 rounded-lg border-amber-200 hover:bg-amber-50 transition-colors">
                <input
                  type="checkbox"
                  id="gst-enabled"
                  checked={gstEnabled}
                  onChange={(e) => setGstEnabled(e.target.checked)}
                  className="w-5 h-5 text-amber-600 border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-800">
                    Enable GST (CGST 9% + SGST 9% = 18% Total)
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    {gstEnabled 
                      ? "Rates entered are GST-inclusive. GST will be calculated and displayed separately." 
                      : "No GST will be applied. Rates are final amounts."}
                  </p>
                </div>
              </label>
            </div>

            <div className="w-full md:w-1/2 lg:w-1/3 ml-auto">
              <div className="bg-white rounded-xl shadow-sm border-gray-200 overflow-hidden">
                <div className="space-y-0">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">
                      {gstEnabled ? "Base Amount:" : "Subtotal:"}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {gstEnabled && (
                    <>
                      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-blue-50">
                        <span className="text-sm font-medium text-blue-700">CGST (9%):</span>
                        <span className="text-sm font-semibold text-blue-900">₹{cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-blue-50">
                        <span className="text-sm font-medium text-blue-700">SGST (9%):</span>
                        <span className="text-sm font-semibold text-blue-900">₹{sgst.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between items-center px-4 py-4 bg-gradient-to-r from-amber-500 to-orange-500">
                    <span className="text-base font-bold text-white">
                      {gstEnabled ? "Total (GST Inclusive):" : "Total:"}
                    </span>
                    <span className="text-lg font-bold text-white">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
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
            className="w-full px-2 py-1 text-sm border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
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

export default EstimatePage;
