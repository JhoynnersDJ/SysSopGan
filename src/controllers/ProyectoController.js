import date from 'date-and-time';
import { Proyecto } from "../Modelo/Syssopgan/Asociaciones.js";
import { ClienteReplica } from "../Modelo/Syssopgan/ReplicaClienteModel.js";
import { ReplicaResponsableCliente } from "../Modelo/Syssopgan/Asociaciones.js";
import { ResponsableTecnico } from "../Modelo/Syssopgan/ResponsableTecnicoModel.js";
import { Usuario } from "../Modelo/Syssopgan/UsuarioModel.js";
import {Tarea} from "../Modelo/Syssopgan/Asociaciones.js"
import { crearPDF } from "../libs/Pdfkit.js";

class ProyectoController {
    // devuelve todos los proyectos
    static async index(req, res) {
        try {
            // Buscar todos los registros de proyecto junto con los datos de los modelos asociados
            const projects = await Proyecto.findAll({
                include: [
                    {
                        model: ResponsableTecnico,
                        as: 'responsable_tecnico'
                    },
                    {
                        model: ReplicaResponsableCliente,
                        as: 'responsable_cliente',
                        include: [
                            {
                                model: ClienteReplica, // Incluye la asociación ClienteReplica dentro de ReplicaResponsableCliente 
                                as: 'cliente',
                                attributes: ['nombre_cliente'], // Selecciona los atributos deseados de ClienteReplica
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
            // si no hay proyectos registrados en la base de datos
            if (!projects || projects.length === 0) {
                return res.status(204).json({ message: 'No hay proyectos registrados', data: [] });
            }
            // formato de los datos para mayor legibilidad
            const formattedProjects = projects.map(project => ({
                id_proyecto: project.dataValues.id_proyecto,
                tarifa: project.dataValues.tarifa,
                total_proyecto: project.dataValues.total_proyecto,
                nombre_proyecto: project.dataValues.nombre_proyecto,
                status: project.dataValues.status,
                fecha_inicio: project.dataValues.fecha_inicio,
                id_responsable_tecnico_fk: project.dataValues.id_responsable_tecnico_fk,
                nombre_responsable_tec: project.responsable_tecnico ? project.responsable_tecnico.dataValues.nombre_responsable_tec : null,
                id_usuario_fk: project.dataValues.id_usuario_fk,
                nombre_usuario: `${project.usuario.dataValues.nombre} ${project.usuario.dataValues.apellido}`,
                id_responsable_cliente_fk: project.dataValues.id_responsable_cliente_fk,
                nombre_responsable_cl: project.responsable_cliente ? project.responsable_cliente.nombre_responsable_cl : null,
                nombre_cliente: project.responsable_cliente ? project.responsable_cliente.cliente.nombre_cliente : null,
            }))
            res.status(200).json(formattedProjects)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    // devuelve un proyecto por su ID
    static async getById(req, res) {
        try {
            // capturar id de proyecto
            const { id } = req.params
            // buscar el proyecto segun su id junto con los datos de sus modelos asociados
            const project = await Proyecto.findByPk(id, {
                include: [
                    {
                        model: ResponsableTecnico,
                        as: 'responsable_tecnico'
                    },
                    {
                        model: ReplicaResponsableCliente,
                        as: 'responsable_cliente',
                        include: [
                            {
                                model: ClienteReplica, // Incluye la asociación ClienteReplica dentro de ReplicaResponsableCliente 
                                as: 'cliente',
                                attributes: ['nombre_cliente'], // Selecciona los atributos deseados de ClienteReplica
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
            })
            // comprobar si existe el proyecto
            if (!project) {
                return res.status(404).json({ message: 'Proyecto no encontrado' })
            }
            res.status(200).json({
                id_proyecto: project.dataValues.id_proyecto,
                tarifa: project.dataValues.tarifa,
                total_proyecto: project.dataValues.total_proyecto,
                nombre_proyecto: project.dataValues.nombre_proyecto,
                status: project.dataValues.status,
                fecha_inicio: project.dataValues.fecha_inicio,
                id_responsable_tecnico_fk: project.dataValues.id_responsable_tecnico_fk,
                nombre_responsable_tec: project.responsable_tecnico ? project.responsable_tecnico.dataValues.nombre_responsable_tec : null,
                id_usuario_fk: project.dataValues.id_usuario_fk,
                nombre_usuario: `${project.usuario.dataValues.nombre} ${project.usuario.dataValues.apellido}`,
                id_responsable_cliente_fk: project.dataValues.id_responsable_cliente_fk,
                nombre_responsable_cl: project.responsable_cliente ? project.responsable_cliente.nombre_responsable_cl : null,
                nombre_cliente: project.responsable_cliente ? project.responsable_cliente.cliente.nombre_cliente : null,
            })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve los proyectos segun cliente
    static async getByClient(req, res) {
        try {
            // capturar id de cliente
            const { id } = req.params
            // comprobar si existe el cliente
            const clientFound = await ClienteReplica.findByPk(id)
            if (!clientFound) {
                return res.status(404).json({ message: 'Cliente no encontrado' })
            }
            // buscar el proyecto segun el id del cliente
            const projects = await Proyecto.findAll({
                include: [
                    {
                        model: ResponsableTecnico,
                        attributes: [['nombre_responsable_tec', 'nombre']]
                    },
                    {
                        model: ReplicaResponsableCliente,
                        attributes: [['nombre_responsable_cl', 'nombre']],
                        // se busca el cliente en el modelo ReplicaResponsableCliente
                        where: {
                            id_cliente_fk: id
                        },
                        include: [
                            {
                                model: ClienteReplica,
                                attributes: [
                                    ['nombre_cliente', 'nombre']
                                ]
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
            })
            // si no se encuentran proyectos
            if (!projects || projects.length === 0) {
                return res.status(204).json({message: 'Este cliente no tiene proyectos', data: []})
            }
            // formato de los datos para mayor legibilidad
            const formattedProjects = projects.map(project => ({
                id_proyecto: project.dataValues.id_proyecto,
                tarifa: project.dataValues.tarifa,
                total_proyecto: project.dataValues.total_proyecto,
                nombre_proyecto: project.dataValues.nombre_proyecto,
                status: project.dataValues.status,
                fecha_inicio: project.dataValues.fecha_inicio,
                id_responsable_tecnico_fk: project.dataValues.id_responsable_tecnico_fk,
                nombre_responsable_tec: project.responsable_tecnico ? project.responsable_tecnico.dataValues.nombre_responsable_tec : null,
                id_usuario_fk: project.dataValues.id_usuario_fk,
                nombre_usuario: `${project.usuario.dataValues.nombre} ${project.usuario.dataValues.apellido}`,
                id_responsable_cliente_fk: project.dataValues.id_responsable_cliente_fk,
                nombre_responsable_cl: project.responsable_cliente ? project.responsable_cliente.nombre_responsable_cl : null,
                nombre_cliente: project.responsable_cliente ? project.responsable_cliente.cliente.nombre_cliente : null,
            }))
            // enviar los datos
            res.status(200).json(formattedProjects)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve los proyectos segun usuario
    static async getByUser(req, res) {
        try {
            // capturar id de usuario
            const { id } = req.params
            // comprobar si existe el usuario
            const userFound = await Usuario.findByPk(id)
            if (!userFound) {
                return res.status(404).json({ message: 'Usuario no encontrado' })
            }
            // buscar el proyecto segun el id del usuario
            const projects = await Proyecto.findAll({
                where:{
                    id_usuario_fk: id
                },
                include: [
                    {
                        model: ResponsableTecnico,
                        attributes: [['nombre_responsable_tec', 'nombre']]
                    },
                    {
                        model: ReplicaResponsableCliente,
                        attributes: [['nombre_responsable_cl', 'nombre']],
                        include: [
                            {
                                model: ClienteReplica,
                                attributes: [
                                    'id_cliente',
                                    ['nombre_cliente', 'nombre']
                                ]
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
            })
            // si no se encuentran proyectos
            if (!projects || projects.length === 0) {
                return res.status(204).json({message: 'Este usuario no tiene proyectos', data: []})
            }
            // formato de los datos para mayor legibilidad
            const formattedProjects = projects.map(project => ({
                id_proyecto: project.dataValues.id_proyecto,
                tarifa: project.dataValues.tarifa,
                total_proyecto: project.dataValues.total_proyecto,
                nombre_proyecto: project.dataValues.nombre_proyecto,
                status: project.dataValues.status,
                fecha_inicio: project.dataValues.fecha_inicio,
                id_responsable_tecnico_fk: project.dataValues.id_responsable_tecnico_fk,
                nombre_responsable_tec: project.responsable_tecnico ? project.responsable_tecnico.dataValues.nombre_responsable_tec : null,
                id_usuario_fk: project.dataValues.id_usuario_fk,
                nombre_usuario: `${project.usuario.dataValues.nombre} ${project.usuario.dataValues.apellido}`,
                id_responsable_cliente_fk: project.dataValues.id_responsable_cliente_fk,
                nombre_responsable_cl: project.responsable_cliente ? project.responsable_cliente.nombre_responsable_cl : null,
                nombre_cliente: project.responsable_cliente ? project.responsable_cliente.cliente.nombre_cliente : null,
            }))
            // enviar los datos
            res.status(200).json(formattedProjects)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear un proyecto
    static async create(req, res) {
        try {
            // capturar datos
            const { tarifa, nombre, id_usuario, status, id_responsable_cliente } = req.body
            let { id_responsable_tecnico } = req.body
            // si id_responsible_technician es una cadena vacia
            if (id_responsable_tecnico === "") {
                id_responsable_tecnico = null
            }
            // verificar si id del tecnico responsable es null o undefined
            if ((id_responsable_tecnico != undefined) && !id_responsable_tecnico) {
                // comprobar si existe el responsable tecnico
                const technicianFound = await ResponsableTecnico.findByPk(id_responsable_tecnico)
                if (!technicianFound) {
                    return res.status(404).json({ message: 'Responsable técnico no encontrado' })
                }
            }
            // comprobar si existe el usuario
            const userFound = await Usuario.findByPk(id_usuario)
            if (!userFound) {
                return res.status(404).json({ message: 'Usuario no encontrado' })
            }
            // comprobar si existe el responsable cliente
            const responsableClienteFound = await ReplicaResponsableCliente.findByPk(id_responsable_cliente)
            if (!responsableClienteFound) {
                return res.status(404).json({ message: 'Responsable cliente no encontrado' })
            }
            // fecha de inicio
            const now = new Date()
            const fecha_inicio = date.format(now, 'YYYY-MM-DD')
            // guardar en la base de datos
            await Proyecto.create(
                { tarifa, nombre_proyecto: nombre, id_responsable_tecnico_fk: id_responsable_tecnico, id_usuario_fk: id_usuario, id_responsable_cliente_fk: id_responsable_cliente, status, fecha_inicio, total_proyecto:0 },
                { fields: ['tarifa', 'status', 'nombre_proyecto', 'id_responsable_tecnico_fk', 'id_usuario_fk', 'id_responsable_cliente_fk', 'fecha_inicio', 'total_proyecto'] }
            )
            res.status(201).json({ message: 'Proyecto creado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    // actualiza un proyecto
    static async update(req, res) {
        try {
            // capturar datos
            const { id } = req.params
            const { hourly_rate, name, id_user, status, start_date, id_client } = req.body
            let { id_responsible_technician } = req.body
            // comprobar si existe el proyecto
            const projectFound = await Proyecto.findByPk(id)
            if (!projectFound) {
                return res.status(404).json({ message: 'Proyecto no encontrado' })
            }
            // comprobar si existe el responsable tecnico
            const technicianFound = await ResponsableTecnico.findByPk(id_technician)
            if (!technicianFound) {
                return res.status(404).json({ message: 'Responsable técnico no encontrado' })
            }
            // si id_responsible_technician es una cadena vacia
            if (id_responsible_technician === "") {
                id_responsible_technician = null
            }
            // verificar si id del tecnico responsable es null o undefined
            if ((id_responsible_technician != undefined) && !id_responsible_technician) {
                // comprobar si existe el responsable tecnico
                const technicianFound = await ResponsableTecnico.findByPk(id_responsible_technician)
                if (!technicianFound) {
                    return res.status(404).json({ message: 'Responsable técnico no encontrado' })
                }
            }
            // comprobar si existe el usuario
            const userFound = await Usuario.findByPk(id_user)
            if (!userFound) {
                return res.status(404).json({ message: 'Usuario no encontrado' })
            }
            // comprobar si existe el cliente
            const clientFound = await ClienteReplica.findByPk(id_client)
            if (!clientFound) {
                return res.status(404).json({ message: 'Cliente no encontrado' })
            }
            // guardar el proyecto en la base de datos
            await Proyecto.update(
                { tarifa: hourly_rate, nombre_proyecto: name, id_responsable_tecnico_fk: id_responsible_technician, id_usuario_fk: id_user, id_cliente_fk: id_client, status, fecha_inicio: start_date },
                { where: { id_proyecto: id } }
            )
            res.status(200).json({ message: 'Proyecto actualizado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // eliminar un proyecto
    static async delete(req, res) {
        try {
            // capturar id de proyecto
            const { id } = req.params
            // comprobar si existe el proyecto
            const projectFound = await Proyecto.findByPk(id)
            if (!projectFound) {
                return res.status(404).json({ message: 'Proyecto no encontrado' })
            }
            // eliminar un proyecto de la base de datos
            await Proyecto.destroy(
                { where: { id_proyecto: id } }
            )
            res.status(200).json({ message: 'Proyecto eliminado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Generar PDF de proyecto
    static async pdf(req, res) {
        try {
            // capturar datos
            const { id } = req.params
            // buscar el proyecto segun su id junto con el nombre del tecnico responable
            const project = await Proyecto.findByPk(id, {
                include: [
                    {
                        model: Tarea,
                        attributes: [['hora_inicio', 'hora_fin']]
                    },
                ]
            })
            // comprobar si existe el proyecto
            if (!project) {
                return res.status(404).json({ message: 'Proyecto no encontrado' })
            }
            res.status(200).json(project)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Generar GRAFICOS de proyecto
    static async graph(req, res) {
        try {
            // capturar datos
            const { id } = req.params
            // buscar el proyecto segun su id junto con las horas totales
            const project = await Proyecto.findByPk(id, {
                include: [
                    {
                        model: Tarea,
                        attributes: [['total_hora', 'total_hora']]
                    }
                ]
            })
            // comprobar si existe el proyecto
            if (!project) {
                return res.status(404).json({ message: 'Proyecto no encontrado' })
            }
            res.status(200).json(project)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}


export default ProyectoController