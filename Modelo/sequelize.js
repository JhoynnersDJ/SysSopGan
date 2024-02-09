// sequelize.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  define: {
    freezeTableName: true, // Evitar la pluralización automática de los nombres de las tablas
  }
});

export default sequelize;
