import { useState } from 'react';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

export default function ChatInput({ onSend, disabled }) {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input);
        setInput('');
    };

    return (
        <form
            className="flex gap-2 items-center bg-white border border-gray-300 rounded-xl p-1.5 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
            onSubmit={handleSubmit}
        >
            <input
                className="flex-grow px-3 py-2 bg-transparent text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={disabled}
            />
            <button
                type="submit"
                disabled={disabled || !input.trim()}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 active:scale-95 transition-all text-sm font-medium flex items-center gap-2"
            >
                <SendIcon />
            </button>
        </form>
    );
}
