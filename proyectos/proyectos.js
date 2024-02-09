import { Router } from "express";
import ProyectoController  from "./controllers/ProyectoController.js";
const proyectoRouter = Router()

// Endpoints
proyectoRouter.get('/todos', ProyectoController.index)
proyectoRouter.get('/proyectos-por-id/:id', ProyectoController.getById)
proyectoRouter.post('/crear', ProyectoController.create)


export default proyectoRouter