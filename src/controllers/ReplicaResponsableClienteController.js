import { ReplicaResponsableCliente } from "../Modelo/Syssopgan/ReplicaResponsableClienteModel.js";
import { ResponsableCliente } from "../Modelo/Cliente/ResponsableClienteModel.js";
import { Cliente } from "../Modelo/Cliente/ClienteModel.js";
import { ClienteReplica } from "../Modelo/Syssopgan/ReplicaClienteModel.js";

class ReplicaResponsableClienteController {
    // devuelve todas los responsables clientes
    static async index (req, res) {
        try {
            // buscar todos los registros
            const responsibles_client = await ReplicaResponsableCliente.findAll()
            // si no hay responsables cliente
            if (!responsibles_client) {
                return res.status(500).json({message: 'No hay clientes registrados en la base de datos'})
            }
            // enviar datos
            res.status(200).json(responsibles_client)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un responsable cliente segun su ID
    static async getById (req, res){
        try {
            // capturar id de responsable cliente
            const { id } = req.params
            // comprobar si existe
            const responsible_client = await ReplicaResponsableCliente.findByPk(id)
            if (!responsible_client) {
                return res.status(404).json({message: 'Cliente no encontrado'})
            }
            // envia datos
            res.status(200).json(responsible_client)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve los responsables cliente de un cliente
    static async getByClient (req, res){
        try {
            // capturar id de cliente
            const { id } = req.params
            // comprobar si existe el cliente
            const clientFound = await ClienteReplica.findByPk(id)
            if (!clientFound) {
                return res.status(404).json({ message: 'Cliente no encontrado' })
            }
            // obtener todos los responsables cliente de un cliente
            const responsibles_client = await ReplicaResponsableCliente.findAll({
                attributes: [
                    'id_responsable_cliente',
                    ['nombre_responsable_cl', 'nombre'],
                    'cargo',
                    'id_cliente_fk'
                ],
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
            })
            // si no se encuentran tareas
            if (responsibles_client.length === 0 || !responsibles_client) {
                return res.status(500).json({message: 'Este cliente no tiene responsables'})
            }
            // formato los datos para mayor legibilidad
          
            // enviar los datos
            res.status(200).json(responsibles_client)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }    

    // Crear un responsable de cliente
    static async create(req, res) {
        try {
            // Capturar datos
            const { nombre_responsable_cl, cargo, id_cliente_fk } = req.body;

            // Verificar si el cliente existe
            const cliente = await Cliente.findByPk(id_cliente_fk);
            if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
            }

        // Guardar en la base de datos
        await ResponsableCliente.create({
            nombre_responsable_cl: nombre_responsable_cl,
            cargo: cargo,
            id_cliente_fk: id_cliente_fk
        });

        res.status(201).json({ message: 'Responsable de cliente registrado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
}

export default ReplicaResponsableClienteController