# SysSopGan

<h1>Instrucciones para desarrollo backend</h1>

<strong> Variables:</strong>
En minusculas, singular y en ingles:
Ejemplo: client, password, email.
Las variables de las bases de datos separados con guiones bajos. Ejemplo:
num_tel, nombre_us

  <strong>Estructura de carpetas para el backend:</strong>
  Habra dos carpetas que separa el backend con el front
  se trabaja con el <strong>ENFOQUE TRADICIONAL</strong> con organizado con routes <br>
Carpeta llamada Modelo: <br>
Nombre de archivos dentro de dicha carpeta en UpperCamelCase (Primera letra en mayusculas, cada siguiente palabra en mayusculas) y terminando en Model, ejemplo:
ClienteModel, ProyectoModel.
Nombre de archivo que contendra en todos los Middleware: 
<strong>app.js</strong> (con routes)</strong><br> ejemplo:


const UsuariosRouter = require('./usuarios/usuarios');
// Middleware para usuarios
app.use('/usuarios', UsuariosRouter);


<strong>Manera sobre la importacion de modelos</strong>
  CommandJS:<br>
  Ejemplo: const { generarCodigoRecuperacion } = require('../token'); //importa el codigo en donde se genera el token de 6 digitos

  <strong>Nombre de funciones </strong>

En camelCase, ejemplo: 
const gananciaPorProyectoArray

<strong>NOMBRE DE ENDPOINTS</strong>
En español separado con guiones:
Ejemplo:
router.get('/proyectos-por-usuario/:id_usuario')

Para trabajar con la base de datos, se usara mongoose para base de datos no relacional, y sequelize mysql2 (Mysql) y sequelize pg (para posgree) por los momentos.

<h1>Importante comentar su codigo.</h1>
    


