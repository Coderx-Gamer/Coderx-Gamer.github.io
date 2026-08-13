// shared by every page: keeps the footer copyright year current
document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
});

// "3 weeks ago" for a date, in the largest unit that fits — so a build from
// yesterday reads in hours, one from last spring reads in months.
const TIME_UNITS = [
    ['year', 31557600],
    ['month', 2629800],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60]
];

function timeAgo(value) {
    const then = new Date(value);
    if (isNaN(then.getTime())) return '';

    const seconds = (Date.now() - then.getTime()) / 1000;
    if (seconds < 60) return 'just now';

    const format = new Intl.RelativeTimeFormat(undefined, { numeric: 'always' });
    for (const [unit, size] of TIME_UNITS) {
        // floor, not round: a 10-day-old build is "1 week ago", never "2 weeks ago"
        if (seconds >= size) return format.format(-Math.floor(seconds / size), unit);
    }
    return 'just now';
}
