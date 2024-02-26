import holidayMockup from '../../feriados/model/HolidaysMockup.js'

//const holidays = ['2024-02-11', '2024-12-25'];
const holidays = await holidayMockup.getHolidaysDate();

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
    let isSunday = dayOfWeek === 0 
    let isSaturday = dayOfWeek === 6;
    let isHoliday = holidays.includes(endDate.toISOString().split('T')[0]);

    // Calculamos el multiplicador de la tarifa basándonos en si es un fin de semana o un día festivo.
    let rateMultiplier = 1;
    let yes = 0;

    if (isSunday & isHoliday) {
        rateMultiplier = 2;
        yes = 1
    }
    else if (isSaturday & isHoliday) {
        rateMultiplier = 2;
        yes = 1
    }
    else if (isSunday) {
        rateMultiplier = 2;
        yes = 1
    } 
    else if (isHoliday) {
        rateMultiplier = 2;
        yes = 1
    } 
    else if (isSaturday) {
        rateMultiplier = 1.5;
        yes = 1
    } 
    else  {
        rateMultiplier = 1;
        yes = 0
    }

    // Devolvemos el total de la tarifa y las horas trabajadas.
    //yes es usado para saber si es un dia especial si no lo es las horas nocturnas se cobran extras
        if (yes==1) {
            return {
                totalRate: (dayHours + nightHours) * hourlyRate * rateMultiplier,
                totalHours: totalHours,
                dayHours: dayHours,
                nightHours: nightHours,
                isHoliday: isHoliday,
                dayOfWeek: dayOfWeek 
            };
        }
        else { 
            return {
                totalRate: (dayHours + nightHours * 1.5) * hourlyRate * rateMultiplier,
                totalHours: totalHours,
                dayHours: dayHours,
                nightHours: nightHours,
                isHoliday: isHoliday,
                dayOfWeek: dayOfWeek 
            }
        }
}


