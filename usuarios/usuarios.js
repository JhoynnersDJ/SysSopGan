const express = require('express');
const router = express.Router();
const controller = require('./controllers/UserControllers');
const validateSchema = require('./middlewares/ValidatorSchema');
const authRequired = require('./middlewares/validateToken')
const {loginSchema, registerSchema} = require('./schemas/UserSchema');

//registrar usuario (nombre de usuario, contraseña, email)
router.post('/registro',validateSchema(registerSchema), controller.register);

//iiniciar sesion con email y contraseña
router.post('/login',validateSchema(loginSchema), controller.login);

//finalizar sesion usuario
router.post('/logout', controller.logout);

//obtener datos del usuario
router.get('/perfil', authRequired, controller.profile);

module.exports = router;
