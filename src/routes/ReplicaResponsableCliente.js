import { Router } from "express";
import ReplicaResponsableClienteController  from "../controllers/ReplicaResponsableClienteController.js";

const ReplicaResponsableClienteRouter = Router()

// Endpoints
ReplicaResponsableClienteRouter.get('/todos', ReplicaResponsableClienteController.index)
ReplicaResponsableClienteRouter.get('/seleccionar/:id', ReplicaResponsableClienteController.getById)
ReplicaResponsableClienteRouter.post('/crear', ReplicaResponsableClienteController.create)

export default ReplicaResponsableClienteRouter