import {Tarea} from "../Modelo/Syssopgan/Asociaciones.js"
import { calculateRate } from "../services/tarifa.js"
import { convertTo12HourFormat } from "../services/FormatHours.js"
import { convertTo24HourFormat } from "../services/FormatHours.js"
import {Proyecto} from "../Modelo/Syssopgan/ProyectoModel.js"
import {Servicio} from "../Modelo/Syssopgan/ServicioModel.js"

class TareaController {
    // devuelve todas las tareas
    static async index (req, res) {
        try {
            // buscar todos los registros
            const tasks = await Tarea.findAll({
                include: [
                    {
                      model: Proyecto,
                      attributes: [['nombre_proyecto', 'nombre']]
                    },
                    {
                      model: Servicio,
                      attributes: ['nombre']
                    }
                  ]
            })
            if (!tasks) {
                return res.status(500).json({message: 'No hay tareas registradas'})
            }
            res.status(200).json(tasks)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve una tarea segun el ID
    static async getById (req, res){
        try {
            // capturar datos
            const { id } = req.params
            // comprobar si existe
            const taskFound = await Tarea.findByPk(id, {
                include: [
                    {
                      model: Proyecto,
                      attributes: [['nombre_proyecto', 'nombre']]
                    },
                    {
                      model: Servicio,
                      attributes: ['nombre']
                    }
                  ]
            })
            if (!taskFound) {
                return res.status(404).json({message: 'Tarea no encontrada'})
            }
            res.status(200).json(taskFound)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

// crear una tarea
//NO TOCAR SI QUIERES HACER ALGO CONSULTA CON ROBERT :)
static async create (req, res){
    try {
        // capturar datos
        const { date, start_time, end_time, id_project, id_service } = req.body
        // comprobar si existe el proyecto
        const project = await Proyecto.findByPk(id_project,{
            attributes: [
                'id_proyecto',
                'tarifa',
                'nombre_proyecto',
                'id_responsable_tecnico_fk',
                'id_usuario_fk',
                'id_responsable_cliente_fk',
                'status',
                'fecha_inicio'
            ]
        })
        if (!project) {
            return res.status(404).json({message: 'Proyecto no encontrado'})
        }
        // comprobar si existe el servicio
        const serviceFound = await Servicio.findByPk(id_service)
        if (!serviceFound) {
            return res.status(404).json({message: 'Servicio no encontrado'})
        }
        //Comprobar la fecha y que esta no sea superior a la actual
        const fechaFound = await date;
        if (!fechaFound) {
            return res.status(404).json({message: 'Fecha Invalida'});
        }
        // Convierte las dos fechas a milisegundos
        let date1_ms = new Date(fechaFound).getTime();
        let date2_ms = new Date().getTime();
        // calculamos la diferecia
        let difference_ms = date2_ms - date1_ms;
        // Y si la da un resultado negativo la fecha esta en el futuro id_cliente_fk
        if (difference_ms < 0) {
            return res.status(400).json({message: 'La fecha no puede ser en el futuro'});
        }

        // Convertimos las horas de inicio y fin a formato de 24 horas si están en formato de 12 horas.
        let converted_start_time = start_time.includes('AM') || start_time.includes('PM') ? convertTo24HourFormat(start_time) : start_time;
        let converted_end_time = end_time.includes('AM') || end_time.includes('PM') ? convertTo24HourFormat(end_time) : end_time;

        // Extraemos las horas de inicio y fin.
        //let startHour = convertTo12HourFormat(converted_start_time);
        //let endHour = convertTo12HourFormat(converted_end_time);

        // Extraemos las horas de inicio y fin.
        let startHour = converted_start_time;
        let endHour = converted_end_time;

        if (startHour === endHour) {
            // Si la hora de inicio y la hora de fin son iguales, entonces el técnico trabajó 24 horas.
            // Generamos dos registros, uno para cada día.
            let rateDay1 = calculateRate(date, startHour, '24:00', project.tarifa);
            await Tarea.create(
                { fecha: date, hora_inicio:startHour, hora_fin: '24:00', total_hora: rateDay1.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rateDay1.isHoliday },
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
            )
                
            let nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            let rateDay2 = calculateRate(nextDay.toISOString().split('T')[0], '00:00', endHour, project.tarifa);
            await Tarea.create(
                { fecha: nextDay.toISOString().split('T')[0], hora_inicio: '00:00', hora_fin: endHour, total_hora: rateDay2.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rateDay2.isHoliday },
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
            )
            res.status(201).json({ message: 'Tarea creada correctamente' })
        } else {
           // Si el técnico trabajo hasta el día siguiente...
        if (endHour < startHour) {
            // Calculamos la tarifa para el primer día
            let rateDay1 = calculateRate(date, converted_start_time, '00:00', project.tarifa);
            // guardar en la base de datos
            await Tarea.create(
                { fecha: date, hora_inicio:startHour, hora_fin: '00:00', total_hora: rateDay1.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rateDay1.isHoliday },
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
            )
            // Calculamos la tarifa para el día siguiente
            let nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            nextDay = nextDay.toISOString().split('T')[0]
            let rateDay2 = calculateRate(nextDay, '00:00', converted_end_time, project.tarifa);
            // guardar en la base de datos
            await Tarea.create(
                { fecha: nextDay, hora_inicio: '00:00', hora_fin: endHour, total_hora: rateDay2.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rateDay2.isHoliday },
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
            )
            res.status(201).json({ message: 'Tareas creadas correctamente' })
        } else {
            // Si el técnico terminó el mismo día, calculamos la tarifa
            const rate = calculateRate(date, converted_start_time, converted_end_time, project.tarifa)
            // guardar en la base de datos
            await Tarea.create(
                { fecha: date, hora_inicio:startHour, hora_fin:endHour, total_hora: rate.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rate.isHoliday },
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
            )
            res.status(201).json({ message: 'Tarea creada correctamente' })
        }
        }

        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Hubo un problema al crear la tarea' })
    }
}

    // hay que revisar esta funcion
    // actualizar una tarea
    static async update (req, res){
        try {
            // capturar datos
            const { id } = req.params
            const { end_time, total_hours, id_holiday } = req.body
            // comprobar si existe
            const tastkFound = await Tarea.findByPk(id)
            if (!tastkFound) {
                return res.status(404).json({ message: 'Tarea no encontrada' })
            } 
            // guardar a la base de datos
            await Tarea.update(
            { hora_fin: end_time, total_hora: total_hours, feriado_fk: id_holiday },
            { where: { id_tarea: id } }
            )
            res.status(200).json({ message: 'Tarea actualizada correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default TareaController