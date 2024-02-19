import { Router } from "express";
import ResponsableTecnicoController  from "../controllers/ResponsableTecnicoController.js";
import { validateSchema } from "../middlewares/ValidatorSchema.js";
import { createEschema, updateEschema } from "../schemas/ResponsableTecnicoEschema.js";

const ResponsableTecnicoRouter = Router()

// Endpoints
ResponsableTecnicoRouter.get('/todos', ResponsableTecnicoController.index)
ResponsableTecnicoRouter.get('/seleccionar/:id', ResponsableTecnicoController.getById)
ResponsableTecnicoRouter.post('/crear', validateSchema(createEschema), ResponsableTecnicoController.create)
ResponsableTecnicoRouter.post('/actualizar/:id', validateSchema(updateEschema), ResponsableTecnicoController.update)

export default ResponsableTecnicoRouter