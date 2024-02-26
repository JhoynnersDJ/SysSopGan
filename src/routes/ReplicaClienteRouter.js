import { Router } from "express";
import ReplicaClienteController  from "../controllers/ReplicaClienteController.js";

const ReplicaClienteRouter = Router()

// Endpoints
ReplicaClienteRouter.get('/todos', ReplicaClienteController.index)
ReplicaClienteRouter.get('/seleccionar/:id', ReplicaClienteController.getById)
ReplicaClienteRouter.post('/crear', ReplicaClienteController.create)

export default ReplicaClienteRouter