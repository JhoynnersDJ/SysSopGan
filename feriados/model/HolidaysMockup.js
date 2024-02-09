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

//encuentra un feriado por fecha
function findOneByDate(date){
    //date.setHours(0,0,0,0);
    for(var i = 0; i < holidays.holidays.length; i++) {
        let day = holidays.holidays[i].date;
        //day.setHours(0,0,0,0);
        if (day.valueOf() == date.valueOf()) {
            return holidays.holidays[i];
        }
        //date = null;
    }
    return null;
}

export default class holidayMockup extends holidayPort{
    holidays = [];

    getHolidays (){
        return this.holidays;
    }
    static save(holiday){
        
        saveHoliday(holiday);
        //console.log(holidays);
    }

    static findOne(id){
        return findOne(id);
    }

    static findOneByDate(date){
        return findOneByDate(date);
    }

    static getHolidays(){
        return getHolidays();
    }

    static deleteOne(id){
        return deleteOne(id);
    }
    
}

let holidays = new holidayMockup();
let hol = [];
//let day =new Date();