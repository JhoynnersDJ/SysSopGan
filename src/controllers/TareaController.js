import {Tarea} from "../Modelo/Syssopgan/TareaModel.js"
import { calculateRate } from "../services/tarifa.js"
import {Proyecto} from "../Modelo/Syssopgan/ProyectoModel.js"
import {Servicio} from "../Modelo/Syssopgan/ServicioModel.js"

class TareaController {
    // devuelve todas las tareas
    static async index (req, res) {
        try {
            // buscar todos los registros
            const tasks = await Tarea.findAll()
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
            const taskFound = await Tarea.findByPk(id)
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
            // calculo del total de horas y booleano de feriado
            // obtener tarifa por hora de un proyecto
            const hourlyRate = project.tarifa
            const rate = calculateRate(date, start_time, end_time, hourlyRate)
            // instanciar el objeto y guardarlo en la base de datos
            await Tarea.create(
                { fecha: date, hora_inicio:start_time, hora_fin:end_time, total_hora: rate.totalHours, id_proyecto_fk: id_project, id_servicio_fk: id_service, feriado_fk: rate.isHoliday },
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_proyecto_fk', 'id_actividad_fk', 'feriado_fk'] }
              )
              res.status(201).json({ message: 'Tarea creada correctamente' })
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
        const testkFound = await Tarea.findByPk(id)
        if (!testkFound) {
            res.status(404).json({ message: 'Tarea no encontrada' })
        } else {
            // crear instancia y guardar a la base de datos
            await Tarea.update(
            { hora_fin: end_time, total_hora: total_hours, feriado_fk: id_holiday },
            { where: { id_tarea: id } }
            )
            res.status(200).json({ message: 'Tarea actualizada correctamente' })
        }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default TareaController