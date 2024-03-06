import tarea from '../model/TareaModel.js';
import {calcularDiferenciaDeTiempo, calculartarifa} from '../libs/Tarifa.js'

export const register = async (req, res) => {
    const { date, start_time, end_time, id_project, id_service } = req.body;
    try {
        /*const proyectFound = await tarea.findProjectById(id_project);

        if (!proyectFound) return res.status(404).json({message: 'Proyecto no encontrado'});        

        const serviceFound = await tarea.findServiceById(id_service);

        if (!serviceFound) return res.status(404).json({message: 'Servicio no encontrado'}); */  
        
        const date = new Date(start_time);
        console.log(date);

        var time = calcularDiferenciaDeTiempo(start_time,end_time);
        var time2 = calculartarifa(start_time,end_time, date);
        res.status(200).json({
            total_time: time,
            total_tarifa: time2.tarifa,
            siguiente_dia: time2.fin
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};