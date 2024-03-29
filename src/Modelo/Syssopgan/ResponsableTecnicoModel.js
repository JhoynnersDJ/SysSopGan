// ResponsableTecnicoModel.js

import { DataTypes } from 'sequelize';
import {sequelize} from '../sequelize.js';

const ResponsableTecnico = sequelize.define('responsable_tecnico', {
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
cedula: {
    type: DataTypes.STRING,
    allowNull: false,
},
}, {
    timestamps: false, 
});

export {ResponsableTecnico};
