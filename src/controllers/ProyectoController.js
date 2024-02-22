import { Proyecto } from "../Modelo/Syssopgan/Asociaciones.js";
import { ClienteReplica } from "../Modelo/Syssopgan/ReplicaClienteModel.js";
import { ReplicaResponsableCliente } from "../Modelo/Syssopgan/ReplicaResponsableClienteModel.js";
import { ResponsableTecnico } from "../Modelo/Syssopgan/ResponsableTecnicoModel.js";
import { Usuario } from "../Modelo/Syssopgan/UsuarioModel.js";

class ProyectoController {
    // devuelve todos los proyectos
    static async index (req, res) {
        try {
            // Buscar todos los registros de proyecto junto al nombre del técnico responsable
            const projects = await Proyecto.findAll({
                include: [
                    {
                        model: ResponsableTecnico,
                        as: 'responsable_tecnico'
                    },
                    {
                        model: ClienteReplica,
                        as: 'cliente',
                        include: [
                            {
                                model: ReplicaResponsableCliente, // Incluye la asociación ReplicaResponsableCliente dentro de ClienteReplica
                                attributes: ['nombre_responsable_cl'] // Selecciona los atributos deseados de ReplicaResponsableCliente
                            }
                        ]
                    },
                    {
                        model: Usuario,
                        attributes: [
                            'nombre',
                            'apellido'
                        ]
                    }
                ]
            });
        
            if (!projects || projects.length === 0) {
                return res.status(500).json({ message: 'No hay proyectos registrados' });
            }
        
            const formattedProjects = projects.map(project => ({
                id_proyecto: project.dataValues.id_proyecto,
                tarifa: project.dataValues.tarifa,
                nombre_proyecto: project.dataValues.nombre_proyecto,
                id_responsable_tecnico_fk: project.dataValues.id_responsable_tecnico_fk,
                id_usuario_fk: project.dataValues.id_usuario_fk,
                id_cliente_fk: project.dataValues.id_cliente_fk,
                status: project.dataValues.status,
                fecha_inicio: project.dataValues.fecha_inicio,
                total_proyecto: project.dataValues.total_proyecto,
                nombre_responsable_tec: project.responsable_tecnico ? project.responsable_tecnico.dataValues.nombre_responsable_tec : null,
                nombre_cliente: project.cliente ? project.cliente.dataValues.nombre_cliente : null,
                nombre_responsable_cl: project.cliente && project.cliente.responsable_cliente ? project.cliente.responsable_cliente.nombre_responsable_cl : null,
                nombre_usuario: `${project.usuario.dataValues.nombre} ${project.usuario.dataValues.apellido}`
            }));
            console.log(projects);
            console.log(projects.cliente);

            res.status(200).json(formattedProjects);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un proyecto por su ID
    static async getById (req, res){
        try {
            // capturar datos
            const { id } = req.params
            // buscar el proyecto segun su id junto con el nombre del tecnico responable
            const project = await Proyecto.findByPk(id, {
                include: [
                    {
                      model: ResponsableTecnico,
                      attributes: [['nombre_responsable_tec', 'nombre']]
                    },
                    {
                      model: ClienteReplica,
                      attributes: [['nombre_cliente', 'nombre']]
                    },
                    {
                      model: Usuario,
                      attributes: [
                          'nombre',
                          'apellido'
                      ]
                    }
                  ]
              })
            // comprobar si existe el proyecto
            if (!project) {
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
            const { hourly_rate, name, id_technician, id_user, status, start_date, id_client} = req.body
            // comprobar si existe el responsable tecnico
            const technicianFound = await ResponsableTecnico.findByPk(id_technician)
            if (!technicianFound) {
                return res.status(404).json({message: 'Responsable técnico no encontrado'})
            }
            // comprobar si existe el usuario
            const userFound = await Usuario.findByPk(id_user)
            if (!userFound) {
                return res.status(404).json({message: 'Usuario no encontrado'})
            }
            // comprobar si existe el cliente
            const clientFound = await ClienteReplica.findByPk(id_client)
            if (!clientFound) {
                return res.status(404).json({message: 'Cliente no encontrado'})
            }
            // guardar en la base de datos
            await Proyecto.create(
                { tarifa: hourly_rate, nombre_proyecto: name, id_responsable_tecnico_fk:id_technician, id_usuario_fk:id_user, id_cliente_fk: id_client, status, fecha_inicio: start_date},
                { fields: ['tarifa', 'status', 'nombre_proyecto', 'id_responsable_tecnico_fk', 'id_usuario_fk',  'id_cliente_fk', 'fecha_inicio' ] }
            )
            res.status(201).json({message: 'Proyecto creado correctamente'});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // actualiza un proyecto
    static async update (req, res){
        try {
            // capturar datos
            const { id } = req.params
            const { hourly_rate, name, id_technician, id_user, status, start_date, id_client } = req.body
            // comprobar si existe el proyecto
            const projectFound = await Proyecto.findByPk(id)
            if (!projectFound) {
                return res.status(404).json({ message: 'Proyecto no encontrado' })
            } 
            // comprobar si existe el responsable tecnico
            const technicianFound = await ResponsableTecnico.findByPk(id_technician)
            if (!technicianFound) {
                return res.status(404).json({message: 'Responsable técnico no encontrado'})
            }
            // comprobar si existe el usuario
            const userFound = await Usuario.findByPk(id_user)
            if (!userFound) {
                return res.status(404).json({message: 'Usuario no encontrado'})
            }
            // comprobar si existe el cliente
            const clientFound = await ClienteReplica.findByPk(id_client)
            if (!clientFound) {
                return res.status(404).json({message: 'Cliente no encontrado'})
            }
            // guardar el proyecto en la base de datos
            await Proyecto.update(
            { tarifa: hourly_rate, nombre_proyecto: name, id_responsable_tecnico_fk:id_technician, id_usuario_fk:id_user, id_cliente_fk: id_client, status, fecha_inicio: start_date },
            { where: { id_proyecto: id } }
            )
            res.status(200).json({ message: 'Proyecto actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ProyectoController