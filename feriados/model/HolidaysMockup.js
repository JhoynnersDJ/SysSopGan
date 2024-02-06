import holiday from './HolidaysModel.js';

class holidayPort{
    save(holiday){}
    findOne(email){}
}

//guarda al feriado para persistencia
function saveHoliday(holiday) {
    holidays.holidays.push(holiday);
}

//busca en la lista de feriados una fecha pasada por parametro
function findOne(id){
    return holidays.holidays.find((holidays) => holidays.id == id);
}

//devuelve todos los feriados guardados
function getHolidays(date){
    return holidays.holidays;
}

//elimina un feriado por id
function deleteOne(id){
    hol = [];
    for(var i = 0; i < holidays.holidays.length; i++) {
        if (holidays.holidays[i].id != id) {
            hol.push(holidays.holidays[i]);
        }
    }
    //holidays.holidays.forEach((holiday) => {if(holiday.id != id) {hol.push(holidays)}});
    holidays.holidays = hol;
    hol =[];
}

export default class holidayMockup extends holidayPort{
    holidays = [];
    static save(holiday){
        
        saveHoliday(holiday);
        //console.log(holidays);
    }

    static findOne(id){
        return findOne(id);
    }

    static getHolidays(){
        return getHolidays();
    }

    static deleteOne(id){
        return deleteOne(id);
    }
    
}

let holidays = new holidayMockup();
let hol = []
