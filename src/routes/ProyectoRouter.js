import { Router } from "express";
import ProyectoController  from "../controllers/ProyectoController.js";
import { validateSchema } from "../middlewares/ValidatorSchema.js";
import { createEschema, updateEschema } from "../schemas/ProyectoSchema.js";

const ProyectoRouter = Router()

// Endpoints
ProyectoRouter.get('/todos', ProyectoController.index)
ProyectoRouter.get('/seleccionar/:id', ProyectoController.getById)
ProyectoRouter.get('/cliente/:id', ProyectoController.getByClient)
ProyectoRouter.get('/usuario/:id', ProyectoController.getByUser)
ProyectoRouter.post('/crear', validateSchema(createEschema), ProyectoController.create)
ProyectoRouter.post('/actualizar/:id', /*validateSchema(updateEschema)*/ ProyectoController.update)
ProyectoRouter.delete('/eliminar/:id', ProyectoController.delete)

// Endpoints de Generar Reportes y Generar Graficos
ProyectoRouter.get('/reporteproyecto/:id', ProyectoController.pdf)
ProyectoRouter.get('/Graficaproyecto/:id', ProyectoController.graph)

export default ProyectoRouter