"use client";

import React, { useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
// import { Slider } from "@/components/ui/Slider"; // We might need to create this or use standard input
import { Wallet, Calendar, PieChart } from "lucide-react";

export const CreditSimulator = () => {
    const [gstin, setGstin] = useState("");
    const [status, setStatus] = useState<"idle" | "checking" | "approved" | "rejected">("idle");
    const [amount, setAmount] = useState(500000);
    const [tenure, setTenure] = useState(30);

    const interestRate = 1.2; // 1.2% per month roughly
    const interest = Math.round((amount * (interestRate / 100) * (tenure / 30)));
    const totalRepayment = amount + interest;

    const handleCheck = () => {
        if (!gstin) return;
        setStatus("checking");

        // Simulate API verification
        setTimeout(() => {
            // Demo logic: Reject if GSTIN contains "00", otherwise Approve
            if (gstin.includes("00")) {
                setStatus("rejected");
            } else {
                setStatus("approved");
            }
        }, 1500);
    };

    const reset = () => {
        setStatus("idle");
        setGstin("");
    };

    if (status === "approved") {
        return (
            <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-green-900 to-slate-900 text-white border-green-700 shadow-2xl">
                <CardBody className="p-8 text-center">
                    <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wallet className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                    <p className="text-slate-300 mb-6">Based on your GSTIN, you are eligible for a credit limit of:</p>
                    <div className="text-4xl font-bold text-green-400 mb-8">₹ 50,00,000</div>
                    <Button className="w-full bg-white text-green-900 hover:bg-green-50" onClick={reset}>
                        Apply for Credit
                    </Button>
                </CardBody>
            </Card>
        );
    }

    if (status === "rejected") {
        return (
            <Card className="w-full max-w-md mx-auto bg-slate-900 text-white border-red-900 shadow-2xl">
                <CardBody className="p-8 text-center">
                    <div className="h-16 w-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <PieChart className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-red-400">Application Under Review</h3>
                    <p className="text-slate-400 mb-8">
                        We could not instantly verify your eligibility based on the provided GSTIN. Our team will need to review your documents manually.
                    </p>
                    <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-white" onClick={reset}>
                        Try Another GSTIN
                    </Button>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-2xl">
            <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Credit Calculator</h3>
                        <div className="text-xs text-slate-400">Check eligibility instantly</div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-sm text-slate-300 mb-2 block">Business GSTIN</label>
                        <input
                            type="text"
                            placeholder="29AAAAA0000A1Z5"
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value.toUpperCase())}
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 uppercase"
                        />
                        <p className="text-xs text-slate-500 mt-1">Try "...00..." to see rejection scenario</p>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-300">Required Amount</span>
                            <span className="font-bold text-blue-400">₹ {amount.toLocaleString('en-IN')}</span>
                        </div>
                        <input
                            type="range"
                            min="100000"
                            max="5000000"
                            step="50000"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between mt-1 text-xs text-slate-500">
                            <span>₹1L</span>
                            <span>₹50L</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-300">Credit Period (Days)</span>
                            <span className="font-bold text-blue-400">{tenure} Days</span>
                        </div>
                        <div className="flex gap-2">
                            {[15, 30, 45, 60].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setTenure(d)}
                                    className={`flex-1 py-1 text-sm rounded-md border ${tenure === d ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 space-y-2 border border-slate-700/50">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Interest (@1.2%/mo)</span>
                            <span>₹ {interest.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="border-t border-slate-700 my-2 pt-2 flex justify-between font-bold text-lg">
                            <span>Total Repayment</span>
                            <span>₹ {totalRepayment.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <Button
                        className="w-full bg-white text-slate-900 hover:bg-slate-200 disabled:opacity-50"
                        onClick={handleCheck}
                        disabled={!gstin || status === "checking"}
                    >
                        {status === "checking" ? "Verifying..." : "Check Eligibility"}
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};
