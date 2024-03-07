import Tarea from '../model/TareaModel.js';
import {calcularDiferenciaDeTiempo, calculartarifa} from '../libs/Tarifa.js'

export const register = async (req, res) => {
    const { fecha, hora_inicio, hora_fin, id_proyecto, id_servicio } = req.body;
    try {
        const proyectFound = await Tarea.findProjectById(id_proyecto);

        if (!proyectFound) return res.status(404).json({message: 'Proyecto no encontrado'});        

        const serviceFound = await tTarea.findServiceById(id_servicio);

        if (!serviceFound) return res.status(404).json({message: 'Servicio no encontrado'});  
             
        var time = calcularDiferenciaDeTiempo(hora_inicio,hora_fin);
        
        var time2 = calculartarifa(hora_inicio,hora_fin, fecha);

        if(time2.fin){
            await Tarea.create(
                { fecha: fecha, hora_inicio:hora_inicio, hora_fin: '12:00AM', total_hora: calcularDiferenciaDeTiempo(hora_inicio,'12:00AM'), id_proyecto_fk: id_proyecto, id_servicio_fk: id_servicio, feriado_fk: null, total_tarifa: calculartarifa(hora_inicio,'12:00AM', fecha).tarifa1 },
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk','total_tarifa'] }
            );
            await Tarea.create(
                { fecha: time2.fin, hora_inicio:'12:00AM', hora_fin: hora_fin, total_hora: calcularDiferenciaDeTiempo('12:00AM',hora_fin), id_proyecto_fk: id_proyecto, id_servicio_fk: id_servicio, feriado_fk: null, total_tarifa: calculartarifa('12:00AM',hora_fin, fecha).tarifa1 },
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk','total_tarifa'] }
            )
        }else{
            await Tarea.create(
                { fecha: fecha, hora_inicio:hora_inicio, hora_fin: hora_fin, total_hora: time, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rateDay1.isHoliday, total_tarifa: time2.tarifa1},
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk','total_tarifa'] }
            )
        }
        res.status(200).json({
            total_time: time,
            total_tarifa_dia1: time2.tarifa1,
            total_tarifa_da2: time2.tarifa2,
            siguiente_dia: time2.fin
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getByProject = async (req, res) => {
    const { id } = req.params
    try {
        const proyectFound = await Tarea.findProjectById(id_proyecto);

        if (!proyectFound) return res.status(404).json({message: 'Proyecto no encontrado'}); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}