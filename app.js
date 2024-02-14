import 'dotenv/config'; // Cargar variables de entorno desde .env
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// Importar el enrutador de prueba desde el archivo './prueba/prueba'
import pruebaRouter from "./prueba/prueba.js";
// Importar el enrutador de usuario desde el archivo './usuarios/usuarios'
import userRouter from "./usuarios/usuarios.js";
import holidaysRouter from "./feriados/feriados.js";
import {Cliente} from "./Modelo/Cliente/ClienteModel.js";
import {ResponsableCliente} from "./Modelo/Cliente/ResponsableCliente.js";
import {sequelize} from './Modelo/sequelize.js';
import {sequelizeClients} from './Modelo/sequelize.js';
import {loadHolidays} from "./feriados/controllers/HolidayController.js";
import {Usuario} from "./Modelo/Syssopgan/UsuarioModel.js";
import {Feriado} from "./Modelo/Syssopgan/FeriadoModel.js";
import {Proyecto} from "./Modelo/Syssopgan/ProyectoModel.js";
import {Tarea} from "./Modelo/Syssopgan/TareaModel.js";
import {ResponsableTecnico} from "./Modelo/Syssopgan/ResponsableTecnicoModel.js";
import {Servicio} from "./Modelo/Syssopgan/ServicioModel.js";
import { ClienteReplica } from './Modelo/Syssopgan/ReplicaClienteModel.js';
  
const port = process.env.PORT || 3000;
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
sequelize.sync({ force: false }).then(() => {
  console.log('Modelo sincronizado con la base de datos');
});
//Sincronizacion de la base de datos
sequelizeClients.sync({ force: false }).then(() => {
  console.log('Modelo sincronizado con la base de datos de cliente');
});
// Middleware para Prueba
app.use('/prueba', pruebaRouter);

//Middleware para usuario
app.use('/usuario', userRouter);

//Middleware para feriados
app.use('/feriados', holidaysRouter);

/*
DE PRUEBA
// Endpoint para sincronizar los datos de la tabla cliente entre dos bases de datos
app.get('/sincronizar-datos-cliente', async (req, res) => {
  try {
    // Obtener todos los registros de la tabla cliente de la base de datos cliente
    const datosCliente = await Cliente.findAll();

    // Insertar o actualizar los registros en la tabla cliente de la base de datos syssopgan
    await Promise.all(datosCliente.map(async cliente => {
      await ClienteReplica.upsert(cliente.get({ plain: true }));
    }));

    res.status(200).json({ message: 'Sincronización de datos de cliente completada con éxito.' });
  } catch (error) {
    console.error('Error al sincronizar datos de cliente:', error);
    res.status(500).json({ error: 'Error al sincronizar datos de cliente.' });
  }
});
*/

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});

//carga feriados ddesde google calendar a la aplicaion
//loadHolidays();
