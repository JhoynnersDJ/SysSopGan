import holiday from "../model/HolidaysModel.js"
import holidayMock from "../model/HolidaysMockup.js"
import got from 'got';
import  {v4 } from "uuid";
const TOKEN_API = process.env.TOKEN_API;

//cargar los feriados desde la api de google calendar
export const loadHolidays = async (req,res) => {
    try {
        //se consume el endpoint para obtener todos los feriados de google calendar y se obtiene un json
        const items = await got
            .get(`https://www.googleapis.com/calendar/v3/calendars/es.ve%23holiday%40group.v.calendar.google.com/events?key=${TOKEN_API}`)
            .json(); 
            
        //se convierte en objeto solo los items del json
        const obj = JSON.parse(JSON.stringify(items.items));

        //los objetos son convertidos a holidays y guardados en el holidaysMock
        obj.forEach((element) => {

            //se genera el id unico del feriado
            //let idUnico = v4(); 

            //se ccrea un nuevo holiday
            const holidayItem = new holiday(element.summary, new Date(element.start.date));

            //se guarda el nuevo objeto en el holidaymock
            holidayItem.save();
            
        });
        
        res.json(obj)
    } catch (err) {
        return res.status(404).json({message: err.message});
    }
}

//te devuelve todos los feriados que han sido guardados
export const getHolidays = async (req,res) => {
    try {

        //busca los feriados
        const all = await holidayMock.getHolidays();

        //devuelve un json de los feriados como response
        res.json(all);

    } catch (error) {
        return res.status(500).json({message: 'Something goes wrong'});
    }
}

//se crea un nuevo dia feriado
export const createHoliday = async (req, res) => {    
    try {      
        
        const { name, date} = req.body;  
        
        //busca un feriado por id
        const holidayFound = await holiday.findOneByDate(new Date(date));

        //si consigue el feriado lanza un mensaje de feriado con fecha repetida
        if (holidayFound) return res.status(404).json({message: "Holiday Found, repeated date"});

        //se genera el id unico del feriado
        let idUnico = v4();
        
        //se ccrea un nuevo holiday
        const holidayItem = new holiday(name, new Date(date), idUnico);

        //se guarda el nuevo objeto en el holidaymock
        holidayItem.save();

        //se devuelve como respuesta el feriado creado
        res.json(holidayItem);
    } catch (error) {
        return res.status(500).json({message: "falta un campo"});
    }
}

//obtiene un feriado por id y lo actualiza
export const updateHoliday = async (req, res) => {
    try {
        const { name, date } = req.body;

        //busca un feriado por id
        const holidayFound = await holiday.findOne(req.params.id);

        //si no consigue el feriado lanza un mensaje de feriado no encontrado
        if (!holidayFound) return res.status(404).json({message: "Holiday not Found"});

        //si se introdujo un nombre se actualiza
        if (name) holidayFound.setHolidayName(name);

        //si se introdujo un nombre se actualiza
        if (date) holidayFound.setHolidayDate(date);

        //se devuelve como respuesta el feriado actualizado
        res.json(holidayFound);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }

}

//te devuelve un solo feriado por id
export const getHoliday = async (req, res) => {
    try {        

        //busca un feriado por id
        const holidayFound = await holiday.findOne(req.params.id);

        //si no consigue el feriado lanza un mensaje de feriado no encontrado
        if (!holidayFound) return res.status(404).json({message: "Holiday not Found"});   
        
        //se devuelve como respuesta el feriado encontrado
        res.json(holidayFound);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }

}

export const getHolidayByDate = async (req, res) => {
    try {

        //busca un feriado por id
        const holidayFound = await holiday.findOneByDate(new Date(req.params.date));

        //si no consigue el feriado lanza un mensaje de feriado no encontrado
        if (!holidayFound) return res.status(404).json({message: "Holiday not Found"});    
        
        //se devuelve como respuesta el feriado encontrado
        res.json(holidayFound);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }

}

//elimina un solo feriado por id
export const deleteHoliday = async (req, res) => {
    try {
        const { name, date } = req.body;

        //busca un feriado por id
        const holidayFound = await holiday.findOne(req.params.id);

        //si no consigue el feriado lanza un mensaje de feriado no encontrado
        if (!holidayFound) return res.status(404).json({message: "Holiday not Found"});

        //se elimina el dia feriado por id
        holiday.deleteOne(req.params.id);

        //se devuelve como respuesta el feriado eliminado
        res.json(holidayFound);
    } catch (error) {
        return res.status(404).json({message: error.message});
    }

}
