import { ReplicaResponsableCliente } from "../Modelo/Syssopgan/ReplicaResponsableClienteModel.js";
import { ResponsableCliente } from "../Modelo/Cliente/ResponsableClienteModel.js";
import { Cliente } from "../Modelo/Cliente/ClienteModel.js";

class ReplicaResponsableClienteController {
    // devuelve todas las actividades
    static async index (req, res) {
        try {
            // buscar todos los registros
            const clients = await ReplicaResponsableCliente.findAll()
            if (!clients) {
                return res.status(500).json({message: 'No hay clientes registrados en la base de datos'})
            }
            res.status(200).json(clients)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // devuelve un cliente segun su ID
    static async getById (req, res){
        try {
            // capturar datos
            const { id } = req.params
            // comprobar si existe
            const client = await ReplicaResponsableCliente.findByPk(id)
            if (!client) {
                return res.status(404).json({message: 'Cliente no encontrado'})
            }
            res.status(200).json(client)
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