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
            // formato de los datos para mayor legibilidad
            const formattedTasks = tasks.map(task => ({
                id_area: task.dataValues.id_tarea,
                fecha: task.dataValues.fecha,
                hora_inicio: task.dataValues.hora_inicio,
                hora_fin: task.dataValues.hora_fin,
                total_hora: task.dataValues.total_hora,
                feriado: task.dataValues.feriado_fk,
                id_proyecto: task.dataValues.id_proyecto_fk,
                nombre_proyecto: task.proyecto.dataValues.nombre,
                id_servicio: task.dataValues.id_servicio_fk,
                nombre_servicio: task.servicio.dataValues.nombre,
            }));
            // enviar los datos
            res.status(200).json(formattedTasks)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve una tarea segun el ID
    static async getById (req, res){
        try {
            // capturar id de tarea
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
            // formato los datos para mayor legibilidad
            const formattedTask = {
                id_area: taskFound.dataValues.id_tarea,
                fecha: taskFound.dataValues.fecha,
                hora_inicio: taskFound.dataValues.hora_inicio,
                hora_fin: taskFound.dataValues.hora_fin,
                total_hora: taskFound.dataValues.total_hora,
                feriado: taskFound.dataValues.feriado_fk,
                id_proyecto: taskFound.dataValues.id_proyecto_fk,
                nombre_proyecto: taskFound.proyecto.dataValues.nombre,
                id_servicio: taskFound.dataValues.id_servicio_fk,
                nombre_servicio: taskFound.servicio.dataValues.nombre,
            };
            // enviar los datos
            res.status(200).json(formattedTask)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve las tareas de un proyecto
    static async getByProject (req, res){
        try {
            // capturar id de proyecto
            const { id } = req.params
            // comprobar si existe el proyecto
            const projectFound = await Proyecto.findByPk(id)
            if (!projectFound) {
                return res.status(404).json({ message: 'Proyecto no encontrado' })
            }
            // obtener todas las tareas de proyecto
            const tasks = await Tarea.findAll({
                attributes: [
                    'id_tarea',
                    'fecha',
                    'hora_inicio',
                    'hora_fin',
                    'total_hora',
                    'id_servicio_fk',
                    'feriado_fk'
                ],
                where: {
                    id_proyecto_fk: id
                },
                include: [
                    {
                      model: Servicio,
                      attributes: ['nombre']
                    }
                  ]
            })
            // si no se encuentran tareas
            if (tasks.length === 0 || !tasks) {
                return res.status(500).json({message: 'Este proyecto no tiene tareas'})
            }
            // formato los datos para mayor legibilidad
            const formattedTasks = tasks.map(task => ({
                id_tarea: task.dataValues.id_tarea,
                fecha: task.dataValues.fecha,
                hora_inicio: task.dataValues.hora_inicio,
                hora_fin: task.dataValues.hora_fin,
                total_hora: task.dataValues.total_hora,
                feriado: task.dataValues.feriado_fk,
                id_servicio: task.dataValues.id_servicio_fk,
                nombre_servicio: task.servicio.dataValues.nombre,
            }));            
            // enviar los datos
            res.status(200).json(formattedTasks)
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
            // Convertimos las horas de inicio y fin a formato de 24 horas si están en formato de 12 horas.
            start_time = start_time.includes('AM') || start_time.includes('PM') ? convertTo24HourFormat(start_time) : start_time;
            end_time = end_time.includes('AM') || end_time.includes('PM') ? convertTo24HourFormat(end_time) : end_time;

            // Extraemos las horas de inicio y fin.
            let startHour = convertTo12HourFormat(start_time);
            let endHour = convertTo12HourFormat(end_time);

            // Si el técnico trabajo hasta el día siguiente...
            if (endHour < startHour) {
                // Calculamos la tarifa para el primer día
                let rateDay1 = calculateRate(date, start_time, '24:00', project.tarifa);
                // guardar en la base de datos
                await Tarea.create(
                    { fecha: date, hora_inicio:startHour, hora_fin: '12:00 AM', total_hora: rateDay1.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rateDay1.isHoliday },
                    { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
                )
                // Calculamos la tarifa para el día siguiente
                let nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);
                nextDay = nextDay.toISOString().split('T')[0]
                let rateDay2 = calculateRate(nextDay, '12:00 AM', end_time, project.tarifa);
                // guardar en la base de datos
                await Tarea.create(
                    { fecha: nextDay, hora_inicio: '12:00 AM', hora_fin: endHour, total_hora: rateDay2.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rateDay2.isHoliday },
                    { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_proyecto_fk', 'id_servicio_fk', 'feriado_fk'] }
                )
                res.status(201).json({ message: 'Tareas creadas correctamente' })
            } else {
                // Si el técnico terminó el mismo día, calculamos la tarifa
                const rate = calculateRate(date, start_time, end_time, project.tarifa)
                // guardar en la base de datos
                await Tarea.create(
                    { fecha: date, hora_inicio:startHour, hora_fin:endHour, total_hora: rate.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rate.isHoliday },
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