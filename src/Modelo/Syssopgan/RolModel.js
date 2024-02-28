// rolModel.js

import { DataTypes } from 'sequelize';
import {sequelize } from '../sequelize.js'; 

const Rol = sequelize.define('rol', {
  id_rol: {
    type: DataTypes.STRING,
    primaryKey: true,
    unique: true
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

export {Rol};
