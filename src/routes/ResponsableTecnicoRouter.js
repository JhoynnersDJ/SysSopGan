import { Router } from "express";
import ResponsableTecnicoController  from "../controllers/ResponsableTecnicoController.js";

const ResponsableTecnicoRouter = Router()

// Endpoints
ResponsableTecnicoRouter.get('/todos', ResponsableTecnicoController.index)
ResponsableTecnicoRouter.get('/seleccionar/:id', ResponsableTecnicoController.getById)
ResponsableTecnicoRouter.post('/crear', ResponsableTecnicoController.create)
ResponsableTecnicoRouter.post('/actualizar/:id', ResponsableTecnicoController.update)

export default ResponsableTecnicoRouter