import { Cliente } from "./Cliente/ClienteModel.js";
import { ClienteReplica } from "./Syssopgan/ReplicaClienteModel.js";
import { ResponsableCliente } from "./Cliente/ResponsableClienteModel.js";
import { ReplicaResponsableCliente } from "./Syssopgan/ReplicaResponsableClienteModel.js";


// Escucha el evento 'afterCreate' en el modelo Cliente
Cliente.afterCreate(async (cliente) => {
  try {
    // Crea un registro en la base de datos syssopgan usando los datos del cliente creado
    await ClienteReplica.create({
        id_cliente: cliente.id_cliente,
        nombre_cliente: cliente.nombre_cliente,
        ubicacion: cliente.ubicacion,
    });
  } catch (error) {
    console.error('Error replicando cliente a syssopgan:', error);
  }
});

// Escucha el evento 'afterCreate' en el modelo Cliente
ResponsableCliente.afterCreate(async (responsable) => {
  try {
    // Crea un registro en la base de datos syssopgan usando los datos del responsable cliente creado
    await ReplicaResponsableCliente.create({
      id_responsable_cliente: responsable.id_responsable_cliente,
      nombre_responsable_cl: responsable.nombre_responsable_cl,
      cargo: responsable.cargo,
      id_cliente_fk:responsable.id_cliente_fk,
    });
  } catch (error) {
    console.error('Error replicando responsable cliente a syssopgan:', error);
  }
});

export { Cliente, ClienteReplica, ResponsableCliente, ReplicaResponsableCliente };
