// rolModel.js

import { DataTypes } from 'sequelize';
import {sequelize } from '../sequelize.js'; 

const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false, // Esto desactiva la creación automática de las columnas createdAt y updatedAt
});

export  {Rol};
