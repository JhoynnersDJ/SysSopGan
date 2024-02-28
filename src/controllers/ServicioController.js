import { Servicio } from "../Modelo/Syssopgan/ServicioModel.js";

class ServicioController {
    // devuelve todos los servicios
    static async index (req, res) {
        try {
            // buscar todos los registros
            const services = await Servicio.findAll()
            if (!services) {
                return res.status(500).json({message: 'No hay servicios registrados'})
            }
            res.status(200).json(services)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un servicio segun su ID
    static async getById (req, res){
        try {
            // capturar id de servicio
            const { id } = req.params
            // comprobar si existe
            const service = await Servicio.findByPk(id)
            if (!service) {
                return res.status(404).json({message: 'Servicio no encontrado'})
            }
            res.status(200).json(service)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear un servicio
    static async create (req, res){
        try {
            // capturar datos
            const {id_servicio, nombre, descripcion, tipo, categoria, plataforma } = req.body
            // guardar en la base de datos
            await Servicio.create(
                { id_servicio, nombre, descripcion, tipo, categoria, plataforma},
                { fields: ['id_servicio','nombre', 'descripcion', 'tipo', 'categoria', 'plataforma'] }
              )
            res.status(201).json({ message: 'Servicio creado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // actualiza un servicio
    static async update (req, res){
        try {
            // capturar datos
            const { id } = req.params
            const { name, description, type, category, platform } = req.body
            // comprobar si existe
            const activityFound = await Servicio.findByPk(id)
            if (!activityFound) {
                return res.status(404).json({ message: 'Servicio no encontrado' })
            }
            // guardar en la base de datos
            await Servicio.update(
            { nombre: name, descripcion:description, tipo: type, categoria: category, plataforma: platform },
            { where: { id_servicio: id } }
            )
            res.status(200).json({ message: 'Servicio actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ServicioController