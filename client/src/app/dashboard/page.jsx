'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import AppointmentRow from '@/components/booking/AppointmentRow';
import AppointmentModal from '@/components/booking/AppointmentModal';
import DeleteConfirmationModal from '@/components/booking/DeleteConfirmationModal';

// Icons
const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
);

export default function DashboardPage() {
    const { user, logout, loading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();

    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeNav, setActiveNav] = useState('home');
    const [appointments, setAppointments] = useState([]);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchInitialData();
        }
    }, [user]);

    useEffect(() => {
        let interval;
        if (activeSession && activeNav === 'chat') {
            loadMessages(activeSession.id);
            interval = setInterval(() => loadMessages(activeSession.id), 10000);
        }
        return () => clearInterval(interval);
    }, [activeSession, activeNav]);

    const fetchInitialData = async () => {
        try {
            const [sessionsData, appointmentsData] = await Promise.all([
                api.get('/chat/sessions'),
                api.get('/appointments')
            ]);
            setSessions(sessionsData);
            setAppointments(appointmentsData);
            if (sessionsData.length > 0 && !activeSession) {
                setActiveSession(sessionsData[0]);
            }
        } catch (err) {
            showToast('Failed to sync dashboard data', 'error');
        }
    };

    const loadSessions = async () => {
        try {
            const data = await api.get('/chat/sessions');
            setSessions(data);
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const loadAppointments = async () => {
        try {
            const data = await api.get('/appointments');
            setAppointments(data);
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const createSession = async () => {
        try {
            const newSession = await api.post('/chat/sessions', {});
            setSessions([newSession, ...sessions]);
            setActiveSession(newSession);
            setActiveNav('chat');
            showToast('New conversation started', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const loadMessages = async (sessionId) => {
        try {
            const data = await api.get(`/chat/sessions/${sessionId}/messages`);
            setMessages(data);
        } catch (err) {
            console.error('Polling error:', err);
        }
    };

    const sendMessage = async (content) => {
        if (!activeSession) return;

        const optimisticMsg = { sender_type: 'user', content, created_at: new Date().toISOString() };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            await api.post('/chat/messages', {
                sessionId: activeSession.id,
                content
            });
            await loadMessages(activeSession.id);
            loadAppointments();
        } catch (err) {
            setMessages(prev => prev.slice(0, -1));
            showToast(err.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/appointments/${id}`);
            setAppointments(prev => prev.filter(app => app.id !== id));
            showToast('Appointment removed', 'success');
            setAppointmentToDelete(null);
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleDeleteSession = async (e, sessionId) => {
        e.stopPropagation();
        try {
            await api.delete(`/chat/sessions/${sessionId}`);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            if (activeSession?.id === sessionId) {
                setActiveSession(null);
                setMessages([]);
            }
            showToast('Chat deleted', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const updated = await api.patch(`/appointments/${formData.id}`, formData);
            setAppointments(prev => prev.map(app => app.id === updated.id ? updated : app));
            showToast('Changes saved', 'success');
            setEditingAppointment(null);
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const updated = await api.patch(`/appointments/${id}`, { status });
            setAppointments(prev => prev.map(app => app.id === id ? updated : app));
            showToast(`Status updated to ${status}`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-400">
                Syncing...
            </div>
        );
    }

    const renderHeader = (title, subtitle, action) => (
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-gray-500">{subtitle}</p>
            </div>
            {action}
        </div>
    );

    const renderContent = () => {
        switch (activeNav) {
            case 'home':
                return (
                    <div className="p-8 max-w-6xl mx-auto w-full">
                        {renderHeader(`Welcome, ${user?.fullName?.split(' ')[0] || 'User'}`, "Manage your bookings and schedule.")}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                { label: 'Total Bookings', value: appointments.length, color: 'text-gray-900' },
                                { label: 'Upcoming', value: appointments.filter(a => new Date(a.start_time) > new Date()).length, color: 'text-blue-600' },
                                { label: 'This Month', value: appointments.filter(a => new Date(a.start_time).getMonth() === new Date().getMonth()).length, color: 'text-purple-600' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900">Next Appointments</h3>
                                <button onClick={() => setActiveNav('chat')} className="text-sm font-medium text-blue-600 hover:text-blue-700">Quick Book +</button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {appointments.slice(0, 5).length > 0 ? (
                                    appointments.slice(0, 5).map(app => (
                                        <div key={app.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <CalendarIcon />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{app.title}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(app.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 capitalize">
                                                {app.status}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500">No data available</div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'chat':
                return (
                    <div className="flex-1 flex overflow-hidden">
                        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conversations</h2>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                {sessions.map(session => (
                                    <div key={session.id} className="relative group">
                                        <button
                                            onClick={() => setActiveSession(session)}
                                            className={`w-full text-left p-4 rounded-xl transition-all ${activeSession?.id === session.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}
                                        >
                                            <p className="text-sm font-semibold text-gray-900 truncate pr-6">{session.title || 'New Booking'}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(session.created_at).toLocaleDateString()}</p>
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteSession(e, session.id)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            title="Delete chat"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col bg-white">
                            {activeSession ? (
                                <>
                                    <div className="flex-1 overflow-hidden">
                                        <MessageList messages={messages} />
                                    </div>
                                    <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                                        <div className="max-w-4xl mx-auto">
                                            <ChatInput onSend={sendMessage} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation to begin</div>
                            )}
                        </div>
                    </div>
                );
            case 'history':
                return (
                    <div className="p-8 max-w-6xl mx-auto w-full">
                        {renderHeader("Appointment Log", "View and manage all records.")}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        {['Appointment', 'Date & Time', 'Status', ''].map((h, i) => (
                                            <th key={i} className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {appointments.map(app => (
                                        <AppointmentRow
                                            key={app.id}
                                            app={app}
                                            onEdit={setEditingAppointment}
                                            onDelete={setAppointmentToDelete}
                                            onStatusUpdate={handleStatusUpdate}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="p-8 max-w-3xl mx-auto w-full">
                        {renderHeader("Configuration", "Handle your preferences.")}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            {[
                                { label: 'Full Name', value: user?.fullName },
                                { label: 'Email Address', value: user?.email }
                            ].map((field, i) => (
                                <div key={i}>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{field.label}</label>
                                    <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 font-medium">{field.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">SB</div>
                        <span className="font-bold text-gray-900">SmartBook</span>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1">
                    {[
                        { id: 'home', label: 'Home', icon: <HomeIcon /> },
                        { id: 'chat', label: 'Bookings', icon: <CalendarIcon /> },
                        { id: 'history', label: 'History', icon: <ClockIcon /> },
                        { id: 'settings', label: 'Settings', icon: <SettingsIcon /> }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeNav === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
                        <LogoutIcon />
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                {activeNav === 'chat' && (
                    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Booking Assistant</h1>
                        </div>
                        <button onClick={createSession} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-xs">
                            <PlusIcon />
                            New Request
                        </button>
                    </header>
                )}
                <div className={`flex-1 flex flex-col overflow-hidden ${activeNav !== 'chat' ? 'overflow-y-auto custom-scrollbar' : ''}`}>
                    {renderContent()}
                </div>
            </main>

            {editingAppointment && (
                <AppointmentModal
                    appointment={editingAppointment}
                    onClose={() => setEditingAppointment(null)}
                    onSave={handleUpdate}
                />
            )}
            {appointmentToDelete && (
                <DeleteConfirmationModal
                    appointment={appointmentToDelete}
                    onClose={() => setAppointmentToDelete(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
