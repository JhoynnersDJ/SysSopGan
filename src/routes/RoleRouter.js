import { Router } from "express";
import RolController  from "../controllers/RolController.js";

const RolRouter = Router()

// Endpoints
RolRouter.get('/todos', RolController.index)
RolRouter.get('/seleccionar/:id', RolController.getById)
RolRouter.post('/crear', RolController.create)
RolRouter.post('/actualizar/:id', RolController.update)

export default RolRouter