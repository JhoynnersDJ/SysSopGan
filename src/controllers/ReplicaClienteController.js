import { ClienteReplica } from "../Modelo/Syssopgan/Asociaciones.js";
import { ReplicaResponsableCliente } from "../Modelo/Syssopgan/ReplicaResponsableClienteModel.js";
import { Cliente } from "../Modelo/Cliente/ClienteModel.js";

class ReplicaClienteController {
    // devuelve todos los registros 
    static async index (req, res) {
        try {
            // buscar todos los registros de replica cliente
            const clients = await ClienteReplica.findAll()
            // si no hay clientes
            if (!clients) {
                return res.status(204).json({message: 'No hay clientes registrados en la base de datos', data: []})
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
            const client = await ClienteReplica.findByPk(id)
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
}

export default ReplicaClienteController