import Actividad from "../Modelo/ActividadModel.js";

class ActividadController {
    // devuelve todas las actividades
    static async index (req, res) {
        try {
            // buscar todos los registros
            const activities = await Actividad.findAll()
            res.status(200).json(activities)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve una actividad segun su ID
    static async getById (req, res){
        try {
            // capturar datos
            const { id } = req.params
            // comprobar si existe
            const activity = await Actividad.findByPk(id)
            if (activity === null) {
                return res.status(404).json({message: 'Actividad no encontrada'})
            }
            res.status(200).json(activity)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear una actividad
    static async create (req, res){
        try {
            // capturar datos
            const { name, description, type, category, platform } = req.body
            // instanciar el objeto y guardarlo en la base de datos
            const activity = await Actividad.create(
                { nombre: name, descripcion:description, tipo: type, categoria: category, plataforma: platform},
                { fields: ['nombre', 'descripcion', 'tipo', 'categoria', 'plataforma'] }
              )
              res.status(201).json({ message: 'Actividad creada correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // actualiza una actividad
    static async update (req, res){
        try {
        // capturar datos
        const { id } = req.params
        const { name, description, type, category, platform } = req.body
        // comprobar si existe
        const activityFound = await Actividad.findByPk(id)
        if (activityFound === null) {
            res.status(404).json({ message: 'Actividad no encontrada' })
        } else {
            await Actividad.update(
            { nombre: name, descripcion:description, tipo: type, categoria: category, plataforma: platform },
            { where: { id_actividad: id } }
            )
            res.status(200).json({ message: 'Actividad actualizada correctamente' })
        }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ActividadController