import { Router} from "express";
import  {login, logout, register, profile, updateRol}  from './controllers/UserControllers.js';
import { authRequired } from "../src/middlewares/validateToken.js";
import { rolRequired } from "../src/middlewares/validateRol.js";
import { validateSchema } from "../src/middlewares/ValidatorSchema.js";
import { loginSchema, registerSchema, updateRolfromAdmin } from "./schemas/UserSchema.js";

const router = Router()
//registrar usuario (nombre de usuario, contraseña, email)
router.post('/registro',validateSchema(registerSchema), register);

//iniciar sesion con email y contraseña
router.post('/login',validateSchema(loginSchema), login);

//finalizar sesion usuario
router.post('/logout',authRequired, logout);

//obtener datos del usuario
router.get('/perfil', authRequired, rolRequired('usuario'), profile);

//actualizar rol del usuario
router.post('/actualizar-rol',authRequired, validateSchema(updateRolfromAdmin), updateRol);

export default router
