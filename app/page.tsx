"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BuyerDashboard from "@/components/features/BuyerDashboard";
import { SellerDashboard } from "@/components/features/SellerDashboard";
import { AdminDashboard } from "@/components/features/AdminDashboard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Users,
  TrendingUp,
  TrendingDown,
  Truck
} from "lucide-react";

// Sample data for demonstration
const sampleOrders = [
  {
    id: "1",
    customer: "ABC Construction",
    amount: "₹45,000",
    status: "processing" as const,
    date: "Today, 2:30 PM",
    items: 12
  },
  {
    id: "2", 
    customer: "XYZ Builders",
    amount: "₹28,500",
    status: "pending" as const,
    date: "Today, 11:15 AM",
    items: 8
  },
  {
    id: "3",
    customer: "Tech Homes",
    amount: "₹67,200",
    status: "completed" as const,
    date: "Yesterday",
    items: 15
  }
];

const sampleStocks = [
  {
    name: "TMT Steel 12mm",
    category: "Steel",
    quantity: 250,
    unit: "tons",
    status: "in-stock" as const
  },
  {
    name: "OPC Cement 53",
    category: "Cement", 
    quantity: 45,
    unit: "bags",
    status: "low-stock" as const
  },
  {
    name: "Red Bricks",
    category: "Bricks",
    quantity: 0,
    unit: "units",
    status: "out-of-stock" as const
  },
  {
    name: "AAC Blocks 6inch",
    category: "Blocks",
    quantity: 1200,
    unit: "nos",
    status: "in-stock" as const
  },
  {
    name: "River Sand",
    category: "Sand",
    quantity: 15,
    unit: "cubic feet",
    status: "low-stock" as const
  }
];

const sampleDeliveries = [
  {
    id: "1",
    customer: "ABC Construction",
    location: "Chennai, T. Nagar",
    estimatedTime: "2 hours",
    items: 12,
    priority: "high" as const
  },
  {
    id: "2",
    customer: "XYZ Builders", 
    location: "Chennai, OMR",
    estimatedTime: "5 hours",
    items: 8,
    priority: "medium" as const
  },
  {
    id: "3",
    customer: "Tech Homes",
    location: "Chennai, Velachery",
    estimatedTime: "Tomorrow",
    items: 15,
    priority: "low" as const
  }
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  useEffect(() => {
    // Lock body scroll when modal is open
    if (isModalOpen) {
      console.log('Modal should be open - isModalOpen:', isModalOpen);
      document.body.style.overflow = 'hidden';
    } else {
      console.log('Modal should be closed - isModalOpen:', isModalOpen);
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    // Handle ESC key to close modal
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return (
        <div className="pt-6 pb-12">
            <AdminDashboard />
        </div>
      );
    }
    
    return (
      <div className="pt-6 pb-12">
        {user.role === 'buyer' && <BuyerDashboard user={user} />}
        {user.role === 'seller' && <SellerDashboard user={user} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2f7] to-[#f1f5f9] relative overflow-hidden">
      {/* Construction Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.04]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-slate-400/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/3 rounded-full blur-[150px]" />
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-indigo-950 text-white p-12 max-w-4xl mx-auto relative overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#caa75e]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-1 h-8 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
                <h1 className="text-5xl md:text-6xl font-bold text-white uppercase tracking-tight">
                  Thoon Enterprises
                </h1>
                <div className="w-1 h-8 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
              </div>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-medium ml-4">
                Premium Construction Materials Supply Platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full h-14 bg-[#caa75e] hover:bg-[#b89653] text-white border-none shadow-[0_8px_24px_rgba(202,167,94,0.3)] rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      console.log('Create Account button clicked');
                      // Direct navigation without delay
                      router.push('/register');
                    }}
                    className="w-full h-14 bg-[#caa75e] hover:bg-[#b89653] text-white border-none shadow-[0_8px_24px_rgba(202,167,94,0.3)] rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-indigo-950 text-white p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] mb-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
                <h2 className="text-4xl font-bold text-white uppercase tracking-tight">
                  Why Choose Thoon Enterprises?
                </h2>
                <div className="w-1 h-8 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
              </div>
              <p className="text-white/80 font-medium max-w-2xl mx-auto">
                Experience the future of construction materials procurement with our premium platform
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <MetricCard
              title="Premium Quality"
              value="100%"
              change="+15%"
              icon={Package}
              trend="up"
            />
            <MetricCard
              title="On-Time Delivery"
              value="98%"
              change="+5%"
              icon={Truck}
              trend="up"
            />
            <MetricCard
              title="Customer Satisfaction"
              value="4.9★"
              change="+0.3"
              icon={Users}
              trend="up"
            />
            <MetricCard
              title="Market Coverage"
              value="South India"
              change="+2 Cities"
              icon={TrendingUp}
              trend="up"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-indigo-950 text-white p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] mb-16">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
                <h2 className="text-4xl font-bold text-white uppercase tracking-tight">
                  Dashboard Overview
                </h2>
                <div className="w-1 h-8 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
              </div>
              <p className="text-white/80 font-medium max-w-2xl mx-auto">
                Preview our powerful dashboard features designed for construction industry professionals
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-10">
            <div className="lg:col-span-2 xl:col-span-1">
              <MetricCard
                title="Today's Orders"
                value="24"
                change="+12%"
                icon={ShoppingCart}
                trend="up"
              />
            </div>
            <div className="lg:col-span-2 xl:col-span-1">
              <MetricCard
                title="Pending Deliveries"
                value="8"
                change="-2%"
                icon={Clock}
                trend="down"
              />
            </div>
            <div className="lg:col-span-2 xl:col-span-1">
              <MetricCard
                title="Sales Value"
                value="₹2.4L"
                change="+18%"
                icon={DollarSign}
                trend="up"
              />
            </div>
            <div className="lg:col-span-2 xl:col-span-1">
              <MetricCard
                title="Active Users"
                value="156"
                change="+8%"
                icon={Users}
                trend="up"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
            <RecentOrdersWidget orders={sampleOrders} />
            <StockSummaryWidget stocks={sampleStocks} />
            <PendingDeliveriesWidget deliveries={sampleDeliveries} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] w-[500px] max-w-[600px] max-h-[80vh] overflow-y-auto pointer-events-auto border border-slate-200/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[#1f2a30] uppercase tracking-tight">
                  Create Account
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                console.log('=== FORM SUBMISSION START ===');
                console.log('Event target:', e.currentTarget);
                console.log('Event target elements:', Array.from(e.currentTarget.elements));
                
                const formData = new FormData(e.currentTarget);
                console.log('FormData entries:');
                for (let [key, value] of formData.entries()) {
                  console.log(`  ${key}: ${value}`);
                }
                
                console.log('Form submitted with data:', {
                  fullName: formData.get('fullName'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  role: formData.get('role')
                });
                console.log('=== FORM SUBMISSION END ===');
                setIsModalOpen(false);
              }}>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">
                    I am a...
                  </label>
                  <select name="role" className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]">
                    <option value="">Select role</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 h-14 bg-[#caa75e] hover:bg-[#b89653] text-white border-none shadow-[0_8px_24px_rgba(202,167,94,0.3)] rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    Create Account
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-14 bg-white/80 hover:bg-white text-[#1f2a30] border border-slate-200/60 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, change, icon: Icon, trend = 'neutral' }: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
}) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <Card className="hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl">
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100/50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-[#caa75e]/10 transition-colors duration-300" />
      <CardBody className="p-6">
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200/60 group-hover:shadow-[0_8px_24px_rgba(202,167,94,0.15)] transition-all duration-300">
            <Icon className="h-6 w-6 text-[#1f2a30] group-hover:text-[#caa75e] transition-colors duration-300" />
          </div>
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-bold ${getChangeColor()}`}>
              {change}
            </span>
          </div>
        </div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-[#1f2a30] mb-1">{value}</h3>
          <p className="text-sm text-slate-600 font-medium">{title}</p>
        </div>
      </CardBody>
    </Card>
  );
}

// Recent Orders Widget
function RecentOrdersWidget({ orders }: { orders: any[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'processing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-800 border-green-100';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-100';
    }
  };

  return (
    <Card className="hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
            <h3 className="text-lg font-bold text-[#1f2a30] uppercase tracking-tight">Recent Orders</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-[#caa75e] hover:text-[#b89653] hover:bg-[#caa75e]/5">
            View All →
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-50/80 flex items-center justify-center group-hover:bg-[#caa75e]/10 transition-colors duration-300">
                  <ShoppingCart className="h-4 w-4 text-[#1f2a30] group-hover:text-[#caa75e] transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1f2a30]">{order.customer}</p>
                  <p className="text-xs text-slate-500">{order.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#1f2a30]">{order.amount}</p>
                <p className="text-xs text-slate-500">{order.items} items</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Stock Summary Widget
function StockSummaryWidget({ stocks }: { stocks: any[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-50 text-green-800';
      case 'low-stock':
        return 'bg-amber-50 text-amber-800';
      case 'out-of-stock':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-slate-50 text-slate-800';
    }
  };

  const lowStockItems = stocks.filter(item => item.status === 'low-stock').length;
  const outOfStockItems = stocks.filter(item => item.status === 'out-of-stock').length;

  return (
    <Card className="hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
            <h3 className="text-lg font-bold text-[#1f2a30] uppercase tracking-tight">Stock Summary</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <span className="text-xs font-medium text-slate-600">{lowStockItems} Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-slate-600">{outOfStockItems} Out</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {stocks.slice(0, 5).map((stock, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="h-6 w-6 rounded-full bg-slate-50/80 flex items-center justify-center group-hover:bg-[#caa75e]/10 transition-colors duration-300">
                  <Package className="h-3 w-3 text-[#1f2a30] group-hover:text-[#caa75e] transition-colors duration-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1f2a30]">{stock.name}</p>
                  <p className="text-xs text-slate-500">{stock.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#1f2a30]">
                  {stock.quantity} {stock.unit}
                </p>
                <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${getStatusColor(stock.status)}`}>
                  {stock.status.replace('-', ' ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Pending Deliveries Widget
function PendingDeliveriesWidget({ deliveries }: { deliveries: any[] }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'low':
        return 'bg-green-50 text-green-800 border-green-100';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-100';
    }
  };

  return (
    <Card className="hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 bg-white/95 backdrop-blur-sm border border-slate-200/60 rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
            <h3 className="text-lg font-bold text-[#1f2a30] uppercase tracking-tight">Pending Deliveries</h3>
          </div>
          <div className="bg-[#caa75e]/10 text-[#caa75e] text-xs font-bold px-2 py-1 rounded-full uppercase tracking-widest">
            {deliveries.length} Active
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                  <Truck className="h-4 w-4 text-amber-600 group-hover:text-amber-700 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1f2a30]">{delivery.customer}</p>
                  <p className="text-xs text-slate-500">{delivery.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-500">{delivery.estimatedTime}</p>
                <p className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block ${getPriorityColor(delivery.priority)}`}>
                  {delivery.priority}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
