// FeriadoModel.js

import { DataTypes } from 'sequelize';
import {sequelize} from './sequelize.js'; 

const Feriado = sequelize.define('Feriado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
},
{
    timestamps: false, // Desactivar las columnas createdAt y updatedAt
  });

export {Feriado};
