"use client";

import React from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { UserPlus, Banknote, ClipboardCheck, ArrowRight, Building2, Store } from "lucide-react";

export default function PartnerPage() {
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
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Thoon Associate Program</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase">
                        Refer Businesses. <br />
                        <span className="bg-gold-gradient bg-clip-text text-transparent drop-shadow-2xl">Get Paid.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Join our network. Refer Buyers or Suppliers to Thoon Enterprises and earn attractive commissions. No limits on how much you can earn.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Button size="lg" className="bg-amber-400 text-indigo-950 hover:bg-amber-300 font-extrabold h-16 px-10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(251,191,36,0.3)] transition-all hover:-translate-y-1 active:scale-95 border-none">
                            Join Now
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/5 h-16 px-10 rounded-2xl font-bold uppercase text-xs tracking-widest backdrop-blur-sm transition-all hover:-translate-y-1">
                            How it Works
                        </Button>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <Section className="py-24">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-6">
                        Seamless Onboarding
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase leading-none">Simple 3-Step <br /><span className="text-indigo-900 opacity-20">Process</span></h2>
                    <div className="w-20 h-1.5 bg-amber-400 mx-auto rounded-full mb-8" />
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">No complex targets. No waiting periods.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <StepCard
                        icon={<UserPlus className="h-8 w-8" />}
                        title="1. Refer a Business"
                        description="Connect us with Builders, Contractors, Manufacturers, or Distributors."
                    />
                    <StepCard
                        icon={<ClipboardCheck className="h-8 w-8" />}
                        title="2. We Onboard Them"
                        description="Our team verifies the business and onboards them to the Thoon platform."
                    />
                    <StepCard
                        icon={<Banknote className="h-8 w-8" />}
                        title="3. You Get Paid"
                        description="Receive competitive commissions directly to your bank account for every successful referral."
                    />
                </div>
            </Section>

            {/* Who Can You Refer - CTA Section */}
            <Section className="pb-32 px-4">
                <div className="relative bg-indigo-950 rounded-[40px] overflow-hidden p-12 lg:p-24 border border-white/5 shadow-3xl">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-400/5 rounded-full blur-[150px]" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight uppercase leading-[0.9]">Unlimited <br />Earning Potential</h2>
                            <p className="text-indigo-200/60 text-lg md:text-xl mb-12 font-medium">
                                Whether you refer a small hardware shop or a large steel manufacturer, you earn for every valid connection. There is no cap on referrals.
                            </p>
                            <div className="space-y-8">
                                <div className="flex items-center gap-6 group">
                                    <div className="h-14 w-14 rounded-2xl bg-white/5 group-hover:bg-amber-400 flex items-center justify-center text-amber-400 group-hover:text-indigo-950 transition-all duration-500 shadow-sm">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-black text-white uppercase tracking-tight text-lg mb-1">Refer Buyers</div>
                                        <div className="text-indigo-300/40 text-[10px] font-bold uppercase tracking-widest">Builders • Contractors • Developers</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="h-14 w-14 rounded-2xl bg-white/5 group-hover:bg-amber-400 flex items-center justify-center text-amber-400 group-hover:text-indigo-950 transition-all duration-500 shadow-sm">
                                        <Store className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="font-black text-white uppercase tracking-tight text-lg mb-1">Refer Suppliers</div>
                                        <div className="text-indigo-300/40 text-[10px] font-bold uppercase tracking-widest">Manufacturers • Wholesalers</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-amber-400/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Card className="bg-white p-12 rounded-[40px] text-center shadow-2xl relative">
                                <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Ready to Start?</h3>
                                <p className="text-slate-500 mb-10 font-medium">
                                    Become a Thoon Associate today and turn your network into net worth.
                                </p>
                                <Button className="w-full bg-indigo-950 hover:bg-indigo-900 text-white font-black h-16 rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-lg transition-all hover:-translate-y-1">
                                    Register as Partner <ArrowRight className="ml-3 h-4 w-4" />
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}

function StepCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-col items-center text-center group">
            <div className="h-24 w-24 bg-indigo-50 rounded-[32px] flex items-center justify-center group-hover:bg-amber-400 group-hover:scale-110 transition-all duration-500 shadow-sm mb-8 group-hover:shadow-amber-100/50">
                <div className="text-amber-600 group-hover:text-indigo-950 transition-colors duration-500">
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">{title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed max-w-[280px]">{description}</p>
        </div>
    );
}
