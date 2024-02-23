export function convertTo12HourFormat(time) {
    let [hours, minutes] = time.split(':');
    let period = +hours < 12 ? 'AM' : 'PM';
    hours = +hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
}
