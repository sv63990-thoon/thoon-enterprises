'use client';

import React, { useState } from 'react';

export default function TestDeploymentPage() {
    const [testResult, setTestResult] = useState<string>('');

    const testLogin = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'thoon_admin@org.in',
                    password: 'Thoon@2026'
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setTestResult(`✅ Login Successful! User: ${data.name} (${data.role})`);
            } else {
                setTestResult(`❌ Login Failed: ${data.error}`);
            }
        } catch (error: any) {
            setTestResult(`❌ Network Error: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Deployment Test Page
                    </h1>
                    
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h2 className="text-lg font-semibold text-blue-900 mb-2">
                                Test Information
                            </h2>
                            <div className="text-sm text-blue-800 space-y-1">
                                <p><strong>Admin Email:</strong> thoon_admin@org.in</p>
                                <p><strong>Admin Password:</strong> Thoon@2026</p>
                                <p><strong>Deployment Status:</strong> Testing...</p>
                            </div>
                        </div>

                        <button
                            onClick={testLogin}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Test Admin Login
                        </button>

                        {testResult && (
                            <div className={`p-4 rounded-lg border ${
                                testResult.includes('✅') 
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                                <pre className="whitespace-pre-wrap text-sm">
                                    {testResult}
                                </pre>
                            </div>
                        )}

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Next Steps:
                            </h3>
                            <ul className="text-sm text-gray-700 space-y-1">
                                <li>1. If login works → Admin access is ready</li>
                                <li>2. Try main login: <a href="/login" className="text-blue-600 hover:underline">/login</a></li>
                                <li>3. Access admin panel: <a href="/admin" className="text-blue-600 hover:underline">/admin</a></li>
                                <li>4. Configure custom domain: thoonenterprises.in</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
