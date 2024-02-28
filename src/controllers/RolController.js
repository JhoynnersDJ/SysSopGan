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
            // enviar respuesta
            res.status(200).json(roles)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un rol segun su ID
    static async getById (req, res){
        try {
            // capturar id de rol
            const { id } = req.params
            // comprobar si existe
            const role = await Rol.findByPk(id)
            if (!role) {
                return res.status(404).json({message: 'Rol no encontrado'})
            }
            // enviar datos
            res.status(200).json(role)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default RolController