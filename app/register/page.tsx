"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ArrowLeft, Building2, Loader2, AlertCircle, User, Briefcase, Phone, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 2;
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpVerified, setOtpVerified] = useState(false);
    
    const [otpSessionId, setOtpSessionId] = useState('');
    
    const [formData, setFormData] = useState({
        // Basic Details
        name: '',
        email: '',
        phone: '',
        
        // Role Selection
        role: 'buyer' as 'buyer' | 'seller'
    });

    const { login } = useAuth();
    const router = useRouter();

    const validateCurrentStep = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (currentStep === 1) {
            // Role selection only
            if (!formData.role) newErrors.role = 'Please select a role';
        } else if (currentStep === 2) {
            // Basic Details
            if (!formData.name.trim()) newErrors.name = 'Full name is required';
            if (!formData.email.trim()) newErrors.email = 'Email address is required';
            if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (formData.email && !emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
            
            // Phone validation (10 digits)
            const phoneRegex = /^[0-9]{10}$/;
            if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
                newErrors.phone = 'Please enter a valid 10-digit phone number';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendOtp = async () => {
        if (!validateCurrentStep()) return;
        
        setLoading(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobileNumber: formData.phone })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            setOtpSent(true);
            setOtpSessionId(data.sessionId);
            setErrors({});
            
            // Show OTP in development mode
            if (data.otp) {
                alert(`OTP sent! For demo: ${data.otp}`);
            } else {
                alert('OTP sent successfully!');
            }
        } catch (error: any) {
            alert(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setErrors({ otp: 'Please enter a valid 6-digit OTP' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    sessionId: otpSessionId, 
                    otp: otpValue,
                    name: formData.name
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'OTP verification failed');
            }

            setOtpVerified(true);
            
            // Now complete the registration with additional details
            await completeRegistration();
        } catch (error: any) {
            setErrors({ otp: error.message || 'OTP verification failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const completeRegistration = async () => {
        try {
            const res = await fetch('/api/auth/register-simple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            alert('Registration successful! Your account has been created and is pending approval.');
            router.push('/login');
        } catch (err: any) {
            alert(err.message || 'Registration failed. Please try again.');
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) (nextInput as HTMLInputElement).focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) (prevInput as HTMLInputElement).focus();
        }
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                setCurrentStep(currentStep + 1);
                setErrors({});
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
            setOtpSent(false);
            setOtp(['', '', '', '', '', '']);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpSent) {
            await sendOtp();
        } else {
            await verifyOtp();
        }
    };

    const renderStepIndicator = () => (
        <div className="flex justify-between items-center mb-8">
            {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        step <= currentStep 
                            ? 'bg-[#caa75e] text-white' 
                            : 'bg-gray-200 text-gray-500'
                    }`}>
                        {step < currentStep ? '✓' : step}
                    </div>
                    {step < 2 && (
                        <div className={`flex-1 h-1 mx-2 transition-all ${
                            step < currentStep ? 'bg-[#caa75e]' : 'bg-gray-200'
                        }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 text-center">Choose Your Role</h3>
            <p className="text-gray-600 text-center text-sm">How do you want to use Thoon?</p>
            
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'buyer' })}
                    className={`w-full p-6 rounded-2xl border-2 transition-all ${
                        formData.role === 'buyer' 
                            ? 'border-[#caa75e] bg-[#caa75e]/5 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            formData.role === 'buyer' ? 'bg-[#caa75e] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                            <User className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-900">I'm a Buyer</h4>
                            <p className="text-sm text-gray-600">Purchase construction materials</p>
                        </div>
                    </div>
                </button>
                
                <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                    className={`w-full p-6 rounded-2xl border-2 transition-all ${
                        formData.role === 'seller' 
                            ? 'border-[#caa75e] bg-[#caa75e]/5 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            formData.role === 'seller' ? 'bg-[#caa75e] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-900">I'm a Seller</h4>
                            <p className="text-sm text-gray-600">Supply construction materials</p>
                        </div>
                    </div>
                </button>
            </div>
            {errors.role && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.role}
                </p>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            {!otpSent ? (
                <>
                    <h3 className="text-xl font-bold text-gray-900 text-center">Basic Details</h3>
                    <p className="text-gray-600 text-center text-sm">Enter your information to continue</p>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa75e] focus:border-transparent ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa75e] focus:border-transparent ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#caa75e] focus:border-transparent ${
                                        errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter 10-digit mobile number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    maxLength={10}
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-bold text-gray-900 text-center">Verify OTP</h3>
                    <p className="text-gray-600 text-center text-sm">
                        We've sent a 6-digit OTP to {formData.phone}
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caa75e] focus:border-transparent ${
                                        errors.otp ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                />
                            ))}
                        </div>
                        
                        {errors.otp && (
                            <p className="text-sm text-red-600 flex items-center justify-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.otp}
                            </p>
                        )}
                        
                        <div className="text-center">
                            <button
                                type="button"
                                className="text-sm text-[#caa75e] hover:text-[#b89653] font-medium"
                                onClick={() => {
                                    setOtpSent(false);
                                    setOtp(['', '', '', '', '', '']);
                                    setOtpSessionId('');
                                }}
                            >
                                Change phone number
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep2();
            default: return renderStep1();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-md mx-auto px-4 py-4">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#caa75e] transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto px-4 py-8">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#caa75e] to-[#b89653] rounded-2xl shadow-lg mb-4">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Join <span className="text-[#caa75e]">Thoon</span>
                    </h1>
                    <p className="text-sm text-gray-600">
                        Revolutionize Construction Procurement
                    </p>
                </div>

                {/* Progress Card */}
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                    <CardBody className="p-6">
                        {renderStepIndicator()}
                        {renderCurrentStep()}
                        
                        {/* Navigation Buttons */}
                        <div className="flex gap-3 mt-8">
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevious}
                                    className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Previous
                                </Button>
                            )}
                            
                            {currentStep < totalSteps ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 py-3 bg-[#caa75e] hover:bg-[#b89653] text-white font-medium"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-[#caa75e] hover:bg-[#b89653] text-white font-medium"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {!otpSent ? 'Sending OTP...' : 'Verifying...'}
                                        </>
                                    ) : (
                                        !otpSent ? 'Send OTP' : 'Verify & Register'
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#caa75e] hover:text-[#b89653] font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
