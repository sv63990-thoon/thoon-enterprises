import React from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Building2, Users, Target, Globe } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Premium Hero Section */}
            <section className="bg-indigo-950 py-32 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.1)_0%,transparent_50%)]" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/40 rounded-full blur-[120px] opacity-50" />

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Building2 className="h-4 w-4 text-amber-400" />
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">India's Construction Powerhouse</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-oswald font-black text-white mb-8 tracking-tight leading-tight uppercase">
                        Redefining <span className="bg-gold-gradient bg-clip-text text-transparent">Infrastructure</span> Procurement
                    </h1>
                    <p className="text-lg md:text-xl text-indigo-200/70 max-w-3xl mx-auto font-medium leading-relaxed">
                        Thoon Enterprises is on a relentless mission to modernize the construction ecosystem through data-driven transparency, smart technology, and an unwavering commitment to quality.
                    </p>
                </div>
            </section>

            {/* Our Story & Values */}
            <Section className="py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-10 bg-amber-400 rounded-full" />
                            <h2 className="text-4xl font-black text-indigo-950 uppercase tracking-tighter">The Thoon Way</h2>
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Founded in 2024, Thoon Enterprises was born out of a simple observation: construction procurement is fundamentally broken. Fragmentation, complex middlemen, and opaque pricing often lead to project delays and budget overruns.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            We've built a digital-first marketplace that bridges the gap between those who build and those who manufacture. By leveraging reverse bidding and a verified supplier network, we ensure that every brick, bag of cement, and steel rod is delivered on time, at the right price.
                        </p>
                        <div className="pt-4">
                            <Button className="bg-indigo-950 hover:bg-indigo-900 text-white font-black uppercase tracking-widest px-8 h-14 rounded-2xl shadow-xl shadow-indigo-100">
                                Partner with Us
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-2xl shadow-indigo-100/50 bg-indigo-50/50 rounded-3xl overflow-hidden group">
                            <CardBody className="p-8">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                    <Target className="h-7 w-7 text-amber-500" />
                                </div>
                                <h3 className="text-xl font-black text-indigo-950 mb-3 uppercase tracking-tight">Our Mission</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">To democratize access to top-tier construction materials for builders of all scales.</p>
                            </CardBody>
                        </Card>
                        <Card className="border-none shadow-2xl shadow-amber-100/50 bg-amber-50/50 rounded-3xl overflow-hidden group">
                            <CardBody className="p-8">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform">
                                    <Globe className="h-7 w-7 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-black text-indigo-950 mb-3 uppercase tracking-tight">Our Vision</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">To be the digital backbone of India's infrastructure boom by 2030.</p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </Section>

            {/* Leadership Section */}
            <Section className="bg-slate-50 relative overflow-hidden py-32">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black text-indigo-950 uppercase tracking-tight mb-4">The Minds Behind Thoon</h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto italic">Industry veterans and tech innovators working together to build a better future.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                    <TeamMember name="Sathish" role="Founder & CEO" bio="Visionary leader driving the strategic evolution of the marketplace." />
                    <TeamMember name="Jayashree" role="Chief Operations Officer" bio="Operations expert ensuring seamless supply chain and delivery excellence." />
                    <TeamMember name="Megha Karunya" role="Head of Technology" bio="Tech architect building the robust digital-first procurement systems." />
                </div>
            </Section>

            {/* Impact/Call to Action */}
            <Section className="py-32">
                <div className="bg-indigo-950 p-12 md:p-20 rounded-[4rem] relative overflow-hidden shadow-3xl">
                    <div className="absolute inset-0 bg-gold-gradient opacity-10" />
                    <div className="relative z-10 text-center space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">Ready to build?</h2>
                        <p className="text-xl text-indigo-200/60 max-w-2xl mx-auto font-medium">Join 500+ builders and 2,000+ suppliers on India's most innovative construction marketplace.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Button className="bg-amber-400 hover:bg-amber-500 text-indigo-950 font-black uppercase tracking-[0.2em] px-10 h-16 rounded-2xl shadow-2xl shadow-amber-400/20">Get Started</Button>
                            <Button variant="outline" className="border-indigo-800 text-white hover:bg-white/5 font-black uppercase tracking-[0.2em] px-10 h-16 rounded-2xl">Download Profile</Button>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}

function TeamMember({ name, role, bio }: { name: string, role: string, bio: string }) {
    return (
        <Card className="border-none shadow-xl hover:shadow-2xl transition-all h-full bg-white rounded-3xl overflow-hidden group">
            <div className="h-80 bg-slate-100 w-full relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-indigo-50/30 group-hover:scale-110 transition-transform duration-700">
                    <Users className="h-24 w-24 opacity-20" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-indigo-950/20 to-transparent" />
            </div>
            <CardBody className="p-10">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">{name}</h3>
                        <p className="text-xs font-black text-amber-500 uppercase tracking-widest">{role}</p>
                    </div>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed">{bio}</p>
                </div>
            </CardBody>
        </Card>
    );
}
