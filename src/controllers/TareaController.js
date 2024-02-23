import {Tarea} from "../Modelo/Syssopgan/Asociaciones.js"
import { calculateRate } from "../services/tarifa.js"
import { convertTo12HourFormat } from "../services/FormatHours.js.js"
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
    static async create (req, res){
        try {
            // capturar datos
            const { date, start_time, end_time, id_project, id_service } = req.body
            // comprobar si existe el proyecto
            const project = await Proyecto.findByPk(id_project)
            if (!project) {
                return res.status(404).json({message: 'Proyecto no encontrado'})
            }
            // comprobar si existe el servicio
            const serviceFound = await Servicio.findByPk(id_service)
            if (!serviceFound) {
                return res.status(404).json({message: 'Servicio no encontrado'})
            }

            // Extraemos las horas de inicio y fin.
            let startHour = convertTo12HourFormat(start_time);
            let endHour = convertTo12HourFormat(end_time);

            // Si el técnico trabajo hasta el día siguiente...
            if (endHour < startHour) {
                // Calculamos la tarifa para el primer día
                let rateDay1 = calculateRate(date, start_time, '24:00', project.tarifa);
                // guardar en la base de datos
                await Tarea.create(
                    { fecha: date, hora_inicio:start_time, hora_fin: '24:00', total_hora: rateDay1.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rateDay1.isHoliday },
                    { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
                )
                // Calculamos la tarifa para el día siguiente
                let nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);
                nextDay = nextDay.toISOString().split('T')[0]
                let rateDay2 = calculateRate(nextDay, '00:00', end_time, project.tarifa);
                // guardar en la base de datos
                await Tarea.create(
                    { fecha: nextDay, hora_inicio: '00:00', hora_fin: end_time, total_hora: rateDay2.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rateDay2.isHoliday },
                    { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
                )
                res.status(201).json({ message: 'Tareas creadas correctamente' })
            } else {
                // Si el técnico terminó el mismo día, calculamos la tarifa
                const rate = calculateRate(date, start_time, end_time, project.tarifa)
                // guardar en la base de datos
                await Tarea.create(
                    { fecha: date, hora_inicio:start_time, hora_fin:end_time, total_hora: rate.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rate.isHoliday },
                    { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
                    )
                res.status(201).json({ message: 'Tarea creada correctamente' })
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
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