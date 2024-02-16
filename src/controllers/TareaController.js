import Tarea from "../Modelo/TareaModel.js";

class TareaController {
    // devuelve todas las tareas
    static async index (req, res) {
        try {
            // buscar todos los registros
            const tasks = await Tarea.findAll()
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
            const task = await Tarea.findByPk(id)
            if (task === null) {
                return res.status(404).json({message: 'Tarea no encontrada'})
            }
            res.status(200).json(task)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear una tarea
    static async create (req, res){
        try {
            // capturar datos
            const { date, start_time, end_time, total_hours, id_project, id_activity, id_holiday } = req.body
            // instanciar el objeto y guardarlo en la base de datos
            const role = await Tarea.create(
                { fecha: date, hora_inicio:start_time, hora_fin:end_time, total_hora: total_hours, id_proyecto_fk: id_project, id_actividad_fk: id_activity, feriado_fk: id_holiday },
                { fields: ['fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'id_proyecto_fk', 'id_proyecto_fk', 'id_actividad_fk', 'feriado_fk'] }
              )
              res.status(201).json({ message: 'Tarea creada correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // actualizar una tarea
    static async update (req, res){
        try {
        // capturar datos
        const { id } = req.params
        const { end_time, total_hours, id_holiday } = req.body
        // comprobar si existe
        const testkFound = await Tarea.findByPk(id)
        if (testkFound === null) {
            res.status(404).json({ message: 'Tarea no encontrada' })
        } else {
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