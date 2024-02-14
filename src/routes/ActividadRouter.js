import { Router } from "express";
import ActividadController  from "../controllers/ActividadController.js";

const ActividadRouter = Router()

// Endpoints
ActividadRouter.get('/todos', ActividadController.index)
ActividadRouter.get('/seleccionar/:id', ActividadController.getById)
ActividadRouter.post('/crear', ActividadController.create)
ActividadRouter.post('/actualizar/:id', ActividadController.update)

export default ActividadRouter