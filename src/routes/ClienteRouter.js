import { Router } from "express";
import ClienteController  from "../controllers/ClienteController.js";

const ClienteRouter = Router()

// Endpoints
ClienteRouter.get('/todos', ClienteController.index)
ClienteRouter.get('/seleccionar/:id', ClienteController.getById)
ClienteRouter.post('/crear', ClienteController.create)

export default ClienteRouter