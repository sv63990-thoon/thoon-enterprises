"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Building2, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { MarketTicker } from "@/components/features/MarketTicker";
import { ThoonLogo } from "@/components/brand/ThoonLogo";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    return (
        <div className="sticky top-0 z-50 w-full flex flex-col">
            {/* Top Bar for Contact & Socials */}
            <div className="w-full bg-indigo-950 text-slate-300 py-2 border-b border-indigo-900 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-400/5 blur-[100px] -left-20" />
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center text-[10px] font-bold tracking-wider relative z-10 uppercase">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-amber-400">
                            📞 +91 9791546123
                        </span>
                        <a href="mailto:contact@thoon.com" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
                            <Mail className="h-3 w-3" />
                            SUPPORT@THOON
                        </a>
                    </div>
                    <div className="flex gap-4 items-center">
                        <a href="#" className="hover:text-amber-400 transition-colors"><Facebook className="h-3 w-3" /></a>
                        <a href="#" className="hover:text-amber-400 transition-colors"><Twitter className="h-3 w-3" /></a>
                        <a href="#" className="hover:text-amber-400 transition-colors"><Instagram className="h-3 w-3" /></a>
                        <a href="#" className="hover:text-amber-400 transition-colors"><Linkedin className="h-3 w-3" /></a>
                    </div>
                </div>
            </div>

            {/* Market Ticker */}
            <MarketTicker />

            {/* Main Navbar */}
            <nav className="w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                    <ThoonLogo size="lg" variant="navbar" />
                    <div className="hidden md:flex items-center gap-8">
                        {['Buyers', 'Suppliers', 'Pricing', 'Partners', 'About Us'].map((item) => (
                            <Link
                                key={item}
                                href={item === 'About Us' ? '/about' : `/${item.toLowerCase().replace(' ', '')}`}
                                className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-900 transition-all hover:scale-105"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden lg:block text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Session</p>
                                    <p className="text-sm font-black text-indigo-950">{user?.name}</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={logout} className="border-indigo-100 text-indigo-900 hover:bg-red-50 hover:border-red-200 hover:text-red-600 font-bold uppercase text-[10px] tracking-widest">
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="hidden md:block text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-900">
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-950 hover:bg-indigo-900 text-white shadow-indigo-100 font-black uppercase text-[10px] tracking-widest px-6 h-10 inline-flex items-center justify-center rounded-lg transition-all duration-200 active:scale-95"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};
