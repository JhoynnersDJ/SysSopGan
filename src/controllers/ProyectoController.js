import { Proyecto } from "../Modelo/Syssopgan/Asociaciones.js";
import { ClienteReplica } from "../Modelo/Syssopgan/ReplicaClienteModel.js";
import { ResponsableTecnico } from "../Modelo/Syssopgan/ResponsableTecnicoModel.js";
import { Usuario } from "../Modelo/Syssopgan/UsuarioModel.js";
import {Tarea} from "../Modelo/Syssopgan/Asociaciones.js"
import { crearPDF } from "../libs/Pdfkit.js";

class ProyectoController {
    // devuelve todos los proyectos
    static async index (req, res) {
        try {
            // buscar todos los registros de proyecto junto al nombre del tecnico responsable
            const projects = await Proyecto.findAll({
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
            if (!projects) {
                return res.status(500).json({message: 'No hay proyectos registrados'})
            }
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

    // Generar PDF de proyecto

    static async pdf (req, res){
        try {
            // capturar datos
            const { id } = req.params
            // buscar el proyecto segun su id junto con las tareas correspondientes
            const project = await Proyecto.findByPk(id, {
                include: [
                    {
                      model: Tarea,
                      attributes: [['fecha',
                      'hora_inicio',
                      'hora_fin',
                      'total_hora',
                      'id_servicio_fk',]]
                    }
                  ]
              })
            // comprobar si existe el proyecto
            if (!project) {
                return res.status(404).json({message: 'Proyecto no encontrado'})
            }
            // crea el PDF despues de que se confirma el Id de Proyecto
            const stream = res.writeHead(200, {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=Reportes.pdf"
            })
    
            crearPDF(
            (data) => stream.write(data),
            () => stream.end()
            )

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

 // Generar GRAFICOS de proyecto

    static async graph (req, res){
        try {
            // capturar datos
            const { id } = req.params
            // buscar el proyecto segun su id junto con las horas totales
            const project = await Proyecto.findByPk(id, {
                include: [
                    {
                      model: Tarea,
                      attributes: [[
                      'total_hora',]]
                    }
                  ]
              })
            // comprobar si existe el proyecto
            if (!project) {
                return res.status(404).json({message: 'Proyecto no encontrado'})
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
export default ProyectoController