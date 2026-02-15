import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getGoogleCalendarUrl } from '@/utils/calendarUtils';

function MessageContent({ content, metadata }) {
    const cleanContent = content.replace(/```json[\s\S]*?```/g, '').trim();

    if (!cleanContent) return null;

    return (
        <>
            <div className="prose prose-sm max-w-none text-inherit prose-p:my-1 prose-headings:my-2 prose-ul:my-2 prose-li:my-0.5">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({ node, ...props }) => <p className="leading-relaxed" {...props} />,
                        a: ({ node, ...props }) => <a className="underline font-medium hover:opacity-80 transition-opacity" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc ml-4 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal ml-4 space-y-1" {...props} />,
                    }}
                >
                    {cleanContent}
                </ReactMarkdown>
            </div>

            {metadata?.appointmentId && metadata?.details && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <a
                        href={getGoogleCalendarUrl({
                            title: `Appointment with ${metadata.details.name || 'Guest'}`,
                            description: metadata.details.reason || '',
                            startTime: `${metadata.details.date}T${String(metadata.details.time).slice(0, 5)}:00`,
                            endTime: new Date(new Date(`${metadata.details.date}T${String(metadata.details.time).slice(0, 5)}:00`).getTime() + 60 * 60 * 1000),
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                            <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Add to Google Calendar
                    </a>
                </div>
            )}
        </>
    );
}

export default function MessageList({ messages }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-50 to-white p-6 pb-20">
            <div className="flex flex-col gap-4 min-h-full">
                {messages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center max-w-md">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                                💬
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">New Booking</h3>
                            <p className="text-sm text-slate-500">
                                Send a message to start scheduling your appointment.
                            </p>
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isUser = msg.sender_type === 'user';

                    return (
                        <div
                            key={index}
                            className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ${isUser
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-white'
                                    }`}>
                                    {isUser ? 'Me' : 'Asst'}
                                </div>

                                {/* Message Bubble */}
                                <div
                                    className={`px-4 py-3 rounded-2xl shadow-sm ${isUser
                                        ? 'bg-blue-600 text-white rounded-br-md'
                                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                                        }`}
                                >
                                    <MessageContent content={msg.content} metadata={msg.metadata} />

                                    <div className={`text-[10px] mt-1 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
