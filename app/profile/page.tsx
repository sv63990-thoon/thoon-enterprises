"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
    Building2, 
    FileText, 
    MapPin, 
    Phone, 
    Mail, 
    CheckCircle, 
    AlertCircle,
    User,
    Briefcase,
    Clock,
    Star
} from "lucide-react";
import { validateProfile, getProfileCompletionSteps } from "@/lib/profileValidation";

export default function ProfilePage() {
    const { user, isAuthenticated, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [profileData, setProfileData] = useState({
        companyName: '',
        gstin: '',
        address: '',
        phone: '',
        experienceYears: 0,
        businessType: '',
        annualRevenue: '',
        categories: [] as string[]
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                companyName: user.companyName || '',
                gstin: user.gstin || '',
                address: user.address || '',
                phone: user.phone || '',
                experienceYears: user.experienceYears || 0,
                businessType: user.businessType || '',
                annualRevenue: user.annualRevenue || '',
                categories: user.categories || []
            });
        }
    }, [user]);

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <Card className="max-w-md w-full">
                    <CardBody className="p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
                        <p className="text-slate-600 mb-6">Please login to access your profile.</p>
                        <Button onClick={() => window.location.href = '/login'} className="w-full">
                            Go to Login
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const profileValidation = validateProfile(user);
    const completionSteps = getProfileCompletionSteps(user);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/auth/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (response.ok) {
                updateUser(data.user);
                setMessage('Profile updated successfully!');
                
                // Update local user data
                const updatedUser = { ...user, ...data.user };
                const newValidation = validateProfile(updatedUser);
                
                if (newValidation.isComplete) {
                    setTimeout(() => {
                        setMessage('🎉 Profile is now complete! You can access all features.');
                    }, 1000);
                }
            } else {
                setMessage(data.error || 'Failed to update profile');
            }
        } catch (error: any) {
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
                    <p className="text-slate-600">
                        {user.role === 'buyer' 
                            ? 'Complete your profile to start requesting quotes from suppliers'
                            : 'Complete your profile to start receiving orders from buyers'
                        }
                    </p>
                </div>

                {/* Profile Completion Status */}
                <Card className="mb-8">
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Profile Completion</h3>
                            <span className={`text-2xl font-bold ${
                                profileValidation.completionPercentage === 100 ? 'text-green-600' : 'text-orange-600'
                            }`}>
                                {profileValidation.completionPercentage}%
                            </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                            <div 
                                className={`h-3 rounded-full transition-all duration-500 ${
                                    profileValidation.completionPercentage === 100 ? 'bg-green-600' : 'bg-orange-600'
                                }`}
                                style={{ width: `${profileValidation.completionPercentage}%` }}
                            ></div>
                        </div>

                        {/* Completion Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {completionSteps.map((step, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className={`mt-1 ${
                                        step.completed ? 'text-green-600' : 
                                        step.priority === 'high' ? 'text-red-600' : 'text-orange-600'
                                    }`}>
                                        {step.completed ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900">{step.title}</p>
                                        <p className="text-sm text-slate-600">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {profileValidation.isComplete && (
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="text-green-800 font-medium">
                                        Profile Complete! You can now {
                                            user.role === 'buyer' ? 'request quotes' : 'receive orders'
                                        }.
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Profile Form */}
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-semibold text-slate-900">Profile Information</h3>
                        <p className="text-slate-600">Please fill in all required information</p>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleSaveProfile} className="space-y-6">
                            {/* Company Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-slate-900 flex items-center">
                                    <Building2 className="w-5 h-5 mr-2" />
                                    Company Information
                                </h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.companyName}
                                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                                        placeholder="Enter your company name"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        GST Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={profileData.gstin}
                                        onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                                        placeholder="Enter GST number (e.g., 27ABCDE1234F2Z5)"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Format: 27ABCDE1234F2Z5
                                    </p>
                                </div>

                                {user.role === 'buyer' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Business Type
                                        </label>
                                        <select
                                            value={profileData.businessType}
                                            onChange={(e) => handleInputChange('businessType', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select business type</option>
                                            <option value="proprietorship">Proprietorship</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="llp">LLP</option>
                                            <option value="pvt-ltd">Private Limited</option>
                                            <option value="public-ltd">Public Limited</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-slate-900 flex items-center">
                                    <Phone className="w-5 h-5 mr-2" />
                                    Contact Information
                                </h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="Enter 10-digit phone number"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        pattern="[6-9]{1}[0-9]{9}"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-medium text-slate-900 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Registered Office Address *
                                </h4>
                                
                                <textarea
                                    value={profileData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    placeholder="Enter your complete registered office address"
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Seller Specific Fields */}
                            {user.role === 'seller' && (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-slate-900 flex items-center">
                                        <Briefcase className="w-5 h-5 mr-2" />
                                        Professional Information
                                    </h4>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Years of Experience *
                                        </label>
                                        <input
                                            type="number"
                                            value={profileData.experienceYears}
                                            onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                                            placeholder="Enter years of experience"
                                            min="0"
                                            max="50"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Annual Revenue (Optional)
                                        </label>
                                        <select
                                            value={profileData.annualRevenue}
                                            onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select revenue range</option>
                                            <option value="0-1cr">Up to ₹1 Crore</option>
                                            <option value="1-5cr">₹1-5 Crore</option>
                                            <option value="5-10cr">₹5-10 Crore</option>
                                            <option value="10-50cr">₹10-50 Crore</option>
                                            <option value="50cr+">Above ₹50 Crore</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="min-w-[120px]"
                                >
                                    {loading ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        </form>

                        {/* Message Display */}
                        {message && (
                            <div className={`mt-6 p-4 rounded-lg text-sm ${
                                message.includes('success') || message.includes('🎉')
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                                {message}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
