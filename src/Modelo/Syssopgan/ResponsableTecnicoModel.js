// ResponsableTecnicoModel.js

import { DataTypes } from 'sequelize';
import {sequelize} from '../sequelize.js';

import { Proyecto } from "./ProyectoModel.js";

const ResponsableTecnico = sequelize.define('Responsable_Tecnico', {
  id_responsable_tec: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre_responsable_tec: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  num_tel: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
    timestamps: false, 
});

// Definir la relación de uno a muchos con el modelo Proyecto
ResponsableTecnico.hasMany(Proyecto, { foreignKey:'id_responsable_tecnico_fk', onDelete: 'CASCADE' });
Proyecto.belongsTo(ResponsableTecnico, { targetKey:'id_responsable_tec', foreignKey: 'id_responsable_tecnico_fk', onDelete: 'CASCADE' });

export {ResponsableTecnico};
