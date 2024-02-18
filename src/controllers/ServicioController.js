import { Servicio } from "../Modelo/Syssopgan/ServicioModel.js";

class ServicioController {
    // devuelve todas las actividades
    static async index (req, res) {
        try {
            // buscar todos los registros
            const services = await Servicio.findAll()
            if (!services) {
                return res.status(500).json({message: 'No hay actividades registradas'})
            }
            res.status(200).json(services)
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
            const service = await Servicio.findByPk(id)
            if (!service) {
                return res.status(404).json({message: 'Actividad no encontrada'})
            }
            res.status(200).json(service)
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
            await Servicio.create(
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
            const activityFound = await Servicio.findByPk(id)
            if (!activityFound) {
                return res.status(404).json({ message: 'Actividad no encontrada' })
            }
            await Servicio.update(
            { nombre: name, descripcion:description, tipo: type, categoria: category, plataforma: platform },
            { where: { id_actividad: id } }
            )
            res.status(200).json({ message: 'Actividad actualizada correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ServicioController