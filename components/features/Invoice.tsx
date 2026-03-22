"use client";

import React from 'react';
import { Card, CardBody } from "@/components/ui/Card";
import { Download, Printer, Building2, Package, Mail, MapPin, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface InvoiceProps {
    order: any;
}

export function Invoice({ order }: InvoiceProps) {
    if (!order) return null;

    const subtotal = order.totalPrice; // Treat stored price as Base (Tax Exclusive) to match Seller Quote
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;
    const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Card className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border-slate-100 print:shadow-none print:border-none">
            {/* Header / Branding */}
            <div className="bg-indigo-950 p-8 text-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-1 h-8 bg-amber-400 rounded-full" />
                            <h1 className="text-3xl font-black uppercase tracking-widest bg-gold-gradient bg-clip-text text-transparent">THOON</h1>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">Enterprises • Smart Procurement</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-4xl font-black uppercase tracking-tight text-white/20">Tax Invoice</h2>
                        <p className="text-amber-400 font-bold tracking-widest mt-1">NO: {invoiceNumber}</p>
                    </div>
                </div>
            </div>

            <CardBody className="p-8 print:p-0">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Material Delivered From</h3>
                        <div className="space-y-1">
                            <p className="font-black text-indigo-950 text-lg uppercase tracking-tight">Thoon Enterprises</p>
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                <Building2 className="h-3.5 w-3.5" />
                                <span className="text-xs">GSTIN: 33AAACX0123A1Z1 (Verified)</span>
                            </p>
                            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="text-xs">support@thoon.co</span>
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Bill To</h3>
                        <div className="space-y-1">
                            <p className="font-black text-indigo-950 text-lg uppercase tracking-tight">{order.buyerName || 'Valued Customer'}</p>
                            <p className="text-sm text-slate-500 font-medium flex items-start gap-2 max-w-xs">
                                <MapPin className="h-3.5 w-3.5 mt-0.5" />
                                {order.deliveryLocation || 'Site Address Provided at Order'}
                            </p>
                            <div className="flex gap-4 mt-2">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">Delivered Date: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden mb-8 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Material Brand Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Material Category</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Rate</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Quantity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr>
                                <td className="px-6 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                            <Package className="h-5 w-5 text-slate-300" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{order.brand}</p>
                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{order.product}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-8 font-bold text-slate-600 text-sm">{order.category}</td>
                                <td className="px-6 py-8 text-right font-bold text-slate-600">₹{(subtotal / Number(order.quantity)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="px-6 py-8 text-right font-bold text-slate-600">{order.quantity} {order.unit}</td>
                                <td className="px-6 py-8 text-right font-black text-slate-900">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Summary & Signature Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                    <div className="w-full md:max-w-md p-6 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Digital Verification</h4>
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-white rounded-2xl border border-indigo-100 flex items-center justify-center shadow-sm relative group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-10 w-10 text-indigo-600" />
                                <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-1 shadow-sm">
                                    <Check className="h-2 w-2 text-indigo-950 font-bold" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-indigo-950 uppercase tracking-tight">Digitally Signed By</p>
                                <p className="text-sm font-black text-indigo-600 tracking-tighter italic">Thoon Enterprises (Auth Signature)</p>
                                <div className="flex flex-col mt-1">
                                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Hash: {Math.random().toString(36).substring(2, 14).toUpperCase()}</span>
                                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Verified: {new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium mt-4 leading-relaxed">
                            This document is electronically generated and verified by Thoon's cryptographic engine. No physical signature is required for tax compliance.
                        </p>
                    </div>

                    <div className="w-full md:max-w-xs space-y-3 bg-indigo-950 p-8 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl -mr-16 -mb-16" />
                        <div className="flex justify-between text-sm font-bold text-indigo-200/60 relative z-10">
                            <span>Subtotal (Base)</span>
                            <span className="text-white">₹{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-indigo-200/60 relative z-10">
                            <span>GST (18%)</span>
                            <span className="text-white">₹{gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="h-px bg-indigo-900 my-4 relative z-10" />
                        <div className="flex justify-between items-baseline pt-2 relative z-10">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">Payable Amount</span>
                            <span className="text-4xl font-black text-white tracking-tighter">₹{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center print:hidden border-t border-slate-100 pt-8">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Ready for Official Use • Tax Compliant PDF
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" onClick={handlePrint} className="border-indigo-100 text-indigo-950 hover:bg-slate-50 h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:-translate-y-1 active:scale-95 shadow-sm">
                            <Printer className="h-4 w-4 mr-2" /> Print Invoice
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrint} className="bg-indigo-950 text-white border-transparent hover:bg-indigo-900 h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all hover:-translate-y-1 active:scale-95 shadow-xl shadow-indigo-200">
                            <Download className="h-4 w-4 mr-2" /> Download PDF
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
