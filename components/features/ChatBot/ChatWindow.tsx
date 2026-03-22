'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronLeft, Bot, User, Mail } from 'lucide-react';

type ViewState = 'menu' | 'faq' | 'form' | 'success';

interface Message {
    id: string;
    type: 'bot' | 'user';
    text: string;
}

const FAQ_DATA = [
    {
        id: 'services',
        question: 'What services do you offer?',
        answer: 'We provide enterprise-grade construction material procurement, logistics optimization, and financing solutions.'
    },
    {
        id: 'pricing',
        question: 'How does pricing work?',
        answer: 'Our pricing is dynamic based on volume and location. Please submit a detailed requirement list for a custom quote.'
    },
    {
        id: 'support',
        question: 'How can I contact support?',
        answer: 'You can reach us at support@thoon.com or submit an inquiry through this chat.'
    }
];

export const ChatWindow: React.FC = () => {
    const [view, setView] = useState<ViewState>('menu');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', type: 'bot', text: 'Hello! How can I help you today?' }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, view]);

    const handleFAQClick = (faq: typeof FAQ_DATA[0]) => {
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'user', text: faq.question },
            { id: (Date.now() + 1).toString(), type: 'bot', text: faq.answer }
        ]);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setView('success');
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error submitting form.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                    {view !== 'menu' && view !== 'success' && (
                        <button onClick={() => setView('menu')} className="mr-1 hover:text-gray-300">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}
                    <Bot className="h-6 w-6" />
                    <div>
                        <h3 className="text-sm font-semibold">Thoon Assistant</h3>
                        <p className="text-xs text-green-400">Online</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {view === 'menu' && (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.type === 'user'
                                            ? 'bg-black text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div className="mt-6 grid gap-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Suggested Topics</p>
                            {FAQ_DATA.map((faq) => (
                                <button
                                    key={faq.id}
                                    onClick={() => handleFAQClick(faq)}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300"
                                >
                                    {faq.question}
                                </button>
                            ))}
                            <button
                                onClick={() => setView('form')}
                                className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 flex items-center justify-center gap-2"
                            >
                                <Mail className="h-4 w-4" />
                                Contact Support
                            </button>
                        </div>
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {view === 'form' && (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="text-center mb-6">
                            <h4 className="text-lg font-semibold text-gray-900">Contact Support</h4>
                            <p className="text-xs text-gray-500">We'll get back to you via email shortly.</p>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">Name</label>
                            <input
                                name="name"
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                                placeholder="How can we help?"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}

                {view === 'success' && (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="mb-4 rounded-full bg-green-100 p-3">
                            <Send className="h-8 w-8 text-green-600" />
                        </div>
                        <h4 className="mb-2 text-lg font-semibold text-gray-900">Message Sent!</h4>
                        <p className="mb-6 text-sm text-gray-600">
                            Thank you for reaching out. Our team will get back to you at your provided email address.
                        </p>
                        <button
                            onClick={() => {
                                setView('menu');
                                setMessages([{ id: '1', type: 'bot', text: 'Hello! How can I help you today?' }]);
                            }}
                            className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Back to Chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
