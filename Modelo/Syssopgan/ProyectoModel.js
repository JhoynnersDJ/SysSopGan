    // ProyectoModel.js

    import { DataTypes } from 'sequelize';
    import {sequelize} from '../sequelize.js'; 
    import { ClienteReplica } from './ReplicaClienteModel.js';

    const Proyecto = sequelize.define('Proyecto', {
        id_proyecto: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
    tarifa: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    nombre_proyecto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_responsable_tecnico_fk: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
        model: 'Responsable_Tecnico', // Nombre de la tabla de referencia
        key: 'id_responsable_tec', // Clave primaria en la tabla de referencia
        },
    },
    id_usuario_fk: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
        model: 'Usuario', // Nombre de la tabla de referencia
        key: 'id_us', // Clave primaria en la tabla de referencia
        },
    },
    id_cliente_fk: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
        model: ClienteReplica, // Nombre de la tabla de referencia
        key: 'id_cliente', // Clave primaria en la tabla de referencia
        },
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    }, {
        timestamps: false, // Desactivar las columnas createdAt y updatedAt

    });

    export  {Proyecto};
