import 'dotenv/config' // Cargar variables de entorno desde .env
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// Importar el enrutador de prueba desde el archivo './prueba/prueba'
import pruebaRouter from "./prueba/prueba.js";
// Importar el enrutador de usuario desde el archivo './usuarios/usuarios'
import userRouter from "./usuarios/usuarios.js";
import sequelize from './Modelo/sequelize.js';
import Usuario from './Modelo/UsuarioModel.js';
import Proyecto from './Modelo/ProyectoModel.js';
import ResponsableTecnico from './Modelo/ResponsableTecnicoModel.js';
import Feriado from './Modelo/FeriadoModel.js';
import Actividad from './Modelo/ActividadModel.js';
import Tarea from './Modelo/TareaModel.js';




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

sequelize.sync({ force: false }).then(() => {
  console.log('Modelo sincronizado con la base de datos');
});

// Endpoint para registrar un usuario
app.post('/registrar-usuario', async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { nombre, apellido, email, num_tel, password, empresa, cargo, departamento } = req.body;

    // Crear un nuevo usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      num_tel,
      password,
      empresa,
      cargo,
      departamento,
    });

    // Enviar una respuesta con el usuario recién creado
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


// Middleware para Prueba
app.use('/prueba', pruebaRouter);

//Middleware para usuario
app.use('/usuario', userRouter);

app.listen(port, () => {
  console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
