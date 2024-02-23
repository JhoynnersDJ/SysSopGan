import { Router } from "express";
import ResponsableClienteController  from "../controllers/ResponsableClienteController.js";

const ResponsableClienteRouter = Router()

// Endpoints
ResponsableClienteRouter.get('/todos', ResponsableClienteController.index)
ResponsableClienteRouter.get('/seleccionar/:id', ResponsableClienteController.getById)
ResponsableClienteRouter.post('/crear', ResponsableClienteController.create)

export default ResponsableClienteRouter