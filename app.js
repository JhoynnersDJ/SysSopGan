import 'dotenv/config'; // Cargar variables de entorno desde .env
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// Importar el enrutador de prueba desde el archivo './prueba/prueba'
import pruebaRouter from "./prueba/prueba.js";
// Importar el enrutador de usuario desde el archivo './usuarios/usuarios'
import userRouter from "./usuarios/usuarios.js";
import holidaysRouter from "./feriados/feriados.js"
import {sequelize} from './src/Modelo/sequelize.js';
// Importar el router de proyectos
import ProyectoRouter from './src/routes/ProyectoRouter.js';
// Importar el router de rol
import RolRouter from './src/routes/RoleRouter.js';
// Importar el router de actividad
import ActividadRouter from './src/routes/ActividadRouter.js';
// Importar el router de tareas
import TareaRouter from './src/routes/TareaRouter.js';

import {loadHolidays} from "./feriados/controllers/HolidayController.js"

const port = process.env.PORT || 3000;
const host = process.env.HOST;
const corsOrigin = process.env.CORS_ORIGIN;

const app = express();

app.use(cors({
  origin: corsOrigin,
}));
//manejo de json
app.use(express.json());
//manejo de cookies
app.use(cookieParser());
//Sincronizacion de la base de datos
await sequelize.sync({ force: false }).then(() => {
  console.log('Modelo sincronizado con la base de datos');
});

// Middleware para Prueba
app.use('/prueba', pruebaRouter);

//Middleware para usuario
app.use('/usuario', userRouter);

//Middleware para feriados
app.use('/feriados', holidaysRouter);

//Middleware para proyectos
app.use('/proyectos', ProyectoRouter);

//Middleware para roles
app.use('/rol', RolRouter);

//Middleware para actividades
app.use('/actividad', ActividadRouter);

//Middleware para actividades
app.use('/tarea', TareaRouter);

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://${host}:${port}`);
});

//carga feriados ddesde google calendar a la aplicaion
//loadHolidays();
