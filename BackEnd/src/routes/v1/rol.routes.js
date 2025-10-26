import { Router } from "express";
import {
  getRoles,
  createRol,
} from "../../controllers/rol.controller.js";

const router = Router();

// Rutas de Rol
router.get("/", getRoles);     // Listar todos los roles
router.post("/", createRol);   // Crear un rol

export default router;
