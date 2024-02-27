// Relaciones entre modelos
import { Cliente } from "./ClienteModel.js";
import { ResponsableCliente } from "./ResponsableClienteModel.js"

// Definir la relación de uno a muchos con Cliente y ResponsableCliente
Cliente.hasMany(ResponsableCliente, { foreignKey: 'id_cliente_fk' });
ResponsableCliente.belongsTo(Cliente, { targetKey: 'id_cliente', foreignKey: 'id_cliente_fk' });

export { Cliente, ResponsableCliente }
