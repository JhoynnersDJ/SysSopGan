import tarea from '../model/TareaModel.js';
import {calcularDiferenciaDeTiempo, calculartarifa} from '../libs/Tarifa.js'

export const register = async (req, res) => {
    const { fecha, hora_inicio, hora_fin, id_proyecto, id_servicio } = req.body;
    try {
        /*const proyectFound = await tarea.findProjectById(id_project);

        if (!proyectFound) return res.status(404).json({message: 'Proyecto no encontrado'});        

        const serviceFound = await tarea.findServiceById(id_service);

        if (!serviceFound) return res.status(404).json({message: 'Servicio no encontrado'}); */  
        
        const date = new Date(fecha);
        
        var time = calcularDiferenciaDeTiempo(hora_inicio,hora_fin);
        
        var time2 = calculartarifa(hora_inicio,hora_fin, fecha);
        res.status(200).json({
            total_time: time,
            total_tarifa: time2.tarifa,
            siguiente_dia: time2.fin
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};