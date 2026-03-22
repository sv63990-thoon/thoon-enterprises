import React from "react";
import Link from "next/link";
import { Building2, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-indigo-950 text-indigo-200/60 py-20 border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:10rem_10rem] opacity-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-black text-white tracking-widest bg-gold-gradient bg-clip-text text-transparent">THOON</span>
                        </Link>
                        <p className="text-sm font-medium leading-relaxed">
                            Revolutionizing construction procurement with smart reverse bidding and embedded finance.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-8">Platform</h3>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-wide">
                            <li><Link href="#" className="hover:text-white transition-colors">For Buyers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">For Suppliers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Reverse Bidding</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Embedded Finance</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-8">Company</h3>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-wide">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/partners" className="hover:text-white transition-colors">Partner Program</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-8">Connect</h3>
                        <div className="flex gap-6">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                                <Link key={idx} href="#" className="h-10 w-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-amber-400 hover:text-indigo-950 transition-all">
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-indigo-400/40">
                    <div>&copy; {new Date().getFullYear()} THOON ENTERPRISES. INDIA'S FUTURE BUILDER.</div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-indigo-200">Privacy Policy</Link>
                        <Link href="#" className="hover:text-indigo-200">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
