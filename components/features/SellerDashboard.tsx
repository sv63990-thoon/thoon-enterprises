"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, Gavel, Loader2, Check, Package, Star, Camera, CheckCircle2, Clock, BarChart3, TrendingUp, Receipt, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function SellerDashboard({ user }: { user: any }) {
    const [requirements, setRequirements] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'market' | 'orders' | 'insights'>('market');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    useEffect(() => {
        fetchMarketplace();
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const res = await fetch(`/api/orders?userId=${user.id}&role=seller`);
        const data = await res.json();
        setOrders(data);
    };

    const fetchMarketplace = async () => {
        const res = await fetch('/api/requirements');
        const data = await res.json();
        // Sellers can only quote on pending requirements
        setRequirements(data.filter((r: any) => r.status === 'pending'));
        setLoading(false);
    };

    const handleQuote = async (reqId: string, price: number) => {
        if (!price || price <= 0) return alert('Please enter a valid price');
        setSubmitting(reqId);
        try {
            await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reqId,
                    sellerId: user.id,
                    sellerName: user.name,
                    sellerPrice: price
                })
            });
            fetchMarketplace();
        } finally {
            setSubmitting(null);
        }
    };

    const handleStatusUpdate = async (orderId: string, status: string) => {
        setUpdatingStatus(orderId);
        try {
            await fetch('/api/orders/status', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status })
            });
            fetchOrders();
        } finally {
            setUpdatingStatus(null);
        }
    };

    if (user.status !== 'active') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 bg-indigo-50/30 backdrop-blur-xl rounded-[3rem] border border-indigo-100/50 p-12 shadow-2xl shadow-indigo-100/20">
                <div className="h-24 w-24 bg-indigo-950 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20" />
                    <Clock className="h-10 w-10 text-amber-400 relative z-10" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-indigo-950 uppercase tracking-tight">Verification in Progress</h2>
                    <p className="text-slate-500 mt-3 max-w-md mx-auto font-medium leading-relaxed">
                        Welcome to Thoon Enterprise. Your account is currently being reviewed by our compliance team.
                        Full access will be granted upon successful verification.
                    </p>
                </div>
                <div className="bg-indigo-950 px-6 py-3 rounded-2xl shadow-xl shadow-indigo-100 text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] border border-indigo-900">
                    SLA: <span className="text-white ml-2">2-4 business hours</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start border-b border-indigo-900 bg-indigo-950 p-6 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-8 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Supplier Dashboard</h1>
                    </div>
                    <p className="text-indigo-200/60 font-medium ml-4 text-sm">Welcome back, <span className="text-white font-black">{user.name}</span></p>
                </div>
                {user.subscriptionTier && (
                    <div className="relative z-10 flex flex-col items-end gap-2">
                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Active Plan</span>
                        <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-indigo-950 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-900/10 flex items-center gap-2 border border-amber-300 transform scale-105">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            {user.subscriptionTier} Member
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-3">
                {[
                    { id: 'market', label: 'Live Marketplace', icon: Search },
                    { id: 'orders', label: 'Assigned Orders', icon: Package, count: orders.length },
                    ...(user.subscriptionTier === 'verified' || user.subscriptionTier === 'gold' ? [
                        { id: 'insights', label: 'Business Insights', icon: BarChart3 }
                    ] : [])
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 border ${activeTab === tab.id
                            ? 'bg-amber-400 text-indigo-950 border-amber-300 shadow-[0_10px_20px_-10px_#fbbf24] scale-105'
                            : 'bg-white/50 text-indigo-950/60 border-indigo-100 hover:bg-white hover:text-indigo-950'
                            }`}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                            <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[8px] font-black ${activeTab === tab.id ? 'bg-indigo-950 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'insights' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-indigo-900 border-none shadow-xl transform hover:scale-105 transition-all">
                            <CardBody className="p-6">
                                <TrendingUp className="h-8 w-8 text-amber-400 mb-4" />
                                <p className="text-indigo-200 text-xs font-black uppercase tracking-widest">Monthly Profit</p>
                                <h3 className="text-2xl font-black text-white mt-1">₹{(orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.totalPrice, 0) * 0.12).toLocaleString()}</h3>
                                <p className="text-[10px] text-green-400 font-bold mt-2">+12.5% from last month</p>
                            </CardBody>
                        </Card>
                        <Card className="bg-white border-none shadow-xl transform hover:scale-105 transition-all">
                            <CardBody className="p-6">
                                <Receipt className="h-8 w-8 text-indigo-600 mb-4" />
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Pending GST</p>
                                <h3 className="text-2xl font-black text-indigo-950 mt-1">₹{(orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.totalPrice, 0) * 0.18).toLocaleString()}</h3>
                                <p className="text-[10px] text-slate-400 font-bold mt-2">Filing due in 4 days</p>
                            </CardBody>
                        </Card>
                        <Card className="bg-amber-400 border-none shadow-xl transform hover:scale-105 transition-all">
                            <CardBody className="p-6">
                                <ShieldCheck className="h-8 w-8 text-indigo-950 mb-4" />
                                <p className="text-indigo-950/60 text-xs font-black uppercase tracking-widest">Trust Score</p>
                                <h3 className="text-2xl font-black text-indigo-950 mt-1">98/100</h3>
                                <p className="text-[10px] text-indigo-900 font-bold mt-2">Top 5% in {user.category || 'your category'}</p>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-8 bg-white rounded-[2.5rem] border-indigo-50 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Monthly P&L Report</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Financial Performance Overview</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-black">FY 2025-26</span>
                                </div>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { name: 'Jan', profit: 45000, loss: 12000 },
                                        { name: 'Feb', profit: 52000, loss: 8000 },
                                        { name: 'Mar', profit: orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.totalPrice, 0) * 0.12, loss: 5000 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                                        />
                                        <Bar dataKey="profit" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                                        <Bar dataKey="loss" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-8 bg-indigo-950 rounded-[2.5rem] border-none shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Receipt className="h-6 w-6 text-amber-400" />
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight">GST Filling Center</h3>
                                    </div>
                                    <p className="text-indigo-200/60 text-sm font-medium mb-8">
                                        Automated tax compliance for your business. We process your GSTR-1 and GSTR-3B filings based on your platform transactions.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 bg-amber-400 rounded-full shadow-[0_0_8px_#fbbf24]" />
                                                <span className="text-[11px] font-black text-white uppercase tracking-widest">GSTR-1 (Sales)</span>
                                            </div>
                                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Ready to File</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 bg-indigo-400 rounded-full" />
                                                <span className="text-[11px] font-black text-white uppercase tracking-widest">GSTR-3B (Summary)</span>
                                            </div>
                                            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Generating...</span>
                                        </div>
                                    </div>
                                </div>
                                <Button className="w-full mt-8 bg-amber-400 hover:bg-amber-300 text-indigo-950 h-12 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-[0_10px_20px_-10px_#fbbf24] border-none">
                                    File GST Now
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'market' ? (
                <div className="bg-indigo-50/40 backdrop-blur-xl rounded-2xl shadow-sm border border-indigo-100/50 overflow-hidden">
                    <div className="p-4 bg-indigo-950 text-white flex items-center gap-2">
                        <Search className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-widest italic">Open Marketplace Opportunities</span>
                    </div>

                    <div className="divide-y divide-indigo-100/50">
                        {loading ? (
                            <div className="p-12 text-center text-slate-400"><Loader2 className="animate-spin mx-auto h-8 w-8" /></div>
                        ) : requirements.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 font-medium">No active requirements in the market.</div>
                        ) : (
                            requirements.map(req => (
                                <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/40 transition-all duration-300">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{req.product}</h3>
                                        <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{req.category}</span>
                                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase">{req.brand}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 font-bold">Quantity: {req.quantity} {req.unit}</p>
                                        <p className="text-xs text-slate-400 mt-1">Requested by: {req.buyerName}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
                                            <input
                                                id={`price-${req.id}`}
                                                type="number"
                                                placeholder="Your Price"
                                                className="pl-7 pr-3 py-2 border rounded-md w-32 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <Button
                                            onClick={() => {
                                                const val = (document.getElementById(`price-${req.id}`) as HTMLInputElement).value;
                                                handleQuote(req.id, Number(val));
                                            }}
                                            disabled={submitting === req.id}
                                            className="bg-amber-400 hover:bg-amber-300 text-indigo-950 border-none shadow-[0_10px_20px_-10px_#fbbf24] rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:-translate-y-0.5 active:scale-95 h-10 px-6"
                                        >
                                            {submitting === req.id ? <Loader2 className="animate-spin h-4 w-4" /> : <><Gavel className="mr-2 h-4 w-4" /> Quote</>}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white/20 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-200/50">
                            <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No orders assigned yet.</p>
                            <p className="text-sm text-slate-400">Quotes you win will appear here for fulfillment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                                <div key={order.id} className="bg-white/40 backdrop-blur-md p-6 border-indigo-100/50 hover:border-amber-400/50 rounded-[2rem] group shadow-sm hover:shadow-xl transition-all duration-500 border relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                        <div className="flex gap-5">
                                            <div className="h-20 w-20 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-amber-400 group-hover:scale-110 transition-all duration-500 shadow-sm">
                                                <Package className="h-10 w-10 text-indigo-200 group-hover:text-indigo-950 transition-all" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{order.product}</h3>
                                                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-black border border-indigo-100">{order.orderNumber}</span>
                                                    <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 font-bold mt-1">{order.quantity} {order.unit} • <span className="text-indigo-950 font-black">₹{order.totalPrice.toLocaleString()}</span></p>
                                                <div className="flex gap-2 mt-3">
                                                    <span className="text-[9px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase font-black tracking-widest border border-slate-200">{order.category}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 min-w-[220px] justify-center">
                                            {order.status === 'processing' && (
                                                <Button
                                                    onClick={() => handleStatusUpdate(order.id, 'shipped')}
                                                    disabled={updatingStatus === order.id}
                                                    className="bg-indigo-950 hover:bg-indigo-900 text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 h-auto rounded-xl shadow-lg shadow-indigo-100"
                                                >
                                                    {updatingStatus === order.id ? <Loader2 className="animate-spin h-3 w-3" /> : 'Mark As Shipped'}
                                                </Button>
                                            )}
                                            {order.status === 'shipped' && (
                                                <Button
                                                    onClick={() => {
                                                        if (confirm('Confirm Handover? By clicking OK, you verify that the material has been delivered to the site in good condition.')) {
                                                            handleStatusUpdate(order.id, 'delivered');
                                                        }
                                                    }}
                                                    disabled={updatingStatus === order.id}
                                                    className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-[0.2em] py-3 h-auto rounded-xl shadow-lg shadow-green-100"
                                                >
                                                    {updatingStatus === order.id ? <Loader2 className="animate-spin h-3 w-3" /> : (
                                                        <span className="flex items-center gap-2">
                                                            <Camera className="h-3 w-3" /> Confirm Delivery (POD)
                                                        </span>
                                                    )}
                                                </Button>
                                            )}
                                            {order.status === 'delivered' && (
                                                <div className="flex flex-col items-end gap-2 bg-green-50/50 p-4 rounded-2xl border border-green-100/50">
                                                    <div className="flex items-center gap-2 text-green-700">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Handover Success (POD)</span>
                                                    </div>
                                                    {order.rating && (
                                                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-amber-200 shadow-sm animate-in zoom-in-75 duration-500">
                                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                            <span className="text-[9px] font-black text-amber-900 tracking-wider">{order.rating}/5 FEEDBACK</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
