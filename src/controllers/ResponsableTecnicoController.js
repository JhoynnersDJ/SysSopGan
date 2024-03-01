import {ResponsableTecnico} from "../Modelo/Syssopgan/ResponsableTecnicoModel.js";

class ResponsableTecnicoController {
    // devuelve todos los responsables tecnicos
    static async index (req, res) {
        try {
            // buscar todos los registros
            const technicians = await ResponsableTecnico.findAll()
            if (!technicians) {
                return res.status(204).json({message: 'No hay responsables técnicos registrados', data: []})
            }
            // enviar respuesta
            res.status(200).json(technicians)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un responsable segun el ID
    static async getById (req, res){
        try {
            // capturar id de responsable tecnico
            const { id } = req.params
            // comprobar si existe
            const technician = await ResponsableTecnico.findByPk(id)
            if (!technician) {
                return res.status(404).json({message: 'Técnico responsable no encontrado'})
            }
            // enviar respuesta
            res.status(200).json(technician)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear un registro del tecnico responsable
    static async create (req, res){
        try {
            // capturar datos
            const { nombre, cargo, email, num_tel } = req.body
            // guardar en la base de datos
            await ResponsableTecnico.create(
                { nombre_responsable_tec: nombre, cargo, email, num_tel },
                { fields: ['nombre_responsable_tec', 'cargo', 'email', 'num_tel'] }
            )
            res.status(201).json({ message: 'Técnico responsable registrado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // actualizar un tecnico responsable
    static async update (req, res){
        try {
            // capturar datos
            const { id } = req.params
            const { nombre, cargo, email, num_tel } = req.body
            // comprobar si existe
            const technicianFound = await ResponsableTecnico.findByPk(id)
            if (!technicianFound) {
                return res.status(404).json({ message: 'Técnico responsable no encontrado' })
            }
            // guardar en la base de datos
            await ResponsableTecnico.update(
                { nombre_responsable_tec: nombre, cargo, email, num_tel },
                { where: { id_responsable_tec: id } }
            )
            res.status(200).json({ message: 'Técnico responsable actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ResponsableTecnicoController