import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface ChatWidgetProps {
    isOpen: boolean;
    onClick: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-red-500 rotate-90' : 'bg-black rotate-0'
                }`}
            aria-label="Toggle chat"
        >
            {isOpen ? (
                <X className="h-6 w-6 text-white" />
            ) : (
                <MessageCircle className="h-6 w-6 text-white" />
            )}
        </button>
    );
};
