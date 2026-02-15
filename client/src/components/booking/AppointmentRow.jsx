import React from 'react';
import { getGoogleCalendarUrl } from '@/utils/calendarUtils';

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export default function AppointmentRow({ app, onEdit, onDelete, onStatusUpdate }) {
    const api_url = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) || 'http://localhost:3001/api';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <p className="font-medium text-gray-900">{app.title}</p>
                <p className="text-xs text-gray-500 truncate max-w-xs">{app.description || 'No description'}</p>
            </td>
            <td className="px-6 py-4">
                <p className="text-sm text-gray-900">{new Date(app.start_time).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">{new Date(app.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${app.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                    app.status === 'cancelled' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    {app.status}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                    <a
                        href={getGoogleCalendarUrl({
                            title: app.title,
                            description: app.description || '',
                            startTime: app.start_time,
                            endTime: app.end_time,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Add to Google Calendar"
                    >
                        <GoogleIcon />
                    </a>
                    <button
                        onClick={() => onEdit(app)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                    >
                        <EditIcon />
                    </button>
                    {app.status !== 'cancelled' ? (
                        <button
                            onClick={() => onStatusUpdate(app.id, 'cancelled')}
                            className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                            title="Cancel"
                        >
                            <XCircleIcon />
                        </button>
                    ) : (
                        <button
                            onClick={() => onStatusUpdate(app.id, 'scheduled')}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Reschedule"
                        >
                            <PlusIcon />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(app)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </td>
        </tr>
    );
}
