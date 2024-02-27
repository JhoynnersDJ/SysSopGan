import { ClienteReplica } from "../Modelo/Syssopgan/Asociaciones.js";
import { ReplicaResponsableCliente } from "../Modelo/Syssopgan/ReplicaResponsableClienteModel.js";
import { Cliente } from "../Modelo/Cliente/ClienteModel.js";

class ReplicaClienteController {
    // devuelve todos las clientes
    static async index (req, res) {
        try {
            // buscar todos los registros de cliente junto a su modelo asociado
            const clients = await ClienteReplica.findAll({
                include: [
                  {
                    model: ReplicaResponsableCliente,
                    attributes: [
                        ['id_responsable_cliente', 'id_responsable'],
                        ['nombre_responsable_cl', 'nombre_responsable']
                    ]
                  }
                ]
              })
            // si no hay clientes
            if (!clients) {
                return res.status(500).json({message: 'No hay clientes registrados en la base de datos'})
            }
            // envia los datos
            res.status(200).json(clients)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un cliente segun su ID
    static async getById (req, res){
        try {
            // capturar id de cliente
            const { id } = req.params
            // comprobar si existe
            const client = await ClienteReplica.findByPk(id,{
                include: [
                  {
                    model: ReplicaResponsableCliente,
                    attributes: [
                        ['id_responsable_cliente', 'id_responsable'],
                        ['nombre_responsable_cl', 'nombre_responsable']
                    ]
                  }
                ]
              })
            // si no hay cliente
            if (!client) {
                return res.status(404).json({message: 'Cliente no encontrado'})
            }
            // envia los datos
            res.status(200).json(client)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear un cliente
    static async create (req, res){
        try {
            // capturar datos
            const { name, Position, location } = req.body
            // guardar en la base de datos
            await Cliente.create(
                { nombre_cliente: name, cargo:Position, ubicacion: location },
                { fields: ['nombre_cliente', 'cargo', 'ubicacion'] }
              )
            res.status(201).json({ message: 'Cliente registrado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ReplicaClienteController