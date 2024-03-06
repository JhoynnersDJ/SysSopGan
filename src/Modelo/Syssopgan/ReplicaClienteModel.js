import { DataTypes } from 'sequelize';
import {sequelize} from '../sequelize.js'; 

    const ClienteReplica = sequelize.define('cliente', {
    id_cliente: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        },
    nombre_cliente: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    ubicacion: {
        type:DataTypes.STRING,
        allowNull:true,
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    num_tel: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cedula: {
        type: DataTypes.STRING,
        allowNull: false,
    },   
    }, {
        timestamps: false, // Desactivar las columnas createdAt y updatedAt

    });

    export {ClienteReplica};
