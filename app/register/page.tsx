"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ArrowLeft, Building2, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    const [formData, setFormData] = useState({
        // Account Details
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        
        // Business Details (Common for both roles)
        companyName: '',
        gstNumber: '',
        businessAddress: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        
        // Role Selection
        role: 'buyer' as 'buyer' | 'seller',
        
        // Seller-specific fields
        materialCategories: [] as string[],
        deliveryAreas: '',
        businessType: '',
        yearsInBusiness: '',
        warehouseLocation: '',
        
        // Buyer-specific fields
        projectType: '',
        estimatedMaterialRequirement: '',
        projectLocation: '',
        constructionStage: ''
    });

    const { login } = useAuth();
    const router = useRouter();

    // GST Validation
    const validateGSTNumber = (gst: string): boolean => {
        // Indian GST format: 2 digits + [A-Z] + 4 digits + [A-Z] + [A-Z0-9] + 1 digit + [A-Z0-9] + 1 digit
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst.toUpperCase());
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Account Details Validation
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email address is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        // Business Details Validation
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.gstNumber.trim()) {
            newErrors.gstNumber = 'GST number is required';
        } else if (!validateGSTNumber(formData.gstNumber)) {
            newErrors.gstNumber = 'Please enter a valid GST number';
        }
        if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

        // Role-specific Validation
        if (formData.role === 'seller') {
            if (!formData.materialCategories.length) newErrors.materialCategories = 'At least one material category is required';
            if (!formData.deliveryAreas.trim()) newErrors.deliveryAreas = 'Delivery areas are required';
            if (!formData.businessType.trim()) newErrors.businessType = 'Business type is required';
            if (!formData.yearsInBusiness.trim()) newErrors.yearsInBusiness = 'Years in business is required';
            if (!formData.warehouseLocation.trim()) newErrors.warehouseLocation = 'Warehouse location is required';
        } else if (formData.role === 'buyer') {
            if (!formData.projectType.trim()) newErrors.projectType = 'Project type is required';
            if (!formData.estimatedMaterialRequirement.trim()) newErrors.estimatedMaterialRequirement = 'Estimated material requirement is required';
            if (!formData.projectLocation.trim()) newErrors.projectLocation = 'Project location is required';
            if (!formData.constructionStage.trim()) newErrors.constructionStage = 'Construction stage is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Show success message and redirect to login
            alert('Registration successful! Your account is pending approval. You will receive an email once your account is activated.');
            router.push('/login');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const materialCategories = [
        'Cement', 'Steel', 'Bricks', 'Sand', 'Aggregate', 'Tiles', 
        'Paint', 'Electrical', 'Plumbing', 'Wood', 'Glass', 'Hardware'
    ];

    const businessTypes = [
        'Dealer', 'Distributor', 'Manufacturer'
    ];

    const projectTypes = [
        'Residential', 'Commercial', 'Infrastructure'
    ];

    const constructionStages = [
        'Planning', 'Foundation', 'Structure', 'Finishing', 'Renovation'
    ];

    return (
        <div className="min-h-screen bg-indigo-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px]" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 text-white group">
                    <ArrowLeft className="h-4 w-4 text-white/40 group-hover:text-amber-400 transition-colors" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-amber-400">Back to Home</span>
                </Link>

                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 backdrop-blur-sm shadow-2xl">
                        <Building2 className="h-10 w-10" />
                    </div>
                </div>
                <h2 className="text-center text-4xl font-black text-white uppercase tracking-tighter">
                    Join <span className="text-amber-400">Thoon</span>
                </h2>
                <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Revolutionize <span className="text-white/60">Construction Procurement</span>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
                <Card className="border-white/10 bg-white shadow-2xl rounded-3xl overflow-hidden">
                    <CardBody className="p-8">
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            {/* Role Selection */}
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'buyer' })}
                                    className={`flex-1 py-3 text-sm font-medium rounded-md transition-all ${formData.role === 'buyer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    I am a Buyer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                                    className={`flex-1 py-3 text-sm font-medium rounded-md transition-all ${formData.role === 'seller' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    I am a Seller
                                </button>
                            </div>

                            {/* Section 1 — Account Details */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                                    Account Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.name ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.email ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                                        <div className="relative mt-1">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.password ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password *</label>
                                        <div className="relative mt-1">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                required
                                                className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2 — Business Details */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                                    Business Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Company / Business Name *</label>
                                        <input
                                            type="text"
                                            required
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.companyName ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.companyName}
                                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        />
                                        {errors.companyName && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.companyName}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">GST Number *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g., 22AAAAA0000A1Z5"
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.gstNumber ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.gstNumber}
                                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                                        />
                                        {errors.gstNumber && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.gstNumber}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            required
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.phone ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                                        <input
                                            type="text"
                                            required
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.city ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                                        <input
                                            type="text"
                                            required
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.state ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        />
                                        {errors.state && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.state}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Pincode *</label>
                                        <input
                                            type="text"
                                            required
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.pincode ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        />
                                        {errors.pincode && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.pincode}
                                            </p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Business Address *</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.businessAddress ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.businessAddress}
                                            onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                                        />
                                        {errors.businessAddress && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.businessAddress}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                                        <input
                                            type="text"
                                            required
                                            className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                errors.state ? 'border-red-500' : 'border-slate-300'
                                            }`}
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        />
                                        {errors.state && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.state}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section 3 — Role-Specific Information */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                                    {formData.role === 'buyer' ? 'Buyer Information' : 'Seller Information'}
                                </h3>
                                
                                {formData.role === 'seller' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Material Categories *</label>
                                            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-3 bg-slate-50">
                                                {materialCategories.map((category) => (
                                                    <label key={category} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-100 p-1 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.materialCategories.includes(category)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        materialCategories: [...formData.materialCategories, category]
                                                                    });
                                                                } else {
                                                                    setFormData({
                                                                        ...formData,
                                                                        materialCategories: formData.materialCategories.filter(c => c !== category)
                                                                    });
                                                                }
                                                            }}
                                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm">{category}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.materialCategories && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.materialCategories}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Areas *</label>
                                            <textarea
                                                required
                                                rows={3}
                                                className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.deliveryAreas ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.deliveryAreas}
                                                onChange={(e) => setFormData({ ...formData, deliveryAreas: e.target.value })}
                                                placeholder="e.g., Chennai, Delhi, NCR, Mumbai, Pune"
                                            />
                                            {errors.deliveryAreas && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.deliveryAreas}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Business Type *</label>
                                            <select
                                                required
                                                className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.businessType ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.businessType}
                                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                            >
                                                <option value="">Select business type</option>
                                                {businessTypes.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            {errors.businessType && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.businessType}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Years in Business *</label>
                                            <input
                                                type="number"
                                                required
                                                className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.yearsInBusiness ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.yearsInBusiness}
                                                onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                                                placeholder="e.g., 5"
                                            />
                                            {errors.yearsInBusiness && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.yearsInBusiness}
                                                </p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Warehouse / Store Location *</label>
                                            <textarea
                                                required
                                                rows={2}
                                                className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.warehouseLocation ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.warehouseLocation}
                                                onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
                                                placeholder="e.g., Industrial Area, Phase 1, Chennai"
                                            />
                                            {errors.warehouseLocation && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.warehouseLocation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Project Type *</label>
                                            <select
                                                required
                                                className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.projectType ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.projectType}
                                                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                            >
                                                <option value="">Select project type</option>
                                                {projectTypes.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            {errors.projectType && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.projectType}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Material Requirement *</label>
                                            <textarea
                                                required
                                                rows={3}
                                                className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.estimatedMaterialRequirement ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.estimatedMaterialRequirement}
                                                onChange={(e) => setFormData({ ...formData, estimatedMaterialRequirement: e.target.value })}
                                                placeholder="e.g., 100 tons of cement, 50 tons of steel per month"
                                            />
                                            {errors.estimatedMaterialRequirement && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.estimatedMaterialRequirement}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Project Location *</label>
                                            <input
                                                type="text"
                                                required
                                                className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.projectLocation ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.projectLocation}
                                                onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                                                placeholder="e.g., Chennai, Banglore"
                                            />
                                            {errors.projectLocation && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.projectLocation}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Construction Stage *</label>
                                            <select
                                                required
                                                className={`appearance-none block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    errors.constructionStage ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                                value={formData.constructionStage}
                                                onChange={(e) => setFormData({ ...formData, constructionStage: e.target.value })}
                                            >
                                                <option value="">Select construction stage</option>
                                                {constructionStages.map((stage) => (
                                                    <option key={stage} value={stage}>{stage}</option>
                                                ))}
                                            </select>
                                            {errors.constructionStage && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.constructionStage}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button type="submit" className="w-full h-14 bg-[#caa75e] hover:bg-[#b89653] text-white border-none shadow-[0_8px_24px_rgba(202,167,94,0.3)] rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all hover:-translate-y-0.5 active:scale-95" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Creating {formData.role === 'buyer' ? 'Buyer' : 'Seller'} Account...
                                    </>
                                ) : `Create ${formData.role === 'buyer' ? 'Buyer' : 'Seller'} Account`}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
