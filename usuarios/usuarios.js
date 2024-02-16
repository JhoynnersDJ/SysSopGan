import { Router} from "express";
import  {login, logout, register, profile}  from './controllers/UserControllers.js';
import { authRequired } from "../src/middlewares/validateToken.js";
import { validateSchema } from "../src/middlewares/ValidatorSchema.js";
import { loginSchema, registerSchema } from "./schemas/UserSchema.js";

const router = Router()
//registrar usuario (nombre de usuario, contraseña, email)
router.post('/registro',validateSchema(registerSchema), register);

//iniciar sesion con email y contraseña
router.post('/login',validateSchema(loginSchema), login);

//finalizar sesion usuario
router.post('/logout', logout);

//obtener datos del usuario
router.get('/perfil', authRequired, rolRequired('user'), profile);

export default router
