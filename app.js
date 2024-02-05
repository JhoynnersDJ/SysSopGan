require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')

// Importar el enrutador de prueba desde el archivo './prueba/prueba'
const pruebaRouter = require('./prueba/prueba'); 

const userRouter = require('./usuarios/usuarios');

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
// Middleware para Prueba
app.use('/prueba', pruebaRouter);

//Middleware para usuario
app.use('/usuario', userRouter);

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
