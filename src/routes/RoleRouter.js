import { Router } from "express";
import RolController  from "../controllers/RolController.js";

const RolRouter = Router()

// Endpoints
RolRouter.get('/todos', RolController.index)
RolRouter.get('/seleccionar/:id', RolController.getById)

export default RolRouter