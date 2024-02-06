// TareaModel.js

import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js'; 

const Tarea = sequelize.define('Tarea', {
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
      model: 'Proyecto', // Nombre de la tabla de referencia
      key: 'id_proyecto', // Clave primaria en la tabla de referencia
    },
  },
  id_actividad_fk: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Actividad', // Nombre de la tabla de referencia
      key: 'id_actividad', // Clave primaria en la tabla de referencia
    },
  },
  feriado_fk: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  
},
{
    timestamps: false, // Desactivar las columnas createdAt y updatedAt
});

export default Tarea;
