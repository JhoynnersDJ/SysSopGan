import { Router } from "express";
import ReplicaClienteController  from "../controllers/ReplicaClienteController.js";
import {Cliente} from "../Modelo/Cliente/ClienteModel.js";
const ReplicaClienteRouter = Router()

// Endpoints
ReplicaClienteRouter.get('/todos', ReplicaClienteController.index)
ReplicaClienteRouter.get('/seleccionar/:id', ReplicaClienteController.getById)
ReplicaClienteRouter.post('/crear', ReplicaClienteController.create)

export default ReplicaClienteRouter