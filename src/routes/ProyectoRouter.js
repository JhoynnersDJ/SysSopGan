import { Router } from "express";
import ProyectoController  from "../controllers/ProyectoController.js";
import { validateSchema } from "../middlewares/ValidatorSchema.js";
import { createEschema } from "../schemas/ProyectoSchema.js";

const ProyectoRouter = Router()

// Endpoints
ProyectoRouter.get('/todos', ProyectoController.index)
ProyectoRouter.get('/seleccionar/:id', ProyectoController.getById)
ProyectoRouter.post('/crear', validateSchema(createEschema), ProyectoController.create)
ProyectoRouter.post('/actualizar/:id', ProyectoController.update)

export default ProyectoRouter