// Usuario.js

import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import {sequelize} from '../sequelize.js'; 
import {Rol} from './RolModel.js';

const Usuario = sequelize.define('Usuario', {
  id_us: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  num_tel: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ultima_conexion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  id_rolref: {
    type: DataTypes.UUID, // Tipo de datos UUID para la clave externa del rol
    allowNull: false,
    references: {
      model: Rol, // Nombre del modelo de la tabla a la que se hace referencia
      key: 'id_rol', // Clave primaria de la tabla a la que se hace referencia
    },
  },
}, {
  timestamps: false, // Desactivar las columnas createdAt y updatedAt
});

export {Usuario} ;
