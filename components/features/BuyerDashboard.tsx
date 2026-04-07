'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ProfileGuard } from '@/components/guards/ProfileGuard';
import { Package, Clock, Plus, MapPin, Search, Star, Check, Info, Truck, Eye, Trash2, Loader2, ShoppingCart, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data - replace with actual API calls
const CATEGORIES = ['Cement', 'Steel', 'Bricks', 'Sand', 'Aggregate', 'Paint', 'Tiles', 'Plumbing', 'Electrical', 'Wood'];
const BRANDS_BY_CATEGORY: Record<string, string[]> = {
    'Cement': ['ACC', 'Ultratech', 'Ambuja', 'Shree', 'Dalmia', 'JK'],
    'Steel': ['Tata', 'JSW', 'SAIL', 'Jindal', 'Essar'],
    'Bricks': ['Fly Ash', 'Clay', 'Concrete'],
    'Sand': ['River Sand', 'M-Sand', 'P-Sand'],
    'Aggregate': ['10mm', '20mm', '40mm'],
    'Paint': ['Asian Paints', 'Berger', 'Nerolac', 'Dulux'],
    'Tiles': ['Kajaria', 'Johnson', 'Somany', 'Nitco'],
    'Plumbing': ['CPVC', 'PVC', 'GI', 'Copper'],
    'Electrical': ['Havells', 'Legrand', 'Schneider', 'Finolex'],
    'Wood': ['Teak', 'Sal', 'Pine', 'Plywood']
};
const SIZES_BY_CATEGORY: Record<string, string[]> = {
    'Cement': ['43 Grade', '53 Grade', 'PPC', 'OPC'],
    'Steel': ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm'],
    'Bricks': ['4"', '6"', '9"', 'Hollow'],
    'Sand': ['Fine', 'Medium', 'Coarse'],
    'Aggregate': ['10mm', '20mm', '40mm', '60mm'],
    'Paint': ['1L', '5L', '10L', '20L'],
    'Tiles': ['2x2', '2x4', '4x4', 'Wall', 'Floor'],
    'Plumbing': ['15mm', '20mm', '25mm', '32mm'],
    'Electrical': ['1.5mm', '2.5mm', '4mm', '6mm'],
    'Wood': ['6ft', '8ft', '10ft', '12ft']
};
const UNITS = ['Bags', 'Ton', 'Cubic Feet', 'Cubic Meter', 'Pieces', 'Liters', 'Kg', 'Meter', 'Square Feet', 'Square Meter'];

const LOCATIONS = {
    states: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana'],
    cities: {
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
        'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
        'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam'],
        'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
        'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam']
    },
    areas: {
        'Chennai': [
            { name: 'T. Nagar', pincode: '600017' },
            { name: 'Anna Nagar', pincode: '600040' },
            { name: 'Adyar', pincode: '600020' },
            { name: 'Velachery', pincode: '600042' },
            { name: 'Porur', pincode: '600116' }
        ],
        'Bangalore': [
            { name: 'Whitefield', pincode: '560066' },
            { name: 'Indiranagar', pincode: '560038' },
            { name: 'Jayanagar', pincode: '560041' },
            { name: 'Koramangala', pincode: '560034' },
            { name: 'Marathahalli', pincode: '560037' }
        ]
    }
};

export default function BuyerDashboard({ user }: { user: any }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'requests' | 'orders'>('requests');
    const [requirements, setRequirements] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const [securingQuoteId, setSecuringQuoteId] = useState<string | null>(null);
    const [securingReq, setSecuringReq] = useState<any>(null);
    const [viewingInvoice, setViewingInvoice] = useState<any>(null);
    const [viewingTracking, setViewingTracking] = useState<any>(null);
    const [newReq, setNewReq] = useState({
        category: CATEGORIES[0],
        brand: '',
        size: '',
        quantity: '',
        unit: UNITS[0],
        state: '',
        city: '',
        area: '',
        pincode: '',
        doorNo: '',
        street: ''
    });

    useEffect(() => {
        fetchRequirements();
        fetchOrders();
    }, []);

    const fetchRequirements = async () => {
        try {
            const res = await fetch('/api/requirements');
            const data = await res.json();
            setRequirements(data);
        } catch (error) {
            console.error('Failed to fetch requirements:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const handleCategoryChange = (category: string) => {
        setNewReq({ 
            ...newReq, 
            category, 
            brand: BRANDS_BY_CATEGORY[category]?.[0] || '',
            size: SIZES_BY_CATEGORY[category]?.[0] || ''
        });
    };

    const handleStateChange = (state: string) => {
        setNewReq({ ...newReq, state, city: '', area: '', pincode: '' });
    };

    const handleCityChange = (city: string) => {
        setNewReq({ ...newReq, city, area: '', pincode: '' });
    };

    const handleAreaChange = (area: string) => {
        const areaData = LOCATIONS.areas[newReq.city as keyof typeof LOCATIONS.areas]?.find(a => a.name === area);
        setNewReq({ ...newReq, area, pincode: areaData?.pincode || '' });
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPosting(true);
        try {
            const res = await fetch('/api/requirements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReq)
            });
            if (res.ok) {
                setNewReq({
                    category: CATEGORIES[0],
                    brand: '',
                    size: '',
                    quantity: '',
                    unit: UNITS[0],
                    state: '',
                    city: '',
                    area: '',
                    pincode: '',
                    doorNo: '',
                    street: ''
                });
                fetchRequirements();
            }
        } catch (error) {
            console.error('Failed to post requirement:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const handleSecureOrder = async (quoteId: string, deliveryLocation: string, deliveryDate: string, instructions: string) => {
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quoteId, deliveryLocation, deliveryDate, instructions })
            });
            if (res.ok) {
                setSecuringQuoteId(null);
                setSecuringReq(null);
                fetchRequirements();
                fetchOrders();
            }
        } catch (error) {
            console.error('Failed to secure order:', error);
        }
    };

    if (user.status !== 'approved') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center">
                    <Clock className="h-10 w-10 text-blue-600 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Verification in Progress</h2>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto">
                        Welcome to Thoon Enterprise! Your account is currently being reviewed by our team.
                        You'll get full access to the Buyer Dashboard once approved.
                    </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-600">
                    Expected verification time: <span className="font-semibold">2-4 business hours</span>
                </div>
            </div>
        );
    }

    return (
        <ProfileGuard action="request-quotes">
            <div className="space-y-8">
                <div className="flex justify-between items-start bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-200/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#caa75e]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-1 h-8 bg-[#caa75e] rounded-full shadow-[0_0_10px_rgba(202,167,94,0.5)]" />
                        <h1 className="text-3xl font-bold text-[#1f2a30] uppercase tracking-tight">Buyer Dashboard</h1>
                    </div>
                    <p className="text-slate-600 font-medium ml-4 text-sm">Post material requirements and get live estimations.</p>
                </div>
                <div className="relative z-10 text-right">
                    <p className="font-bold text-[#caa75e] uppercase text-[10px] tracking-[0.2em] bg-white/5 px-4 py-1.5 rounded-full border border-[#caa75e]/20 inline-block mb-2 backdrop-blur-sm">{user.name}</p>
                    <div className="flex items-center justify-end gap-2 text-[8px] font-bold text-[#caa75e]/80 tracking-[0.3em] uppercase">
                        <div className="w-1.5 h-1.5 bg-[#caa75e] rounded-full animate-pulse shadow-[0_0_8px_rgba(202,167,94,0.5)]" />
                        Authorized Buyer
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {[
                    { id: 'requests', label: 'My Requirements', icon: Package },
                    { id: 'orders', label: 'My Orders', icon: Clock, count: orders.length }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 border ${activeTab === tab.id
                            ? 'bg-[#caa75e] text-white border-[#caa75e] shadow-[0_8px_24px_rgba(202,167,94,0.3)] scale-105'
                            : 'bg-white/80 text-slate-600 border-slate-200/60 hover:bg-white hover:text-[#1f2a30]'
                            }`}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                            <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold ${activeTab === tab.id ? 'bg-white text-[#caa75e]' : 'bg-[#caa75e]/10 text-[#caa75e]'}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'requests' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Post Requirement Form */}
                    <Card className="lg:col-span-1 bg-white/95 backdrop-blur-sm border border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden rounded-2xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                        <CardHeader className="bg-[#1f2a30] text-white py-4">
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <Plus className="h-4 w-4 text-[#caa75e]" />
                                Post Requirement
                            </h2>
                        </CardHeader>
                        <CardBody className="p-6">
                            <form onSubmit={handlePost} className="space-y-5">
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Category</label>
                                            <select
                                                value={newReq.category}
                                                onChange={(e) => handleCategoryChange(e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                            >
                                                {CATEGORIES.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Brand Preference</label>
                                            <select
                                                value={newReq.brand}
                                                onChange={(e) => setNewReq({ ...newReq, brand: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                            >
                                                {BRANDS_BY_CATEGORY[newReq.category]?.map((b) => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Size / Type</label>
                                            <select
                                                value={newReq.size}
                                                onChange={(e) => setNewReq({ ...newReq, size: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                            >
                                                <option value="" disabled>Select Size</option>
                                                {SIZES_BY_CATEGORY[newReq.category]?.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Quantity & Unit</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={newReq.quantity}
                                                    onChange={(e) => setNewReq({ ...newReq, quantity: e.target.value })}
                                                    className="w-20 px-3 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                                />
                                                <select
                                                    value={newReq.unit}
                                                    onChange={(e) => setNewReq({ ...newReq, unit: e.target.value })}
                                                    className="flex-1 px-3 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                                >
                                                    {UNITS.map((u) => (
                                                        <option key={u} value={u}>{u}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 mt-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block flex items-center gap-2">
                                            <MapPin className="h-3 w-3" /> Delivery Location
                                        </label>

                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <select
                                                    value={newReq.state}
                                                    onChange={(e) => handleStateChange(e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                                >
                                                    <option value="" disabled>Select State</option>
                                                    {LOCATIONS.states.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <select
                                                    value={newReq.city}
                                                    onChange={(e) => handleCityChange(e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                                    disabled={!newReq.state}
                                                >
                                                    <option value="" disabled>Select City</option>
                                                    {LOCATIONS.cities[newReq.state as keyof typeof LOCATIONS.cities]?.map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <select
                                                value={newReq.area}
                                                onChange={(e) => handleAreaChange(e.target.value)}
                                                className="col-span-1 px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                                disabled={!LOCATIONS.areas[newReq.city as keyof typeof LOCATIONS.areas]}
                                            >
                                                <option value="" disabled>Select Area / Locality</option>
                                                {LOCATIONS.areas[newReq.city as keyof typeof LOCATIONS.areas]?.map((a) => (
                                                    <option key={a.name} value={a.name}>{a.name}</option>
                                                )) || <option value="">Other (Enter manually in Street)</option>}
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Pincode (Auto-filled)"
                                                value={newReq.pincode}
                                                readOnly
                                                className="col-span-1 px-4 py-3 bg-slate-100/80 border border-slate-200/60 rounded-xl outline-none text-xs font-bold text-slate-500 cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Door No / Building"
                                                value={newReq.doorNo}
                                                onChange={(e) => setNewReq({ ...newReq, doorNo: e.target.value })}
                                                className="col-span-1 px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Street Name"
                                                value={newReq.street}
                                                onChange={(e) => setNewReq({ ...newReq, street: e.target.value })}
                                                className="col-span-1 px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-xs font-bold text-[#1f2a30]"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-14 bg-[#caa75e] hover:bg-[#b89653] text-white border-none shadow-[0_8px_24px_rgba(202,167,94,0.3)] rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all hover:-translate-y-0.5 active:scale-95" disabled={isPosting}>
                                    {isPosting ? 'Broadcasting...' : 'Broadcast Requirement'}
                                </Button>
                            </form>
                        </CardBody>
                    </Card>

                    {/* My Requirements & Estimations */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#1f2a30]">My Active Requirements</h2>
                            <span className="text-xs text-slate-400 font-medium">{requirements.length} Total</span>
                        </div>
                        {requirements.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50/60 rounded-2xl border-2 border-dashed border-slate-200/60">
                                <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-600 font-medium">No active requirements.</p>
                                <p className="text-sm text-slate-500">Your posted requirements will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requirements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((req) => (
                                    <RequirementCard
                                        key={req.id}
                                        req={req}
                                        onSecure={(qId) => {
                                            setSecuringQuoteId(qId);
                                            setSecuringReq(req);
                                        }}
                                        isOrdering={securingQuoteId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50/60 rounded-2xl border-2 border-dashed border-slate-200/60">
                            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 font-medium">No orders yet.</p>
                            <p className="text-sm text-slate-500">Secure an estimation to start your first order.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((order) => (
                                <OrderCard key={order.id} order={order} onRefresh={fetchOrders} setViewingInvoice={setViewingInvoice} setViewingTracking={setViewingTracking} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Secure Order Modal */}
            <SecureOrderModal
                isOpen={!!securingQuoteId}
                onClose={() => {
                    setSecuringQuoteId(null);
                    setSecuringReq(null);
                }}
                req={securingReq}
                quoteId={securingQuoteId!}
                onConfirm={handleSecureOrder}
                isOrdering={!!securingQuoteId}
            />

            {/* Invoice Modal */}
            <Modal
                isOpen={!!viewingInvoice}
                onClose={() => setViewingInvoice(null)}
                maxWidth="max-w-4xl"
            >
                <Invoice order={viewingInvoice} />
            </Modal>

            {/* Tracking Modal */}
            <Modal
                isOpen={!!viewingTracking}
                onClose={() => setViewingTracking(null)}
                title="Order Tracking"
            >
                <div className="space-y-8 p-4">
                    {[
                        { label: 'Requirement Posted', sub: 'Broadcast to market', active: true, done: true },
                        { label: 'Quote Accepted', sub: 'Order secured', active: true, done: true },
                        { label: 'Material Dispatched', sub: 'In transit', active: ['shipped', 'delivered'].includes(viewingTracking?.status), done: ['shipped', 'delivered'].includes(viewingTracking?.status) },
                        { label: 'Delivery Confirmed', sub: 'Proof of delivery verified', active: viewingTracking?.status === 'delivered', done: viewingTracking?.status === 'delivered' }
                    ].map((step, idx, arr) => (
                        <div key={idx} className="flex gap-4 relative">
                            {idx < arr.length - 1 && (
                                <div className={`absolute left-4 top-8 w-px h-8 ${step.done ? 'bg-[#caa75e]' : 'bg-slate-100'}`} />
                            )}
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 ${step.done ? 'bg-[#caa75e] text-white' : step.active ? 'bg-[#caa75e]/20 text-[#caa75e] animate-pulse' : 'bg-slate-100 text-slate-300'
                                }`}>
                                {step.done ? <Check className="h-4 w-4" /> : <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                            </div>
                            <div>
                                <p className={`font-bold uppercase text-[10px] tracking-widest ${step.active ? 'text-[#1f2a30]' : 'text-slate-400'}`}>{step.label}</p>
                                <p className="text-xs text-slate-500 font-medium">{step.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
            </div>
        </ProfileGuard>
    );
}

// Requirement Card Component
function RequirementCard({ req, onSecure, isOrdering }: { req: any, onSecure: (id: string) => void, isOrdering: string | null }) {
    const [quotes, setQuotes] = useState<any[]>([]);

    useEffect(() => {
        if (req.status === 'estimated' || req.status === 'pending') {
            fetch(`/api/quotes?reqId=${req.id}&best=true`)
                .then(res => res.json())
                .then(setQuotes);
        }
    }, [req.id, req.status]);

    return (
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100/50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-[#caa75e]/10 transition-colors duration-300" />

            <div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200/60 group-hover:shadow-[0_8px_24px_rgba(202,167,94,0.15)] transition-all duration-300">
                        <Package className="h-5 w-5 text-[#1f2a30] group-hover:text-[#caa75e] transition-colors duration-300" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${req.status === 'pending'
                        ? 'bg-[#caa75e]/10 text-[#caa75e] border-[#caa75e]/20'
                        : 'bg-green-50 text-green-700 border-green-100'
                        }`}>
                        {req.status === 'pending' ? 'Seeking Quotes' : 'Ready'}
                    </span>
                </div>

                <h3 className="text-sm font-bold text-[#1f2a30] uppercase tracking-tight line-clamp-1" title={req.product}>{req.product}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1 mb-3">{req.category} • {req.brand}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-600 bg-slate-50/80 px-3 py-2 rounded-lg">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">Qty</span>
                        <span className="font-bold text-[#1f2a30]">{req.quantity} {req.unit}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[9px] text-slate-500 font-medium leading-tight px-1">
                        <MapPin className="h-3 w-3 text-slate-300 mt-0.5 shrink-0" />
                        <span className="line-clamp-2" title={req.deliveryLocation || 'Location not specified'}>
                            {req.deliveryLocation || 'Location not specified'}
                        </span>
                    </div>
                </div>
            </div>

            {req.status === 'estimated' && quotes.length > 0 && (
                <div className="mt-2 p-4 bg-[#1f2a30] rounded-2xl border border-white/10 shadow-lg relative overflow-hidden group/quote">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#caa75e]/10 rounded-full blur-2xl -mr-12 -mt-12" />
                    <div className="relative z-10">
                        <p className="text-[9px] text-[#caa75e] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <Star className="h-2.5 w-2.5 fill-[#caa75e]" /> Best Quote
                        </p>
                        <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-xs font-bold text-white/60">₹</span>
                            <span className="text-2xl font-black text-white tracking-tight">{quotes[0].finalPrice.toLocaleString()}</span>
                        </div>
                        <Button
                            onClick={() => onSecure(quotes[0].id)}
                            disabled={isOrdering === quotes[0].id}
                            className="w-full h-9 bg-[#caa75e] hover:bg-[#b89653] text-white font-black uppercase text-[10px] tracking-widest rounded-lg shadow-sm"
                        >
                            {isOrdering === quotes[0].id ? '...' : 'Secure Order'}
                        </Button>
                    </div>
                </div>
            )}

            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest text-center border-t border-slate-100 pt-3 mt-auto">
                Posted {new Date(req.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
}

// Secure Order Modal Component
function SecureOrderModal({ isOpen, onClose, req, quoteId, onConfirm, isOrdering }: { 
    isOpen: boolean, 
    onClose: () => void, 
    req: any, 
    quoteId: string, 
    onConfirm: any, 
    isOrdering: boolean 
}) {
    const [loc, setLoc] = useState('');
    const [date, setDate] = useState('');
    const [instructions, setInstructions] = useState('');

    useEffect(() => {
        if (req) {
            setLoc(req.deliveryLocation || '');
            // Default date: 3 days from now
            const d = new Date();
            d.setDate(d.getDate() + 3);
            setDate(d.toISOString().split('T')[0]);
        }
    }, [req]);

    if (!req) return null;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    const minDateStr = minDate.toISOString().split('T')[0];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Secure Your Material">
            <div className="space-y-6">
                <div className="bg-[#caa75e]/10 p-4 rounded-xl border border-[#caa75e]/20 flex gap-3">
                    <Info className="h-5 w-5 text-[#caa75e] shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-[#1f2a30] uppercase tracking-widest mb-1">Logistics Note</p>
                        <p className="text-[11px] text-[#1f2a30] font-medium leading-relaxed">
                            Thoon Enterprise ensures premium quality checks. Please allow <span className="font-black">2-3 business days</span> for processing and delivery to your site.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Delivery Site Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={loc}
                                onChange={e => setLoc(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-sm font-bold text-[#1f2a30]"
                                placeholder="Enter complete delivery address"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Delivery Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                min={minDateStr}
                                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-sm font-bold text-[#1f2a30]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Special Instructions</label>
                            <input
                                type="text"
                                value={instructions}
                                onChange={e => setInstructions(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-[#caa75e]/50 focus:border-[#caa75e] outline-none text-sm font-bold text-[#1f2a30]"
                                placeholder="Optional"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => onConfirm(quoteId, loc, date, instructions)}
                    disabled={!loc.trim() || !date || isOrdering}
                    className="w-full h-12 bg-[#caa75e] hover:bg-[#b89653] text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-[0_8px_24px_rgba(202,167,94,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isOrdering ? 'Processing...' : 'Confirm Order'}
                </Button>
            </div>
        </Modal>
    );
}

// Order Card Component
function OrderCard({ order, onRefresh, setViewingInvoice, setViewingTracking }: { 
    order: any, 
    onRefresh: () => void, 
    setViewingInvoice: (order: any) => void, 
    setViewingTracking: (order: any) => void 
}) {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleRate = async () => {
        try {
            await fetch(`/api/orders/${order.id}/rate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, feedback })
            });
            onRefresh();
        } catch (error) {
            console.error('Failed to rate order:', error);
        }
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-[#1f2a30] uppercase tracking-tight">{order.product}</h3>
                    <p className="text-sm text-slate-600 font-medium">{order.category} • {order.brand}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                    order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    'bg-[#caa75e]/10 text-[#caa75e] border-[#caa75e]/20'
                }`}>
                    {order.status}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Quantity</p>
                    <p className="text-sm font-bold text-[#1f2a30]">{order.quantity} {order.unit}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</p>
                    <p className="text-sm font-bold text-[#1f2a30]">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order Date</p>
                    <p className="text-sm font-bold text-[#1f2a30]">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Delivery</p>
                    <p className="text-sm font-bold text-[#1f2a30]">{order.deliveryDate || 'Scheduled'}</p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingInvoice(order)}
                        className="text-[#caa75e] hover:text-[#b89653] hover:bg-[#caa75e]/5"
                    >
                        <Eye className="h-4 w-4 mr-1" /> Invoice
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingTracking(order)}
                        className="text-[#caa75e] hover:text-[#b89653] hover:bg-[#caa75e]/5"
                    >
                        <Truck className="h-4 w-4 mr-1" /> Track
                    </Button>
                </div>

                {order.status === 'delivered' && !order.rated && (
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`h-4 w-4 ${star <= rating ? 'text-[#caa75e]' : 'text-slate-300'}`}
                                >
                                    <Star className="h-full w-full fill-current" />
                                </button>
                            ))}
                        </div>
                        <Button
                            size="sm"
                            onClick={handleRate}
                            disabled={rating === 0}
                            className="text-xs bg-[#caa75e] hover:bg-[#b89653] text-white"
                        >
                            Rate
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Invoice Component (placeholder)
function Invoice({ order }: { order: any }) {
    return (
        <ProfileGuard action="access-dashboard">
            <div className="bg-white p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-[#1f2a30] mb-6">Invoice</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-600">Order ID</p>
                            <p className="font-bold text-[#1f2a30]">{order.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-600">Date</p>
                            <p className="font-bold text-[#1f2a30]">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="border-t pt-4">
                        <p className="text-sm text-slate-600">Product</p>
                        <p className="font-bold text-[#1f2a30]">{order.product}</p>
                    </div>
                    <div className="border-t pt-4">
                        <p className="text-sm text-slate-600">Total Amount</p>
                        <p className="text-2xl font-bold text-[#1f2a30]">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </ProfileGuard>
    );
}
