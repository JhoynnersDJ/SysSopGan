// Función para convertir la hora a formato de 24 horas
export function convertTo24HourFormat(time) {
    let [hours, minutes] = time.split(':');
    let period = time.includes('PM') ? 'PM' : 'AM';
    hours = period === 'PM' && hours !== '12' ? parseInt(hours) + 12 : hours;
    hours = period === 'AM' && hours === '12' ? '00' : hours;
    return `${hours}:${minutes}`;
}

//Funcion para devolver el formato en 12 horas.
export function convertTo12HourFormat(time) {
    if (time.includes('AM') || time.includes('PM')) {
        let [hours, minutes] = time.split(':');
        let period = +hours < 12 ? '' : '';
        hours = +hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    } else {
        let [hours, minutes] = time.split(':');
        let period = +hours < 12 ? 'AM' : 'PM';
        hours = +hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }
}
