import { Router } from "express";
import TareaController  from "../controllers/TareaController.js";
import { validateSchema } from "../middlewares/ValidatorSchema.js";
import { createEschema, updateEschema } from "../schemas/TareaEschema.js";

const TareaRouter = Router()

// Endpoints
TareaRouter.get('/todos', TareaController.index)
TareaRouter.get('/seleccionar/:id', TareaController.getById)
TareaRouter.get('/proyecto/:id', TareaController.getByProject)
TareaRouter.post('/crear', /*validateSchema(createEschema),*/ TareaController.create)
TareaRouter.post('/actualizar/:id', TareaController.update)

export default TareaRouter