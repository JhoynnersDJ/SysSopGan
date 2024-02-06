// ActividadModel.js

import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; // Importa la instancia de Sequelize

const Actividad = sequelize.define('Actividad', {
  id_actividad: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
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

export default Actividad;
