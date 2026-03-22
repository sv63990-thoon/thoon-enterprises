'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Settings, 
  Receipt, 
  TrendingUp,
  BarChart3,
  Package,
  ShoppingCart,
  ArrowRight,
  Eye,
  Plus
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'billing' | 'users' | 'market'>('overview');

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-600 mb-6">Admin access required to view this page.</p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Back to Dashboard
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'billing', name: 'Billing & Estimates', icon: FileText },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'market', name: 'Market Prices', icon: DollarSign },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'billing':
        return <BillingAndEstimates />;
      case 'users':
        return <UserManagement />;
      case 'market':
        return <MarketPrices />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Panel</h1>
              <p className="text-slate-600">Manage your business operations and settings</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <span>Logged in as:</span>
              <span className="font-semibold text-slate-900">{user?.name}</span>
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Overview Component
function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold mt-2">1,234</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">₹2.4M</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-200" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Orders</p>
                <p className="text-3xl font-bold mt-2">456</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-200" />
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-amber-600 to-amber-700 text-white">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Estimates</p>
                <p className="text-3xl font-bold mt-2">89</p>
              </div>
              <FileText className="h-8 w-8 text-amber-200" />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-900">New order received</span>
              </div>
              <span className="text-xs text-slate-500">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-900">New user registered</span>
              </div>
              <span className="text-xs text-slate-500">15 minutes ago</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-slate-900">Estimate created</span>
              </div>
              <span className="text-xs text-slate-500">1 hour ago</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Billing and Estimates Component with Invoices Integration
function BillingAndEstimates() {
  const [activeTab, setActiveTab] = useState<'estimates' | 'invoices'>('estimates');

  const menuItems = [
    { id: 'estimates', name: 'Estimates', count: 12, icon: FileText },
    { id: 'invoices', name: 'Invoices', count: 8, icon: Receipt },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Billing & Estimates</h2>
            <p className="text-slate-600">Manage estimates, invoices, and billing operations</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estimates Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                12 Active
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Estimates</h3>
            <p className="text-slate-600 text-sm mb-4">Create and manage project estimates and quotations</p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setActiveTab('estimates')}
            >
              Manage Estimates
            </Button>
          </CardBody>
        </Card>

        {/* Premium Invoice Card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardBody className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                8 Active
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Premium Invoices</h3>
            <p className="text-slate-600 text-sm mb-4">Advanced GST invoicing with professional templates and calculations</p>
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => window.location.href = '/invoices'}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Open Invoice System
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Estimates</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Total Invoices</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">8</p>
              </div>
              <Receipt className="h-8 w-8 text-emerald-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Revenue</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹45,678</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">3</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick View Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <div className="flex space-x-2">
              <Button
                variant={activeTab === 'estimates' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('estimates')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Estimates
              </Button>
              <Button
                variant={activeTab === 'invoices' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('invoices')}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Invoices
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          {activeTab === 'estimates' ? (
            <EstimatesList />
          ) : (
            <InvoicesList />
          )}
        </CardBody>
      </Card>
    </div>
  );
}

// Estimates List Component
function EstimatesList() {
  const estimates = [
    { id: 1, number: 'EST-001', customer: 'Ramesh Kumar', amount: 25000, status: 'draft', date: '2024-01-15' },
    { id: 2, number: 'EST-002', customer: 'Suresh Builders', amount: 45000, status: 'sent', date: '2024-01-14' },
    { id: 3, number: 'EST-003', customer: 'ABC Construction', amount: 32000, status: 'approved', date: '2024-01-13' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Recent Estimates</h3>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Estimate
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">Estimate No</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
              <th className="text-right py-3 px-4 font-medium text-slate-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
              <th className="text-center py-3 px-4 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((estimate) => (
              <tr key={estimate.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-blue-600">{estimate.number}</td>
                <td className="py-3 px-4">{estimate.customer}</td>
                <td className="py-3 px-4">{estimate.date}</td>
                <td className="py-3 px-4 text-right font-mono">₹{estimate.amount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    estimate.status === 'draft' ? 'bg-slate-100 text-slate-800' :
                    estimate.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {estimate.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Invoices List Component
function InvoicesList() {
  const invoices = [
    { id: 1, number: 'INV-001', customer: 'Ramesh Kumar', amount: 25000, status: 'paid', date: '2024-01-15' },
    { id: 2, number: 'INV-002', customer: 'Suresh Builders', amount: 45000, status: 'pending', date: '2024-01-14' },
    { id: 3, number: 'INV-003', customer: 'ABC Construction', amount: 32000, status: 'overdue', date: '2024-01-13' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
        <Button onClick={() => window.location.href = '/invoices'} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">Invoice No</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
              <th className="text-right py-3 px-4 font-medium text-slate-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
              <th className="text-center py-3 px-4 font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-indigo-600">{invoice.number}</td>
                <td className="py-3 px-4">{invoice.customer}</td>
                <td className="py-3 px-4">{invoice.date}</td>
                <td className="py-3 px-4 text-right font-mono">₹{invoice.amount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// User Management Component
function UserManagement() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6">User Management</h2>
      <p className="text-slate-600">Manage user accounts, permissions, and roles.</p>
    </div>
  );
}

// Market Prices Component
function MarketPrices() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Market Prices</h2>
      <p className="text-slate-600">Update and manage market prices for construction materials.</p>
    </div>
  );
}
