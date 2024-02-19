import { Router } from "express";
import RolController  from "../controllers/RolController.js";
import { validateSchema } from "../middlewares/ValidatorSchema.js";
import { createEschema, updateEschema } from "../schemas/RolSchema.js";

const RolRouter = Router()

// Endpoints
RolRouter.get('/todos', RolController.index)
RolRouter.get('/seleccionar/:id', RolController.getById)
RolRouter.post('/crear', validateSchema(createEschema), RolController.create)
RolRouter.post('/actualizar/:id', validateSchema(updateEschema), RolController.update)

export default RolRouter