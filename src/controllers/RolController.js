import { Rol } from "../Modelo/Syssopgan/RolModel.js";

class RolController {

    // devuelve todos los roles
    static async index (req, res) {
        try {
            // buscar todos los registros
            const roles = await Rol.findAll()
            if (!roles) {
                return res.status(500).json({message: 'No hay roles registrados'})
            }
            res.status(200).json(roles)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un rol segun su ID
    static async getById (req, res){
        try {
            // capturar datos
            const { id } = req.params
            // comprobar si existe
            const role = await Rol.findByPk(id)
            if (!role) {
                return res.status(404).json({message: 'Rol no encontrado'})
            }
            res.status(200).json(role)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear un rol
    static async create (req, res){
        try {
            // capturar datos
            const { name, description } = req.body
            // instanciar el objeto y guardarlo en la base de datos
            const role = await Rol.create(
                { nombre: name, descripcion:description },
                { fields: ['nombre', 'descripcion'] }
            )
            res.status(201).json({ message: 'Rol creado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // actualiza un rol
    static async update (req, res){
        try {
        // capturar datos
        const { id } = req.params
        const { name, description } = req.body
        // comprobar si existe
        const roleFound = await Rol.findByPk(id)
        if (!roleFound) {
            return res.status(404).json({ message: 'Rol no encontrado' })
        } else {
            await Rol.update(
            { nombre: name, descripcion:description },
            { where: { id_rol: id } }
            )
            res.status(200).json({ message: 'Rol actualizado correctamente' })
        }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default RolController