import { Cliente } from "../Modelo/Replicacion.js";
import { ResponsableCliente } from "../Modelo/Cliente/ResponsableClienteModel.js";

class ClienteController {
    // devuelve todas las actividades
    static async index (req, res) {
        try {
            // buscar todos los registros
            const clients = await Cliente.findAll({
                include: [
                  {
                    model: ResponsableCliente,
                    attributes: [
                        ['id_responsable_cliente', 'id_responsable'],
                        ['nombre_responsable_cl', 'nombre_responsable']
                    ]
                  }
                ]
              })
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
            const client = await Cliente.findByPk(id,{
                include: [
                  {
                    model: ResponsableCliente,
                    attributes: [
                        ['id_responsable_cliente', 'id_responsable'],
                        ['nombre_responsable_cl', 'nombre_responsable']
                    ]
                  }
                ]
              })
            if (!client) {
                return res.status(404).json({message: 'Cliente no encontrado'})
            }
            res.status(200).json(client)
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // crear un cliente
    static async create (req, res){
        try {
            // capturar datos
            const { name, location } = req.body
            // guardar en la base de datos
            await Cliente.create(
                { nombre_cliente: name, ubicacion: location },
                { fields: ['nombre_cliente', 'ubicacion'] }
              )
            res.status(201).json({ message: 'Cliente registrado correctamente' })
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ClienteController