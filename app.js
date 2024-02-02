require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const cors = require('cors');

// Importar el enrutador de prueba desde el archivo './prueba/prueba'
const pruebaRouter = require('./prueba/prueba'); 

const port = process.env.PORT || 3000;
const corsOrigin = process.env.CORS_ORIGIN;

const app = express();

app.use(cors({
  origin: corsOrigin,
}));

// Middleware para Prueba
app.use('/prueba', pruebaRouter);

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
