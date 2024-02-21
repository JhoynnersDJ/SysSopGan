import holidayMock from "./HolidaysMockup.js";

//clase que define la estructura de los feriados del sistema
export default class holidays {    
    constructor(name, date, id) {
        this.name = name;
        this.date = date;
        this.id = id;
    }

    //gets de los atributos de user
    getHolidayName() { return this.name; }
    getHolidayDate() { return this.date; }
    getHolidayId() { return this.id; }

    //sets de los atributos de user
    setHolidayName(name) { this.name = name;}
    setHolidayDate(date) { this.date = date;}    
    setHolidayId(id) { this.id = id;}


    save(){
        holidayMock.save(this);
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