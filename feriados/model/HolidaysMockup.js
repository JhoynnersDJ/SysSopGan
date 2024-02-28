import holidays from './HolidaysModel.js';
import {Feriado} from '../../src/Modelo/Syssopgan/FeriadoModel.js'
import  {v4 } from "uuid";
import ibmdb from "ibm_db"

let connStr = "DATABASE=SYSSOP;HOSTNAME=192.168.1.28;UID=db2inst1;PWD=H0l41324%;PORT=25000;PROTOCOL=TCPIP";

class holidayPort{
    save(holiday){}
    findOne(email){}
}

async function getidmax(){
    return await ibmdb.open(connStr,
        function(err,conn) {
         if (err) return console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
            conn.query("SELECT MAX(ID) FROM TECNICO.FERIADO",
          function (err, data) {
             if (err) console.log(err);
             else
             { 
               console.log(data[0]['1']);  
               return data[0]['1']+1;
              }
              conn.close(function () {
                //console.log('done');
              });
           });
       });
       //console.log(id)
       //return id;
}

//guarda al feriado para persistencia
async function saveHoliday(holiday) {
    //console.log(holiday.date);
    const id = v4().split('-')[0];
    console.log(id)
        //console.log(id)
        //console.log(`INSERT INTO TECNICO.FERIADO(ID, NOMBRE, FECHA) VALUES (${id}`+", '"+holiday.name+"', '"+holiday.date+"');")
        const user2 = await ibmdb.open(connStr,
            function(err,conn) {
              if (err) return console.log(err);
            conn.query("INSERT INTO TECNICO.FERIADO(ID, NOMBRE, FECHA) VALUES ('"+id+"', '"+holiday.name+"', '"+holiday.date+"');",
               function (err, data) {
                  if (err) console.log(err);
                  else
                  { //console.log(data[0]);  return data[0] ;
                    //console.log(data);
                   }
                   conn.close(function () {
                     console.log('done');
                   });
                });
            });
    /*const newhol = await Feriado.create({ nombre: holiday.name, fecha: holiday.date},
        {fields: [ 'nombre', 'fecha']});*/
    return user2;
    //holidays.holidays.push(holiday);
}

//busca en la lista de feriados una fecha pasada por parametro
async function findOne(id){
    const holidayFound = await Feriado.findOne(
        {
            where: { id : id} 
        }
    );
    if(!holidayFound) return null;
    
    const newHoliday = new holidays(holidayFound.dataValues.nombre, holidayFound.dataValues.fecha, holidayFound.dataValues.id);
    
    return newHoliday;
    //return holidays.holidays.find((holidays) => holidays.id == id);
}

//devuelve todos los feriados guardados
async function getHolidays(){
    const allHolidays = await Feriado.findAll();
    return allHolidays;
    //return holidays.holidays;
}

async function getHolidaysDate(){
    const allHolidays = await Feriado.findAll();
    let dates = [];
    allHolidays.forEach((holiday) => dates.push(holiday.dataValues.fecha)) 
    return dates;
    //return holidays.holidays;
}

//elimina un feriado por id
async function deleteOne(id){
    const deleteHoliday = await Feriado.destroy({
        where: {
          id: id
        },
      });
    /*hol = [];
    for(var i = 0; i < holidays.holidays.length; i++) {
        if (holidays.holidays[i].id != id) {
            hol.push(holidays.holidays[i]);
        }
    }
    //holidays.holidays.forEach((holiday) => {if(holiday.id != id) {hol.push(holidays)}});
    holidays.holidays = hol;
    hol =[];*/
}

//encuentra un feriado por fecha
async function findOneByDate(date){
    console.log(date);
    const user2 = await ibmdb.open(connStr,
        function(err,conn) {
          if (err) return console.log('err');
           conn.query(`SELECT * FROM TECNICO.FERIADO WHERE FECHA =${date};`,
           function (err, data) {
              if (err) console.log(err);
              else
              { console.log('estoy aquii');  return data[0] ;
               }
               conn.close(function () {
                 console.log('termine con mi perro 400');
               });
            });
        });
    
    console.log(user2)
    /*const holidayFound = await Feriado.findOne(
        {
            where: { fecha : date} 
        }
    );
    if(!holidayFound) return null;*/
    
    return user2;
    /*//date.setHours(0,0,0,0);
    for(var i = 0; i < holidays.holidays.length; i++) {
        let day = holidays.holidays[i].date;
        //day.setHours(0,0,0,0);
        if (day.valueOf() == date.valueOf()) {
            return holidays.holidays[i];
        }
        //date = null;
    }
    return null;*/
}

async function updateName(name,id){

    const holidayFound = await Feriado.findOne(
        {
            where: { id : id} 
        }
    );
    if(!holidayFound) return null;
    
    holidayFound.nombre = name;
    return holidayFound.save();
}

async function updateDate(date,id){

    const holidayFound = await Feriado.findOne(
        {
            where: { id : id} 
        }
    );
    if(!holidayFound) return null;
    
    holidayFound.fecha = date;
    return holidayFound.save();
}

export default class holidayMockup extends holidayPort{
    holidays = [];

    static getHolidays (){
        return this.holidays;
    }

    static save(holiday){
        
        return saveHoliday(holiday);
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
    static updateName(name,id){
        return updateName(name,id)
    }
    static updateDate(date,id){
        return updateDate(date,id)
    }

    static getHolidaysDate(){
        return getHolidaysDate();
    }
    
}

//let holidays = new holidayMockup();
let hol = [];
//let day =new Date();
