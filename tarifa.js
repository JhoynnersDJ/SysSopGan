const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();

const holidays = ['2024-02-11', '2024-12-25'];

let doc = new PDFDocument;
doc.pipe(fs.createWriteStream('output.pdf'));


export function calculateRate(startDate, startTime, endTime, hourlyRate) {
    // Convertimos la fecha de inicio a un objeto Date.
    
    let endDate = new Date(startDate);
    // Extraemos las horas de inicio y fin de las cadenas de tiempo.
    let startHour = parseInt(startTime.split(':')[0]);
    let endHour = parseInt(endTime.split(':')[0]);

    // Si la hora de fin es menor que la hora de inicio, significa que el técnico trabajó hasta el día siguiente.
    if (endHour < startHour) {
        endDate.setDate(endDate.getDate() + 1);
    }

    // Calculamos las horas totales trabajadas.
    let totalHours = endHour >= startHour ? endHour - startHour : 24 - startHour + endHour;
    let dayHours = 0;
    let nightHours = 0;

    // Si el técnico terminó el mismo día...
    if (startHour < endHour) {
        // Calculamos las horas de día y de noche.
        dayHours = startHour < 19 && endHour > 7 ? Math.min(19, endHour) - Math.max(7, startHour) : 0;
        nightHours = totalHours - dayHours;

    } else {
        // Si el técnico trabajó hasta el día siguiente...
        if (startHour < 19) {
            // Si el técnico comenzó a trabajar durante el día, calculamos las horas de día y de noche.
            dayHours = Math.min(19, endHour) - startHour;
            nightHours = totalHours - dayHours;

        } else {
            // Si el técnico comenzó a trabajar durante la noche, calculamos las horas de noche y de día.
            nightHours = 24 - startHour;
            dayHours = totalHours - nightHours;
            
        }

    }

    // Determinamos si el día de trabajo es un fin de semana o un día festivo.
    let dayOfWeek = endDate.getDay();
    let isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let isHoliday = holidays.includes(endDate.toISOString().split('T')[0]);

    // Calculamos el multiplicador de la tarifa basándonos en si es un fin de semana o un día festivo.
    let rateMultiplier = 1;

    if (isWeekend & isHoliday) {
        rateMultiplier = 3;
    }
    else if (isHoliday) {
        rateMultiplier = 2;
    } 
    else if (isWeekend) {
        rateMultiplier = 1.5;
    } 
    else  {
        rateMultiplier = 1;
    }

    // Devolvemos el total de la tarifa y las horas trabajadas.
    return {
        totalRate: (dayHours + nightHours * 1.5) * hourlyRate * rateMultiplier,
        totalHours: totalHours,
        dayHours: dayHours,
        nightHours: nightHours,
        isHoliday: isHoliday,
        dayOfWeek: dayOfWeek 
    };
}

// Definimos una ruta GET para '/' que genera un reporte.
app.get('/', (req, res) => {
    // Definimos los datos de entrada son de prueba
    const startDate = '2024-02-15';
    const startTime = '15:00';
    const endTime = '02:00';
    const hourlyRate = 15;

    // Extraemos las horas de inicio y fin.
    let startHour = parseInt(startTime.split(':')[0]);
    let endHour = parseInt(endTime.split(':')[0]);

    // Inicializamos el reporte.
    let report = [];
    // Si el técnico trabajó hasta el día siguiente...
    if (endHour < startHour) {
        // Calculamos la tarifa para el primer día y la añadimos al reporte.
        let rateDay1 = calculateRate(startDate, startTime, '24:00', hourlyRate);
        report.push({
            date: startDate,
            totalHours: rateDay1.totalHours,
            totalRate: rateDay1.totalRate,
            dayHours: rateDay1.dayHours,
            nightHours: rateDay1.nightHours,
            isHoliday: rateDay1.isHoliday,
            dayOfWeek: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][rateDay1.dayOfWeek]

            
        });

        // Calculamos la tarifa para el día siguiente y la añadimos al reporte.
        let nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);
        let rateDay2 = calculateRate(nextDay.toISOString().split('T')[0], '00:00', endTime, hourlyRate);
        report.push({
            date: nextDay.toISOString().split('T')[0],
            totalHours: rateDay2.totalHours,
            totalRate: rateDay2.totalRate,
            dayHours: rateDay2.dayHours,
            nightHours: rateDay2.nightHours,
            isHoliday: rateDay2.isHoliday,
            dayOfWeek: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][rateDay2.dayOfWeek]
            
        });
    } else {
        // Si el técnico terminó el mismo día, calculamos la tarifa y la añadimos al reporte.
        let rate = calculateRate(startDate, startTime, endTime, hourlyRate);
        report.push({
            date: startDate,
            totalHours: rate.totalHours,
            totalRate: rate.totalRate,
            dayHours: rate.dayHours,
            nightHours: rate.nightHours,
            isHoliday: rate.isHoliday,
            dayOfWeek: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][rate.dayOfWeek]
        });
    }

    // Enviamos el reporte como respuesta.
    res.json({ report });

    // Aquí puedes agregar el contenido al PDF
    doc.text(JSON.stringify(report), 100, 100);

    doc.end();
});

// Iniciamos el servidor en el puerto 3000.
app.listen(3000, () => console.log('Server zzzzz 3000'));

