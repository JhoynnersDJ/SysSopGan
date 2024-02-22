// Relaciones entre modelos
import { ClienteReplica } from "./ReplicaClienteModel.js";
import { Proyecto } from "./ProyectoModel.js";
import { ResponsableTecnico } from "./ResponsableTecnicoModel.js";
import { Usuario } from "./UsuarioModel.js";
import { Tarea } from "./TareaModel.js";
import { Servicio } from "./ServicioModel.js";
import { ReplicaResponsableCliente } from "./ReplicaResponsableClienteModel.js";
import { Rol } from "./RolModel.js"


// Asociaciones relacionadas a ClienteReplica

// Un cliente tiene muchos proyectos
// Definir la relación de uno a muchos con ClienteReplica y Proyecto
ClienteReplica.hasMany(Proyecto, { foreignKey:'id_cliente_fk'});
Proyecto.belongsTo(ClienteReplica, { targetKey:'id_cliente', foreignKey: 'id_cliente_fk'});

// Un cliente tiene muchos responsables clientes
// Definir la relación de uno a muchos con ClienteReplica y ReplicaResponsableCliente
ClienteReplica.hasMany(ReplicaResponsableCliente, { foreignKey:'id_cliente_fk'});
ReplicaResponsableCliente.belongsTo(ClienteReplica, { targetKey:'id_cliente', foreignKey: 'id_cliente_fk'});


// Asociaciones relacionadas a ResponsableTecnico

// Un responsable tecnico tiene muchos proyectos
// Definir la relación de uno a muchos con ResponsableTecnico y Proyecto
ResponsableTecnico.hasMany(Proyecto, { foreignKey:'id_responsable_tecnico_fk'});
Proyecto.belongsTo(ResponsableTecnico, { targetKey:'id_responsable_tec', foreignKey: 'id_responsable_tecnico_fk' });


// Asociaciones relacionadas a ResponsableTecnico

// Un usuario tiene muchos proyectos
// Definir la relación de uno a muchos con Usuario y Proyecto
Usuario.hasMany(Proyecto, { foreignKey:'id_usuario_fk'});
Proyecto.belongsTo(Usuario, { targetKey:'id_us', foreignKey: 'id_usuario_fk' });
Rol.hasOne(Usuario, { foreignKey:'id_rolref'});
Usuario.belongsTo(Rol, { targetKey:'id_rol', foreignKey: 'id_rolref' })


// Asociaciones relacionadas a Proyecto

// Un proyecto tiene muchas tareas
// Definir la relación de uno a muchos con Proyecto Tarea
Proyecto.hasMany(Tarea, { foreignKey:'id_proyecto_fk'});
Tarea.belongsTo(Proyecto, { targetKey:'id_proyecto', foreignKey: 'id_proyecto_fk'});


// Asociaciones relacionadas a Proyecto

// Un servicio tiene muchas tareas
// Definir la relación de uno a muchos con Servicio y Tarea
Servicio.hasMany(Tarea, { foreignKey:'id_servicio_fk'});
Tarea.belongsTo(Servicio, { targetKey:'id_servicio', foreignKey: 'id_servicio_fk'});


// exportar los modelos con sus respectivas relaciones
export { Proyecto, ClienteReplica, ReplicaResponsableCliente, ResponsableTecnico, Usuario, Tarea, Servicio }