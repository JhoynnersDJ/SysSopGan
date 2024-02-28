import { ReplicaResponsableCliente } from "../Modelo/Syssopgan/ReplicaResponsableClienteModel.js";
import { ResponsableCliente } from "../Modelo/Cliente/ResponsableClienteModel.js";
import { Cliente } from "../Modelo/Cliente/ClienteModel.js";
import { ClienteReplica } from "../Modelo/Syssopgan/ReplicaClienteModel.js";

class ReplicaResponsableClienteController {
    // devuelve todos los responsables clientes
    static async index (req, res) {
        try {
            // buscar todos los registros
            const responsibles_client = await ReplicaResponsableCliente.findAll({
                include: [
                    {
                        model: ClienteReplica,
                        attributes: [
                            ['nombre_cliente', 'nombre']
                        ]
                    }
                ]
            })
            // si no hay responsables cliente
            if (!responsibles_client) {
                return res.status(204).json({message: 'No hay clientes registrados en la base de datos', data: []})
            }
            // formato de los datos para mayor legibilidad
            const FormatedResponsiblesClient = responsibles_client.map(responsible => ({
                id_responsable_cliente: responsible.dataValues.id_responsable_cliente,
                nombre: responsible.dataValues.nombre_responsable_cl,
                cargo: responsible.dataValues.cargo,
                id_cliente_fk: responsible.dataValues.id_cliente_fk,
                nombre_cliente: responsible.dataValues.cliente ? responsible.cliente.dataValues.nombre : null,
            }))
            // enviar datos
            res.status(200).json(FormatedResponsiblesClient)
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
            const responsible_client = await ReplicaResponsableCliente.findByPk(id,{
                include: [
                    {
                        model: ClienteReplica,
                        attributes: [
                            'nombre_cliente'
                        ]
                    }
                ]
            })
            if (!responsible_client) {
                return res.status(404).json({message: 'Cliente no encontrado'})
            }
            // envia datos
            res.status(200).json({
                id_responsable_cliente: responsible_client.dataValues.id_responsable_cliente,
                nombre: responsible_client.dataValues.nombre_responsable_cl,
                cargo: responsible_client.dataValues.cargo,
                id_cliente_fk: responsible_client.dataValues.id_cliente_fk,
                nombre_cliente: responsible_client.dataValues.cliente ? responsible_client.cliente.nombre_cliente : null,
            })
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
                    'cargo'
                ],
                where: {
                    id_cliente_fk: id
                }
            })
            // si no se encuentran tareas
            if (responsibles_client.length === 0 || !responsibles_client) {
                return res.status(204).json({message: 'Este cliente no tiene responsables', data: []})
            }
            // enviar los datos
            res.status(200).json(responsibles_client)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }    
}

export default ReplicaResponsableClienteController