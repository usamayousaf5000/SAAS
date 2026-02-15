/**
 * Build a Google Calendar "Add event" URL that opens calendar.google.com with the event pre-filled.
 * User can then save it to their Google Calendar (no OAuth required).
 * @param {{ title: string, description?: string, startTime: string|Date, endTime: string|Date }} options
 * @returns {string} URL to open in a new tab
 */
export function getGoogleCalendarUrl({ title, description = '', startTime, endTime }) {
    const start = startTime instanceof Date ? startTime : new Date(startTime);
    const end = endTime instanceof Date ? endTime : new Date(endTime);
    const pad = (n) => (n < 10 ? '0' + n : '' + n);
    const format = (d) =>
        `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${format(start)}/${format(end)}`,
        details: description,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
