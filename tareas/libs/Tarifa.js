function calcularDiferenciaDeTiempo(date1, date2) {
    // Parsea las horas, minutos y período de date1
    const [hours1, minutes1, period1] = date1.match(/\d+|AM|PM/g);

    // Parsea las horas, minutos y período de date2
    const [hours2, minutes2, period2] = date2.match(/\d+|AM|PM/g);

    // Convierte las horas de 12 horas a 24 horas
    let horasInicio = parseInt(hours1);
    let horasFin = parseInt(hours2);

    // Si el período es PM y no son las 12 PM, añade 12 horas
    if (period1 === "PM" && horasInicio !== 12) {
        horasInicio += 12;
    }
    if (period2 === "PM" && horasFin !== 12) {
        horasFin += 12;
    }

    // Si date2 es antes que date1, ajusta las horas de date2
    if (horasInicio > horasFin || (horasInicio === horasFin && parseInt(minutes1) > parseInt(minutes2))) {
        horasFin += 24;
    }

    // Si las horas son iguales y representan el final del día, establece la diferencia a 24 horas
    if (horasInicio === horasFin && parseInt(minutes1) === parseInt(minutes2)) {
        return '24:00';
    }

    // Calcula la diferencia en minutos
    let diferenciaEnMinutos = (horasFin * 60 + parseInt(minutes2)) - (horasInicio * 60 + parseInt(minutes1));

    // Calcula las horas y minutos de la diferencia
    const horas = Math.floor(diferenciaEnMinutos / 60);
    const minutos = diferenciaEnMinutos % 60;

    // Retorna la diferencia en formato de horas y minutos
    return `${horas}:${minutos < 10 ? '0' : ''}${minutos}`;
}

function calculartarifa(date1, date2, inicio) {
    let fin; // Inicializamos la variable fin aquí

    // Parsea las horas, minutos y período de date1
    const [hours1, minutes1, period1] = date1.match(/\d+|AM|PM/g);

    // Parsea las horas, minutos y período de date2
    const [hours2, minutes2, period2] = date2.match(/\d+|AM|PM/g);

    // Convierte las horas de 12 horas a 24 horas
    let horasInicio = parseInt(hours1);
    let horasFin = parseInt(hours2);

    // Si el período es PM y no son las 12 PM, añade 12 horas
    if (period1 === "PM" && horasInicio !== 12) {
        horasInicio += 12;
    }
    if (period2 === "PM" && horasFin !== 12) {
        horasFin += 12;
    }

    // Si date2 es antes que date1 y hay un salto de día, ajusta la fecha de fin
    if (horasFin < horasInicio || (horasFin === horasInicio && parseInt(minutes2) < parseInt(minutes1))) {
        horasFin += 24;

        const fechaInicio = new Date(inicio);
        const fechaFin = new Date(inicio);
        fechaFin.setDate(fechaFin.getDate() + 1); // Establecer el día siguiente a la fecha de inicio

        const dia = fechaFin.getDate();
        const mes = fechaFin.getMonth() + 1; // Los meses en JavaScript se indexan desde 0
        const año = fechaFin.getFullYear();

        fin = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
    }

    let tarifa = 0;

    // Itera sobre cada hora y cuenta las horas transcurridas
    for (let i = horasInicio; i < horasFin; i++) {
        // Si la hora está fuera del rango 7:00AM a 7:00PM, suma 1.5
        if (i < 7 || i >= 19) {
            tarifa += 1.5;
        } else {
            tarifa += 1;
        }
    }

    return { tarifa, fin };
}