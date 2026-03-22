"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowDown, Clock, CheckCircle2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const ReverseBiddingDemo = () => {
    const [bids, setBids] = useState([
        { id: 1, vendor: "SteelCo Pvt Ltd", price: 54000, time: "2m ago", status: "active" },
        { id: 2, vendor: "BuildMat Supplies", price: 53500, time: "1m ago", status: "active" },
    ]);

    const [simulationActive, setSimulationActive] = useState(false);
    const [lowestBid, setLowestBid] = useState(53500);

    useEffect(() => {
        if (!simulationActive) return;

        const interval = setInterval(() => {
            setBids((currentBids) => {
                if (currentBids.length >= 5) {
                    setSimulationActive(false); // Stop after a few bids
                    return currentBids;
                }

                const lastPrice = currentBids[currentBids.length - 1].price;
                const newPrice = lastPrice - Math.floor(Math.random() * 500 + 100);
                const newBid = {
                    id: currentBids.length + 1,
                    vendor: `Vendor ${String.fromCharCode(65 + currentBids.length)}`, // Vendor C, D, E...
                    price: newPrice,
                    time: "Just now",
                    status: "active",
                };
                setLowestBid(newPrice);
                return [...currentBids, newBid];
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [simulationActive]);

    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="border-slate-200 shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 flex justify-between items-center py-4">
                    <div>
                        <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wider">Live Request</div>
                        <h3 className="font-bold text-slate-800">500 Tons TMT Bars</h3>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-500">Current Lowest</div>
                        <div className="font-bold text-green-600 flex items-center gap-1">
                            ₹ {lowestBid.toLocaleString()}
                            <ArrowDown className="h-4 w-4" />
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="p-0">
                    <div className="max-h-[300px] overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                        {bids.slice().reverse().map((bid, index) => (
                            <div
                                key={bid.id}
                                className={cn(
                                    "flex items-center justify-between p-3 rounded-lg border transition-all duration-300",
                                    index === 0 ? "bg-white border-green-200 shadow-sm scale-[1.02]" : "bg-slate-50 border-slate-100 opacity-70"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900 text-sm">{bid.vendor}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <Clock className="h-3 w-3" /> {bid.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">₹ {bid.price.toLocaleString()}</div>
                                    <div className="text-xs text-slate-500">per ton</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-white">
                        {!simulationActive && bids.length < 5 ? (
                            <Button onClick={() => setSimulationActive(true)} className="w-full" size="sm">
                                Start Bidding Simulation
                            </Button>
                        ) : (
                            <Button disabled className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Deal Locked
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};
