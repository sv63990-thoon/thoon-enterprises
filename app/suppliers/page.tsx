"use client";

import React from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { TrendingUp, CheckCircle, Smartphone, ArrowRight } from "lucide-react";

export default function SuppliersPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-indigo-950 py-32 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_#fbbf24]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">For Manufacturers & Distributors</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase">
                        Grow your Sales. <br />
                        <span className="bg-gold-gradient bg-clip-text text-transparent drop-shadow-2xl">Zero Risk.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Access verified tenders from top builders. Bid for orders and get guaranteed payments directly from Thoon.
                    </p>

                    <div className="flex justify-center gap-6">
                        <Link href="/pricing">
                            <Button size="lg" className="bg-amber-400 text-indigo-950 hover:bg-amber-300 font-extrabold h-16 px-10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-1 active:scale-95 border-none">
                                View Pricing Plans
                                <ArrowRight className="ml-3 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Core Benefits */}
            <Section className="bg-white py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute -inset-10 bg-indigo-950/5 rounded-[40px] blur-3xl opacity-50" />
                        <div className="relative bg-indigo-950 p-8 rounded-[32px] shadow-2xl border border-white/10 overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl -mr-16 -mt-16" />
                            <h3 className="text-xs font-black text-amber-400 uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">Live Tender Demand</h3>
                            <div className="space-y-4 relative z-10">
                                <TenderItem
                                    material="TMT Steel Fe550"
                                    qty="50 Tons"
                                    location="Bangalore"
                                    value="₹ 28 Lakhs"
                                />
                                <TenderItem
                                    material="OPC Cement"
                                    qty="2000 Bags"
                                    location="Chennai"
                                    value="₹ 8 Lakhs"
                                />
                                <TenderItem
                                    material="Emulsion Paint"
                                    qty="500 Liters"
                                    location="Hyderabad"
                                    value="₹ 1.5 Lakhs"
                                />
                                <div className="text-center text-[10px] font-black text-indigo-300/40 uppercase tracking-widest mt-6">
                                    + 145 Active Tenders right now
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-6">
                            The Thoon Advantage
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight uppercase leading-none">Sell Smarter, <br /><span className="text-indigo-900 opacity-20">Not Harder</span></h2>
                        <div className="space-y-10">
                            <Benefit
                                icon={<TrendingUp className="h-6 w-6" />}
                                title="Consistent Demand"
                                description="Stop chasing leads. We bring verified requirements from verified builders directly to your dashboard."
                            />
                            <Benefit
                                icon={<CheckCircle className="h-6 w-6" />}
                                title="Guaranteed Payment"
                                description="No more follow-ups. Whether the buyer pays in credit or cash, WE ensure you get paid on time, every time."
                            />
                            <Benefit
                                icon={<Smartphone className="h-6 w-6" />}
                                title="One-Click Quoting"
                                description="Receive bid alerts on WhatsApp. Submit your quote with one click. Manage deliveries from your phone."
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA Section */}
            <Section className="pb-24">
                <div className="relative bg-indigo-950 rounded-[40px] overflow-hidden p-12 md:p-20 text-center border border-white/5 shadow-3xl">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-amber-400/10 rounded-full blur-[120px]" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight uppercase leading-[0.9]">Ready to <br />Expand your Business?</h2>
                        <p className="text-indigo-200/60 text-lg md:text-xl mb-12 font-medium">
                            Join 500+ suppliers who have transformed their sales process with Thoon. Start with a free account today.
                        </p>
                        <div className="flex justify-center">
                            <Link href="/pricing" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full bg-white text-indigo-950 hover:bg-slate-100 font-black uppercase text-xs tracking-widest h-16 px-12 rounded-2xl shadow-2xl">
                                    Check Eligibility & Pricing <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}

function Benefit({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex gap-6 group">
            <div className="h-16 w-16 shrink-0 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-amber-400 group-hover:scale-110 transition-all duration-500 shadow-sm group-hover:shadow-amber-100">
                <div className="text-amber-600 group-hover:text-indigo-950 transition-colors duration-500">
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function TenderItem({ material, qty, location, value }: { material: string, qty: string, location: string, value: string }) {
    return (
        <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-amber-400/30 transition-all duration-300 hover:translate-x-2">
            <div>
                <div className="font-black text-white text-sm uppercase tracking-tight mb-1">{material}</div>
                <div className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest">{qty} • {location}</div>
            </div>
            <div className="text-xs font-black text-amber-400 bg-amber-400/10 px-4 py-2 rounded-xl border border-amber-400/20">
                {value}
            </div>
        </div>
    )
}
