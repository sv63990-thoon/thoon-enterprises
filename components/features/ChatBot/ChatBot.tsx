'use client';

import React, { useState } from 'react';
import { ChatWidget } from './ChatWidget';
import { ChatWindow } from './ChatWindow';

export const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {isOpen && <ChatWindow />}
            <ChatWidget isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        </>
    );
};
