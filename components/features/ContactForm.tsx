"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Loader2 } from "lucide-react";

export const ContactForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        setSuccess(true);
        if (onSuccess) setTimeout(onSuccess, 2000);
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Request Received!</h3>
                <p className="text-slate-600">
                    Our team will contact you within 24 hours to verify your details.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                        First Name
                    </label>
                    <input
                        id="firstName"
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="John"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                        Last Name
                    </label>
                    <input
                        id="lastName"
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Work Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="john@company.com"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-slate-700">
                    Company Name
                </label>
                <input
                    id="company"
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Construction Pvt Ltd"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-slate-700">
                    I am a...
                </label>
                <select
                    id="role"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                    <option>Buyer (Developer/Contractor)</option>
                    <option>Supplier (Distributor/Brand)</option>
                    <option>Other</option>
                </select>
            </div>

            <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Get Started"
                )}
            </Button>

            <p className="text-xs text-center text-slate-500 mt-4">
                By submitting, you agree to our Terms of Service and Privacy Policy.
            </p>
        </form>
    );
};
