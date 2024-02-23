// ActividadModel.js

import { DataTypes } from 'sequelize';
import {sequelize} from '../sequelize.js'; 

const Servicio = sequelize.define('servicio', {
  id_servicio: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  plataforma: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  timestamps: false, // Desactivar las columnas createdAt y updatedAt
});

export {Servicio};
