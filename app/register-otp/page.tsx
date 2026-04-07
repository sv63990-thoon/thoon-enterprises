"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ArrowLeft, Phone, Mail, Lock, User, CheckCircle, ShoppingCart, Package } from "lucide-react";

export default function RegisterOTPPage() {
    const [step, setStep] = useState<'mobile' | 'otp' | 'role'>('mobile');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');
    const [sessionId, setSessionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    
    const router = useRouter();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobileNumber })
            });

            const data = await response.json();

            if (response.ok) {
                setSessionId(data.sessionId);
                setStep('otp');
                setMessage('OTP sent successfully!');
                
                // Show OTP in development
                if (data.otp) {
                    setShowOTP(true);
                    setMessage(`OTP sent successfully! Development OTP: ${data.otp}`);
                }
            } else {
                setMessage(data.error || 'Failed to send OTP');
            }
        } catch (error: any) {
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, otp, name })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                
                // Store user info and redirect
                localStorage.setItem('user', JSON.stringify(data.user));
                
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        router.push('/admin');
                    } else if (data.user.role === 'buyer') {
                        router.push('/buyers');
                    } else if (data.user.role === 'seller') {
                        router.push('/suppliers');
                    } else {
                        router.push('/');
                    }
                }, 1500);
            } else {
                setMessage(data.error || 'Invalid OTP');
            }
        } catch (error: any) {
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <Card className="shadow-xl">
                    <CardBody className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                {step === 'mobile' ? (
                                    <Phone className="w-8 h-8 text-blue-600" />
                                ) : (
                                    <Lock className="w-8 h-8 text-blue-600" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {step === 'mobile' ? 'Enter Mobile Number' : 'Enter OTP'}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {step === 'mobile' 
                                    ? 'We\'ll send you a verification code'
                                    : 'Enter the 6-digit code sent to your mobile'
                                }
                            </p>
                        </div>

                        {/* Step 1: Mobile Number */}
                        {step === 'mobile' && (
                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            placeholder="Enter 10-digit mobile number"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            maxLength={10}
                                            pattern="[6-9]{1}[0-9]{9}"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter Indian mobile number (10 digits)
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading || mobileNumber.length !== 10}
                                    className="w-full"
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </Button>
                            </form>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        OTP Code
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    {showOTP && (
                                        <p className="text-xs text-green-600 mt-1 font-semibold">
                                            Development Mode: OTP is {otp || 'shown above'}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="w-full"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Register'}
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('mobile');
                                        setOtp('');
                                        setName('');
                                        setMessage('');
                                    }}
                                    className="w-full text-sm text-blue-600 hover:text-blue-800"
                                >
                                    ← Back to mobile number
                                </button>
                            </form>
                        )}

                        {/* Message Display */}
                        {message && (
                            <div className={`mt-4 p-3 rounded-lg text-sm ${
                                message.includes('success') || message.includes('OTP sent')
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                                {message}
                            </div>
                        )}

                        {/* Success State */}
                        {message.includes('successful') && step === 'otp' && (
                            <div className="mt-4 text-center">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                                <p className="text-green-700 font-medium">Redirecting to dashboard...</p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Sign In
                                </Link>
                            </p>
                        </div>

                        {/* Back to Home */}
                        <div className="mt-4 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Home
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
