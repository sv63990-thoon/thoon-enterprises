"use client";

import React from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { TrendingDown, Clock, Wallet, ShieldCheck, ArrowRight } from "lucide-react";
import { MarketDashboard } from "@/components/features/MarketDashboard/MarketDashboard";

export default function BuyersPage() {
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
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">For Developers & Contractors</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase">
                        Procure Keep. <br />
                        <span className="bg-gold-gradient bg-clip-text text-transparent drop-shadow-2xl">Save 10-15%</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Stop negotiating with multiple vendors. Post your requirement once and let suppliers bid for your order.
                    </p>

                    <div className="flex justify-center gap-6">
                        <Button size="lg" className="bg-amber-400 text-indigo-950 hover:bg-amber-300 font-extrabold h-16 px-10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-1 active:scale-95 border-none">
                            Post a Requirement
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Buy on Thoon */}
            <Section className="py-24">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase leading-none">Why Buy <br /><span className="text-indigo-900 opacity-20">on Thoon?</span></h2>
                    <div className="w-20 h-1.5 bg-amber-400 mx-auto rounded-full mb-8 shadow-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <Benefit
                        icon={<TrendingDown className="h-8 w-8" />}
                        title="Reverse Bidding"
                        description="Suppliers compete to offer you the lowest price. Average savings of 12%."
                    />
                    <Benefit
                        icon={<Wallet className="h-8 w-8" />}
                        title="Buy Now Pay Later"
                        description="Up to ₹50 Lakhs credit. 90 days interest-free for approved projects."
                    />
                    <Benefit
                        icon={<Clock className="h-8 w-8" />}
                        title="Fastest Delivery"
                        description="Real-time tracking from factory to site. No more calling drivers."
                    />
                    <Benefit
                        icon={<ShieldCheck className="h-8 w-8" />}
                        title="Quality Assured"
                        description="All materials verified for ISI standards and quality certifications."
                    />
                </div>
            </Section>

            {/* Live Market Trends */}
            <Section className="bg-indigo-50/50 py-24">
                <div className="container mx-auto">
                    <MarketDashboard />
                </div>
            </Section>

            {/* Live Savings Estimate */}
            <Section className="bg-white py-24">
                <div className="max-w-2xl mx-auto relative group">
                    <div className="absolute -inset-10 bg-indigo-950/5 rounded-[40px] blur-3xl opacity-50 transition-all group-hover:opacity-70" />
                    <div className="relative bg-indigo-950 p-10 rounded-[40px] shadow-2xl border border-white/10 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <h3 className="text-xs font-black text-amber-400 uppercase tracking-[0.3em] mb-10 border-b border-white/5 pb-4 text-center italic">Live Savings Engine</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="text-indigo-300 text-sm font-bold uppercase tracking-wider">Market Price (Steel 10T)</span>
                                <span className="font-black text-white/40 line-through text-lg">₹ 5,80,000</span>
                            </div>
                            <div className="flex justify-between items-center bg-amber-400 p-5 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                                <span className="text-indigo-950 font-black uppercase text-sm tracking-tight">Thoon Best Bid</span>
                                <span className="font-black text-indigo-950 text-2xl">₹ 5,10,000</span>
                            </div>
                            <div className="pt-8 text-center">
                                <div className="text-amber-400 font-black text-3xl uppercase tracking-tighter mb-2">
                                    You Save: <span className="bg-gold-gradient bg-clip-text text-transparent">₹ 70,000 (12%)</span>
                                </div>
                                <div className="text-indigo-300/40 text-[10px] font-bold uppercase tracking-[0.4em]">Instant Procurement Optimization</div>
                            </div>
                            <Button className="w-full mt-6 bg-white text-indigo-950 hover:bg-slate-100 font-black h-14 rounded-xl uppercase text-xs tracking-widest shadow-xl">Start Saving Now</Button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Rewards Section */}
            <Section className="bg-indigo-950 py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-400/5 rounded-full blur-[150px]" />

                <div className="relative z-10 text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight uppercase leading-[0.9]">Earn while <br />you build</h2>
                    <p className="text-indigo-200/60 text-lg md:text-xl font-medium">Our loyalty program rewards you for every bulk purchase.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                    <RewardCard
                        title="Cashback"
                        value="Up to 2%"
                        desc="Instant cashback on prepaid orders above ₹10 Lakhs."
                    />
                    <RewardCard
                        title="Credit Limit"
                        value="2x Boost"
                        desc="Consistent repayment doubles your credit eligibility within 6 months."
                    />
                    <RewardCard
                        title="Premium Support"
                        value="24/7"
                        desc="Dedicated key account manager for all your site needs."
                    />
                </div>
            </Section>
        </div>
    );
}

function Benefit({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center text-center group">
            <div className="h-20 w-20 bg-indigo-50 rounded-[28px] flex items-center justify-center group-hover:bg-amber-400 group-hover:scale-110 transition-all duration-500 shadow-sm mb-6 group-hover:shadow-amber-100/50">
                <div className="text-amber-600 group-hover:text-indigo-950 transition-colors duration-500">
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
        </div>
    );
}

function RewardCard({ title, value, desc }: { title: string, value: string, desc: string }) {
    return (
        <div className="relative bg-white/5 border border-white/5 p-10 rounded-[32px] text-center hover:border-amber-400/20 transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
            <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-[0.03] transition-opacity" />
            <div className="text-amber-400/40 text-[10px] uppercase tracking-[0.4em] font-black mb-4">{title}</div>
            <div className="text-5xl font-black text-white mb-6 bg-gold-gradient bg-clip-text text-transparent">{value}</div>
            <p className="text-indigo-200/40 text-sm font-medium leading-relaxed">{desc}</p>
        </div>
    )
}
