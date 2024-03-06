import holidayMock from "./HolidaysMockup.js";

//clase que define la estructura de los feriados del sistema
export default class holidays {    
    constructor(nombre, fecha, id) {
        this.nombre = nombre;
        this.fecha = fecha;
        this.id = id;
    }

    //gets de los atributos de user
    getHolidayName() { return this.name; }
    getHolidayDate() { return this.date; }
    getHolidayId() { return this.id; }

    //sets de los atributos de user
    setHolidayName(name,id) { return holidayMock.updateName(name,id);}
    setHolidayDate(date,id) { return holidayMock.updateDate(date,id);}    
    setHolidayId(id) { this.id = id;}


    static save(hol){
        return holidayMock.save(hol);
    }

    static getHolidays(){
        return holidayMock.getHolidays();
    }

    static findOne(id){
        return holidayMock.findOne(id);
    }

    static findOneByDate(date){
        return holidayMock.findOneByDate(date);
    }

    static deleteOne(id){
        holidayMock.deleteOne(id);
    }

}