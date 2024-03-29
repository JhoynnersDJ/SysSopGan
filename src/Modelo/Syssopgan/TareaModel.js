// TareaModel.js

import { DataTypes } from 'sequelize';
import {sequelize} from '../sequelize.js'; 

const Tarea = sequelize.define('tarea', {
  id_tarea: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
      allowNull: false,
      },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  total_hora: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_proyecto_fk: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'proyecto', // Nombre de la tabla de referencia
      key: 'id_proyecto', // Clave primaria en la tabla de referencia
    },
  },
  id_servicio_fk: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'servicio', // Nombre de la tabla de referencia
      key: 'id_servicio', // Clave primaria en la tabla de referencia
    },
  },
  feriado_fk: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  total_tarifa: {
    type: DataTypes.FLOAT,
    allowNull: false,
},
status_tarea: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
},
},
{
    timestamps: false, // Desactivar las columnas createdAt y updatedAt
});

export {Tarea};