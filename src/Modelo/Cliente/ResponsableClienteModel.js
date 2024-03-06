import { DataTypes } from 'sequelize';
import {sequelizeClients} from '../sequelize.js'; 
import {Cliente} from './ClienteModel.js';

const ResponsableCliente = sequelizeClients.define('responsable_cliente', {
    id_responsable_cliente: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
nombre_responsable_cl: {
    type: DataTypes.STRING,
    allowNull: false,
},
cargo: {
    type: DataTypes.STRING,
    allowNull: false,
},
id_cliente_fk: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
    model: Cliente, // Nombre de la tabla de referencia
    key: 'id_cliente', // Clave primaria en la tabla de referencia
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cedula: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},

}, {
    timestamps: false, // Desactivar las columnas createdAt y updatedAt

});

export  {ResponsableCliente};
