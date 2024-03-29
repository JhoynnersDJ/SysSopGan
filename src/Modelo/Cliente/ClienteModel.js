import { DataTypes } from 'sequelize';
import {sequelizeClients} from '../sequelize.js'; 


    const Cliente = sequelizeClients.define('cliente', {
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
    }, {
        timestamps: false, // Desactivar las columnas createdAt y updatedAt

    });

    export  {Cliente};
