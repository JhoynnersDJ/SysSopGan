import { Router } from "express";
import ReplicaClienteController  from "../controllers/ReplicaClienteController.js";

const ReplicaClienteRouter = Router()

// Endpoints
ReplicaClienteRouter.get('/todos', ReplicaClienteController.index)
ReplicaClienteRouter.get('/seleccionar/:id', ReplicaClienteController.getById)

export default ReplicaClienteRouter