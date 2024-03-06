import date from 'date-and-time';
import fs from 'fs';
import { Proyecto } from "../Modelo/Syssopgan/Asociaciones.js";
import { ClienteReplica } from "../Modelo/Syssopgan/ReplicaClienteModel.js";
import { ReplicaResponsableCliente } from "../Modelo/Syssopgan/Asociaciones.js";
import { ResponsableTecnico } from "../Modelo/Syssopgan/ResponsableTecnicoModel.js";
import { Usuario } from "../Modelo/Syssopgan/UsuarioModel.js";
import {Tarea} from "../Modelo/Syssopgan/Asociaciones.js"
import { crearPDF } from "../libs/Pdfkit.js";
import {Servicio} from "../Modelo/Syssopgan/ServicioModel.js"
import puppeteer from 'puppeteer';

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
                cedula: project.cliente ? project.cliente.cedula: null,
                cedula_responsable_tec: project.responsable_tecnico ? project.responsable_tecnico.cedula : null,

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
        const { tarifa, id_usuario, status, id_responsable_cliente, nombre } = req.body
        let { id_responsable_tecnico } = req.body

        // eliminar espacios en blanco del string
        const nombreProyecto = nombre.trim();

        // si id_responsible_technician es una cadena vacia
        if (id_responsable_tecnico === "") {
            id_responsable_tecnico = null;
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

        // verificar que no exista otro proyecto con el mismo nombre para el mismo cliente
        const proyectoExistente = await Proyecto.findOne({
            where: {
                nombre_proyecto: nombre,
                id_responsable_cliente_fk: id_responsable_cliente
            }
        })

        if (proyectoExistente) {
            return res.status(400).json({ message: 'El responsable cliente ya tiene un proyecto con el mismo nombre' })
        }

        // fecha de inicio
        const now = new Date()
        const fecha_inicio = date.format(now, 'YYYY-MM-DD')

        // guardar en la base de datos
        await Proyecto.create(
            { tarifa, nombre_proyecto: nombre, id_responsable_tecnico_fk: id_responsable_tecnico, id_usuario_fk: id_usuario, id_responsable_cliente_fk: id_responsable_cliente, status, fecha_inicio, total_proyecto: 0 },
            { fields: ['tarifa', 'status', 'nombre_proyecto', 'id_responsable_tecnico_fk', 'id_usuario_fk', 'id_responsable_cliente_fk', 'fecha_inicio', 'total_proyecto'] }
        )

        // Contar los proyectos asociados al usuario
        const contadorProyectos = await Proyecto.count({
            where: { id_usuario_fk: id_usuario }
        });

        // Actualizar el contador en la tabla de usuarios
        await Usuario.update(
            { contador_proyectos: contadorProyectos },
            { where: { id_us: id_usuario } }
        );

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
                        attributes: ['id_tarea','fecha','hora_inicio', 'hora_fin','total_hora'],
                        include: [
                            {
                                model: Servicio,
                                attributes: ['nombre']
                            }
                        ]
                    },
                    {
                        model: ReplicaResponsableCliente ,
                        attributes: ['nombre_responsable_cl'],
                        include: [
                            {
                                model: ClienteReplica, // Incluye la asociación ReplicaResponsableCliente dentro de ClienteReplica
                                attributes: ['nombre_cliente'], // Selecciona los atributos deseados de ReplicaResponsableCliente
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
            // comprobar si existe el proyecto
            if (project == null) {
                return res.status(404).json({ message: 'Proyecto no Seleccionado' })
            }
            if (!project) {
                return res.status(404).json({ message: 'Proyecto no encontrado' })
            }
            // Generar el PDF y obtener la ruta del archivo
            const pdfPath = await crearPDF(id, project);

            const pdfContent = fs.readFileSync(pdfPath);
            res.contentType('application/pdf');
            res.send(pdfContent);

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
            res.sendFile(path.resolve(dirname, pdfPath));
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }



    

    static async generarPDFProyectoSimple(req, res) {
        try {
            // Capturar el id_proyecto de los parámetros de la solicitud
            const { id } = req.params;
    
            // Verificar si se proporcionó el id_proyecto
            if (!id) {
                return res.status(400).json({ message: 'Falta el parámetro id_proyecto' });
            }
    
            const project = await Proyecto.findByPk(id, {
                include: [
                    {
                        model: Tarea,
                        attributes: ['id_tarea', 'fecha', 'hora_inicio', 'hora_fin', 'total_hora', 'total_tarifa'],
                        include: [
                            {
                                model: Servicio,
                                attributes: ['nombre']
                            }
                        ]
                    },
                    {
                        model: ReplicaResponsableCliente,
                        attributes: ['nombre_responsable_cl'],
                        include: [
                            {
                                model: ClienteReplica,
                                attributes: ['nombre_cliente, cargo'],
                            }
                        ]
                    },
                    {
                        model: ResponsableTecnico, // Aquí se incluye la relación con responsable_tecnico
                        attributes: ['nombre_responsable_tec'] // Ajusta esto según las propiedades de tu modelo
                    },
                    {
                        model: Usuario,
                        attributes: ['nombre', 'apellido']
                    }
                ]
            });
            // Comprobar si el proyecto existe
            if (!project) {
                return res.status(404).json({ message: 'Proyecto no encontrado' });
            }
            console.log(project);
        // Configurar el contenido HTML que se va a renderizar en el PDF
        const content = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Reporte</title>
        </head>
        
        <body>
            <div class="flex flex-col justify-between my-8 mx-8">
                <!-- Encabezado -->
                <div class="flex justify-between items-center border-2 border-sky-500 rounded-2xl px-4">
                    <!-- Logo -->
                    <div class="flex p-4">
                <img src="public/images/bytescolor.png" alt="Logo" class="w-full h-14">
                    </div>
                    <!-- Titulo -->
                    <div class="p-4">
                        <h1 class="text-xl font-bold text-center text-gray-800">Reporte de Atencion al Cliente</h1>
                    </div>
                    <!-- Datos Solicitud -->
                    <div class="text-right border-l-2 h-24 border-sky-500 flex flex-col p-4 justify-center">
                        <p
                        class="text-sm font-bold text-gray-800"
                        >Fecha:
                            <span class="font-normal">
                                12/12/2020
                            </span>
                        </p>
                        <p class="text-sm font-bold text-gray-800">
                            Codigo Proyecto:
                            <span class="font-normal">
                                123456
                            </span>
                        </p>
                    </div>
                </div>
                <!-- Datos del Cliente -->
                <h6 class="text-left font-bold">
                <div class="flex justify-between items-center border-2 border-sky-500 rounded-2xl">
                <div class="flex flex-col w-1/2 gap-y-2 py-2">
                    <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                        Nombre: 
                        <span class="font-normal">${project.responsable_cliente.cliente.nombre_responsable_cl}</span>
    
                    </p>
                        </p>
                        <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                            Codigo Cliente:
                            <span class="font-normal">
                                123456
                            </span>
                        </p>
                        <p class="text-sm font-bold text-gray-800 px-2">
                            Departamento:
                            <span class="font-normal">
                                Informatica
                            </span>
                        </p>
                    </div>
                    <div class="flex flex-col border-l-2 w-1/2 border-sky-500 gap-y-2 py-2">
                       <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                            Responsable Cliente:
                            <span class="font-normal">
                            ${project.responsable_cliente.nombre_responsable_cl}
                            </span>
                        </p>
                        <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                            Cargo:
                            <span class="font-normal">
                            ${project.responsable_cliente.cargo}
                            </span>
                        </p>
                        <p class="text-sm font-bold text-gray-800 px-2">
                            Telefono:
                            <span class="font-normal">
                                0412-1234567
                            </span>
                       </p> 
                    </div>
                </div>
                <!-- Datos del Proyecto  -->
                <h6 class="text-left font-bold">
                    2. Datos del Proyecto
                </h6>
                <div class="flex flex-col gap-y-2 py-2 border-2 border-sky-500 rounded-2xl">
                    <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                        Nombre del Proyecto:
                        <span class="font-normal">
                        ${project.nombre_proyecto}
                        </span>
                    </p>
                    <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                        Fecha de Inicio:
                        <span class="font-normal">
                        ${project.fecha_inicio}
                        </span>
                    </p>
                    <p class="text-sm font-bold text-gray-800 px-2 border-b-[1px] border-gray-600">
                        Tarifa por Hora:
                        <span class="font-normal">
                        ${project.tarifa}
                        </span>
                    </p>
                    <p class="text-sm font-bold text-gray-800 px-2">
                        Tecnico Asignado:
                        <span class="font-normal">
                        ${project.usuario.nombre} ${project.usuario.apellido}
                        </span>
                    </p>
                </div>
                <!-- Detalles del Proyecto -->
                <h6 class="text-left font-bold">
                    3. Detalles del Proyecto
                </h6>
                <div class="flex flex-col gap-y-2 py-2 border-2 border-sky-500 rounded-2xl">
                    <!-- Encabezado de la tabla explicando la Leyenda de la columna estatus -->
                    <p class="text-xs text-gray-800 text-center px-2">
                        Leyenda Columna Estatus:  C= Actividad Culminada /  P= Actividad Pendiente
                    </p>
                    <p class="text-xs text-gray-800 text-center px-2">
                        Horario Oficina <span class="font-bold" >
                            (HO) : Factor = 1
                        </span> / Extrahorario 
                        
                        <span class="font-bold" >
                            (EH) : Factor = 1,5
                        </span>/ Dom y feriado <span class="font-bold" >
                            (DF): Factor = 2
                        </span>
                    </p>
                    <div class="overflow-x-auto px-2">
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-sky-500 text-sky-100">
                            <tr>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border">Servicio</th>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border">Fecha</th>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border">Hora Inicio</th>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border">Hora Fin</th>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border">Total Horas</th>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border">Valor de las Horas con Factor</th>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border">Estatus</th>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border">Total Tarifa</th>
                            </tr>
                          </thead>
                          <tbody class="bg-white divide-y divide-gray-200 text-gray-800">
                          <!-- Iterar sobre las tareas -->
                          ${project.tareas.map(tarea => `
                            <tr>
                              <td class="px-2 py-4 whitespace-nowrap text-sm font-normal text-gray-800 text-center border">${tarea.servicio.nombre}</td>
                              <td class="px-2 py-4 whitespace-nowrap text-sm font-normal text-gray-800 text-center border">${tarea.fecha}</td>
                              <td class="px-2 py-4 whitespace-nowrap text-sm font-normal text-gray-800 text-center border">${tarea.hora_inicio}</td>
                              <td class="px-2 py-4 whitespace-nowrap text-sm font-normal text-gray-800 text-center border">${tarea.hora_fin}</td>
                              <td class="px-2 py-4 whitespace-nowrap text-sm font-normal text-gray-800 text-center border">${tarea.total_hora}</td>
                              <td class="px-2 py-4 whitespace-nowrap text-sm font-normal text-gray-800 text-center border">4</td>
                              <td class="px-2 py-4 whitespace-nowrap text-sm font-normal text-gray-800 text-center border">s</td>
                              <td class="px-2 py-4 whitespace-nowrap text-sm font-normal text-gray-800 text-center border">${tarea.total_tarifa}</td>
                            </tr>
                            `).join('')}
                          </tbody>
                          <tfoot class="">
                            <tr class="bg-white border-[1px]">
                              <th scope="col" class="px-2 py-3 "></th>
                              <th scope="col" class="px-2 py-3 "></th>
                              <th scope="col" class="px-2 py-3 "></th>
                              <th scope="col" class="px-2 py-3 "></th>
                              <th scope="col" class="px-2 py-3 "></th>
                              <th scope="col" class="px-2 py-3 "></th>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border-2  border-sky-500 bg-sky-500 text-sky-100">Total de Horas</th>
                              <th scope="col" class="px-2 py-3 text-xs font-bold tracking-wider text-center border">16</th>
                            </tr>
                        </table>
                      </div>
                </div>
                <!-- Aceptacion -->
                <h6 class="text-left font-bold">
                    4. Aceptacion
                </h6>
                <div class="flex justify-between items-center border-2 border-sky-500 rounded-2xl">
                    <div class="flex flex-col gap-y-2 py-2 w-1/2">
                        <h6 class="text-left font-bold pl-2">
                            Por el Cliente:
                        </h6>
                        <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                            Nombre del Cliente: 
                            <span class="font-normal">
                            ${project.responsable_cliente.nombre_responsable_cl}
                            </span>
                        </p>
                        <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                            C.I:
                            <span class="font-normal">
                                123456
                            </span>
                        <p class="text-sm font-bold text-gray-800 px-2">
                            Firma: 
                            <span class="font-normal">
                                ________
                            </span>
                        </p>
                    </div>
                    <div class="flex flex-col gap-y-2 py-2 w-1/2 border-l-2 border-sky-500">
                        <h6 class="text-left font-bold pl-2">
                            Por el Tecnico:
                        </h6>
                        <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                            Nombre del Tecnico: 
                            <span class="font-normal">
                            ${project.responsable_tecnico.nombre_responsable_tec}
                            </span>
                        </p>
                        <p class="text-sm font-bold text-gray-800 border-b-[1px] border-gray-600 px-2">
                            C.I:
                            <span class="font-normal">
                                123456
                            </span>
                        <p class="text-sm font-bold text-gray-800 px-2">
                            Firma: 
                            <span class="font-normal">
                                ________
                            </span>
                        </p>
                    </div>
                </div>
                <!-- Cierre -->
                <div class="flex flex-col gap-y-2 my-4 py-2 border-2 border-sky-500 rounded-2xl">
                    <p class="p-2">
                        Al firmar este reporte como receptor del servicio prestado, el cliente acepta y está conforme con el
                        mismo, así como que ha verificado su efectiva ejecución. Los términos para el posterior pago de la
                        correspondiente factura, si el caso amerita, será según las tarifas vigentes para el tipo de servicio
                        prestado y/o cotizado, previamente autorizado por el Cliente.
                    </p>
                </div>
            </div>
        </div>
        </body>
        
        </html>
        `;

        // Crear una instancia del navegador con Puppeteer
        const browser = await puppeteer.launch();

        // Abrir una nueva página
        const page = await browser.newPage();

        // Establecer el contenido HTML de la página
        await page.setContent(content);

        // Generar el PDF en formato A4
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        // Cerrar el navegador
        await browser.close();

        // Enviar el PDF como respuesta HTTP
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

    // Método para generar y enviar el PDF al cliente
    static async generarPDFNombreProyecto(req, res) {
        try {
            // Generar el PDF
            const pdfBuffer = await ProyectoController.generarPDFProyectoSimple();

            // Configurar la respuesta como un PDF
            res.setHeader('Content-Type', 'application/pdf');

            // Enviar el PDF al cliente
            res.send(pdfBuffer);
        } catch (error) {
            // Enviar un error si ocurre algún problema
            console.error('Error al generar el PDF:', error);
            res.status(500).json({ message: 'Error al generar el PDF' });
        }
    }
}


export default ProyectoController