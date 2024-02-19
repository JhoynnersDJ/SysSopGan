import { Router } from "express";
import ServicioController  from "../controllers/ServicioController.js";
import { validateSchema } from "../middlewares/ValidatorSchema.js";
import { createEschema, updateEschema } from "../schemas/ServicioEschema.js";

const ServicioRouter = Router()

// Endpoints
ServicioRouter.get('/todos', ServicioController.index)
ServicioRouter.get('/seleccionar/:id', ServicioController.getById)
ServicioRouter.post('/crear', validateSchema(createEschema), ServicioController.create)
ServicioRouter.post('/actualizar/:id', validateSchema(updateEschema), ServicioController.update)

export default ServicioRouter