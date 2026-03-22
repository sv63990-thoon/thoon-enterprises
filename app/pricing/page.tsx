"use client";

import React from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Check, X, Shield, Zap, TrendingUp } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">

            {/* Hero */}
            <section className="bg-slate-900 py-20 text-center text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Supplier Plans</h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Join India's fastest growing construction marketplace. Choose a plan that fits your business scale.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic Plan */}
                    <Card className="border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                        <CardHeader className="p-6 border-b border-slate-100 bg-white">
                            <h3 className="text-xl font-bold text-slate-900">Basic</h3>
                            <div className="mt-4 flex items-baseline text-slate-900">
                                <span className="text-4xl font-extrabold tracking-tight">Free</span>
                                <span className="ml-1 text-xl font-semibold text-slate-500">/forever</span>
                            </div>
                            <p className="mt-4 text-sm text-slate-500">Essential access to public tenders.</p>
                        </CardHeader>
                        <CardBody className="p-6 bg-slate-50/50 h-full">
                            <ul className="space-y-4">
                                <FeatureItem text="Access Public Tenders" />
                                <FeatureItem text="Basic Company Profile" />
                                <FeatureItem text="Email Support" />
                                <FeatureItem text="Standard Bid Visibility" />
                                <FeatureItem text="0% Trust Score Boost" included={false} />
                                <FeatureItem text="Priority Lead Access" included={false} />
                                <FeatureItem text="Verified Badge" included={false} />
                            </ul>
                            <div className="mt-8">
                                <Button variant="outline" className="w-full">Get Started</Button>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Verified Plan */}
                    <Card className="border-2 border-blue-500 shadow-xl relative scale-105 z-10">
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Most Popular
                            </span>
                        </div>
                        <CardHeader className="p-6 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <h3 className="text-xl font-bold text-slate-900">Verified</h3>
                            </div>
                            <div className="mt-4 flex items-baseline text-slate-900">
                                <span className="text-4xl font-extrabold tracking-tight">₹4,999</span>
                                <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
                            </div>
                            <p className="mt-4 text-sm text-slate-500">Build trust and get priority visibility.</p>
                        </CardHeader>
                        <CardBody className="p-6 bg-white h-full">
                            <ul className="space-y-4">
                                <FeatureItem text="Access Public Tenders" />
                                <FeatureItem text="Enhanced Profile & SEO" />
                                <FeatureItem text="Priority Email & Chat Support" />
                                <FeatureItem text="Verified Supplier Badge" />
                                <FeatureItem text="60% Trust Score Boost" />
                                <FeatureItem text="Enhanced Lead Visibility" />
                                <FeatureItem text="Gold Priority" included={false} />
                            </ul>
                            <div className="mt-8">
                                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Subscribe Now</Button>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Gold Plan */}
                    <Card className="border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                        <CardHeader className="p-6 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="h-5 w-5 text-yellow-500" />
                                <h3 className="text-xl font-bold text-slate-900">Gold</h3>
                            </div>
                            <div className="mt-4 flex items-baseline text-slate-900">
                                <span className="text-4xl font-extrabold tracking-tight">₹9,999</span>
                                <span className="ml-1 text-xl font-semibold text-slate-500">/mo</span>
                            </div>
                            <p className="mt-4 text-sm text-slate-500">For high-volume suppliers scaling fast.</p>
                        </CardHeader>
                        <CardBody className="p-6 bg-slate-50/50 h-full">
                            <ul className="space-y-4">
                                <FeatureItem text="Access All Tenders" />
                                <FeatureItem text="Premium Profile Showcase" />
                                <FeatureItem text="Dedicated Account Manager" />
                                <FeatureItem text="100% Trust Score Boost" />
                                <FeatureItem text="Top Order Priority" />
                                <FeatureItem text="Credit Verified Leads" />
                                <FeatureItem text="Market Pricing Analytics" />
                            </ul>
                            <div className="mt-8">
                                <Button variant="outline" className="w-full">Contact Sales</Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </Section>

            {/* FAQ */}
            <Section className="bg-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <FaqItem
                            question="How do I get the Verified Badge?"
                            answer="Upload your GST Certificate, Factory Photos, and last 3 months' Bank Statements. Our team verifies these documents within 24 hours."
                        />
                        <FaqItem
                            question="Can I cancel my subscription?"
                            answer="Yes, you can cancel at any time. Your benefits will continue until the end of the current billing cycle."
                        />
                        <FaqItem
                            question="What are 'Credit Verified' leads?"
                            answer="These are tenders posted by buyers who have already been pre-approved for credit by our financial partners. Payment is guaranteed."
                        />
                    </div>
                </div>
            </Section>
        </div>
    );
}

function FeatureItem({ text, included = true }: { text: string, included?: boolean }) {
    return (
        <li className="flex items-center">
            {included ? (
                <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                </div>
            ) : (
                <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-slate-300" />
                </div>
            )}
            <p className={`ml-3 text-sm ${included ? 'text-slate-700' : 'text-slate-400'}`}>{text}</p>
        </li>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="border-b border-slate-200 pb-6">
            <h3 className="text-lg font-medium text-slate-900 mb-2">{question}</h3>
            <p className="text-slate-600">{answer}</p>
        </div>
    );
}
