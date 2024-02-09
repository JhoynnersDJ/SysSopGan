import Proyecto from "../../Modelo/ProyectoModel.js";

class ProyectoController {
    // devuelve todos los proyectos
    static async index (req, res) {
        try {
            const proyectos = await Proyecto.findAll()
            res.status(200).json(proyectos)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un proyecto por su ID
    static async getById (req, res){
        try {
            const { id } = req.params
            // comprobar si existe
            const proyecto = await Proyecto.findByPk(id)
            if (proyecto === null) {
                return res.status(404).json({message: 'Id de proyecto incorrecto'})
            }
            res.status(200).json(proyecto)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear un proyecto
    static async create (req, res){
        try {
            const { tarifa, nombre_proyecto, id_tecnico, id_usuario, status } = req.body
            // instanciar el objeto y guardarlo en la base de datos
            const proyecto = await Proyecto.create(
                { tarifa, nombre_proyecto, id_responsable_tecnico_fk:id_tecnico, id_usuario_fk:id_usuario, status },
                { fields: ['tarifa', 'status', 'nombre_proyecto', 'id_responsable_tecnico_fk', 'id_usuario_fk'] }
              )
              res.status(201).json({ message: 'Proyecto creado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ProyectoController


