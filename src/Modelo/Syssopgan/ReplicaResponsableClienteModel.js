import { DataTypes } from 'sequelize';
import {sequelize} from '../sequelize.js'; 
import {Cliente} from './ClienteModel.js';

const ReplicaResponsableCliente = sequelize.define('responsable_cliente', {
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
id_cliente_fk: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
    model: Cliente, // Nombre de la tabla de referencia
    key: 'id_cliente', // Clave primaria en la tabla de referencia
    },
    
},

}, {
    timestamps: false, // Desactivar las columnas createdAt y updatedAt

});

export  {ReplicaResponsableCliente};
