import { Router } from "express";
import ServicioController  from "../controllers/ServicioController.js";

const ServicioRouter = Router()

// Endpoints
ServicioRouter.get('/todos', ServicioController.index)
ServicioRouter.get('/seleccionar/:id', ServicioController.getById)
ServicioRouter.post('/crear', ServicioController.create)
ServicioRouter.post('/actualizar/:id', ServicioController.update)

export default ServicioRouter