"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { validateProfile } from '@/lib/profileValidation';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { AlertCircle, User, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProfileGuardProps {
    children: React.ReactNode;
    action: 'request-quotes' | 'receive-orders' | 'access-dashboard';
    fallback?: React.ReactNode;
}

export function ProfileGuard({ children, action, fallback }: ProfileGuardProps) {
    const { user, isAuthenticated } = useAuth();

    // If not authenticated, show login prompt
    if (!isAuthenticated || !user) {
        return (
            <Card className="max-w-md mx-auto">
                <CardBody className="p-8 text-center">
                    <Lock className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">Please login to access this feature.</p>
                    <Link href="/login">
                        <Button className="w-full">
                            Go to Login
                        </Button>
                    </Link>
                </CardBody>
            </Card>
        );
    }

    // Check profile completion
    const profileValidation = validateProfile(user);

    // If profile is complete, allow access
    if (profileValidation.isComplete) {
        // Additional check based on action
        if (action === 'request-quotes' && !profileValidation.canRequestQuotes) {
            return (
                <Card className="max-w-md mx-auto">
                    <CardBody className="p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
                        <p className="text-gray-600 mb-6">
                            Buyers cannot request quotes. This feature is only available for buyer accounts.
                        </p>
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardBody>
                </Card>
            );
        }

        if (action === 'receive-orders' && !profileValidation.canReceiveOrders) {
            return (
                <Card className="max-w-md mx-auto">
                    <CardBody className="p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
                        <p className="text-gray-600 mb-6">
                            Sellers cannot receive orders. This feature is only available for seller accounts.
                        </p>
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Back to Dashboard
                            </Button>
                        </Link>
                    </CardBody>
                </Card>
            );
        }

        return <>{children}</>;
    }

    // If custom fallback provided, use it
    if (fallback) {
        return <>{fallback}</>;
    }

    // Default incomplete profile message
    const getActionMessage = () => {
        switch (action) {
            case 'request-quotes':
                return 'Complete your profile to start requesting quotes from suppliers';
            case 'receive-orders':
                return 'Complete your profile to start receiving orders from buyers';
            case 'access-dashboard':
                return 'Complete your profile to access all dashboard features';
            default:
                return 'Complete your profile to access this feature';
        }
    };

    const getActionTitle = () => {
        switch (action) {
            case 'request-quotes':
                return 'Request Quotes';
            case 'receive-orders':
                return 'Receive Orders';
            case 'access-dashboard':
                return 'Access Dashboard';
            default:
                return 'Access Feature';
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardBody className="p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Incomplete</h2>
                    <p className="text-gray-600 mb-4">
                        {getActionMessage()}
                    </p>
                </div>

                {/* Missing Fields */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-orange-900 mb-3">Missing Information:</h3>
                    <ul className="space-y-2">
                        {profileValidation.missingFields.map((field, index) => (
                            <li key={index} className="flex items-center text-orange-800">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {field}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Completion Percentage */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                        <span className="text-sm font-bold text-orange-600">
                            {profileValidation.completionPercentage}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${profileValidation.completionPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/profile" className="flex-1">
                        <Button className="w-full">
                            Complete Profile
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </CardBody>
        </Card>
    );
}

export { ProfileGuard };
