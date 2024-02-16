import Proyecto from "../Modelo/ProyectoModel.js";

class ProyectoController {
    // devuelve todos los proyectos
    static async index (req, res) {
        try {
            // buscar todos los registros
            const projects = await Proyecto.findAll()
            res.status(200).json(projects)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un proyecto por su ID
    static async getById (req, res){
        try {
            // capturar datos
            const { id } = req.params
            // comprobar si existe
            const project = await Proyecto.findByPk(id)
            if (project === null) {
                return res.status(404).json({message: 'Proyecto no encontrado'})
            }
            res.status(200).json(project)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear un proyecto
    static async create (req, res){
        try {
            // capturar datos
            const { hourly_rate, name, id_technician, id_user, status } = req.body
            // instanciar el objeto y guardarlo en la base de datos
            await Proyecto.create(
                { tarifa: hourly_rate, nombre_proyecto: name, id_responsable_tecnico_fk:id_technician, id_usuario_fk:id_user, status },
                { fields: ['tarifa', 'status', 'nombre_proyecto', 'id_responsable_tecnico_fk', 'id_usuario_fk'] }
              )
              res.status(201).json({ message: 'Proyecto creado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // actualiza un proyecto
    static async update (req, res){
        try {
        // capturar datos
        const { id } = req.params
        const { hourly_rate, name, id_technician, id_user, status } = req.body
        // comprobar si existe
        const projectFound = await Proyecto.findByPk(id)
        if (projectFound === null) {
            res.status(404).json({ message: 'Proyecto no encontrado' })
        } else {
            await Proyecto.update(
            { tarifa: hourly_rate, nombre_proyecto: name, id_responsable_tecnico_fk:id_technician, id_usuario_fk:id_user, status },
            { where: { id_proyecto: id } }
            )
            res.status(200).json({ message: 'Proyecto actualizado correctamente' })
        }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ProyectoController

// Proyecto.findAll({
//     attributes: [
//         'tarifa',
//       [sequelize.col("Responsable_Tecnico.cargo")]
//     ],
//     include: [
//       {
//         model: ResponsableTecnico
//       }
//     ],
//   })