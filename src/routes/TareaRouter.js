import { Router } from "express";
import TareaController  from "../controllers/TareaController.js";

const TareaRouter = Router()

// Endpoints
TareaRouter.get('/todos', TareaController.index)
TareaRouter.get('/seleccionar/:id', TareaController.getById)
TareaRouter.post('/crear', TareaController.create)
TareaRouter.post('/actualizar/:id', TareaController.update)

export default TareaRouter