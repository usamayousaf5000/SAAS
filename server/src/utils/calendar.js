import { createEvents } from 'ics';

export function generateCalendarFile(appointment) {
    const { title, description, start_time, end_time } = appointment;

    // Parse timestamps
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    const event = {
        start: [
            startDate.getFullYear(),
            startDate.getMonth() + 1,
            startDate.getDate(),
            startDate.getHours(),
            startDate.getMinutes()
        ],
        end: [
            endDate.getFullYear(),
            endDate.getMonth() + 1,
            endDate.getDate(),
            endDate.getHours(),
            endDate.getMinutes()
        ],
        title: title,
        description: description || 'Appointment booked via SmartBook',
        location: 'SmartBook Platform',
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        organizer: { name: 'SmartBook', email: 'noreply@smartbook.com' }
    };

    return new Promise((resolve, reject) => {
        createEvents([event], (error, value) => {
            if (error) {
                reject(error);
            } else {
                resolve(value);
            }
        });
    });
}

export function generateICSDownloadURL(appointment) {
    // This will be used to create a downloadable .ics file
    return `/api/appointments/${appointment.id}/calendar`;
}
