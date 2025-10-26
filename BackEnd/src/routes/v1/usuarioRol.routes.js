import { Router } from "express";
import {
  getUsuarioRoles,
  getUsuarioRolById,
  createUsuarioRol,
  updateUsuarioRol,
  deleteUsuarioRol,
} from "../../controllers/usuarioRol.controller.js";

const router = Router();

// Rutas de UsuarioRol
router.get("/", getUsuarioRoles);          // Listar todas las relaciones
router.get("/:id", getUsuarioRolById);     // Obtener una relación por ID
router.post("/", createUsuarioRol);        // Crear relación usuario-rol
router.put("/:id", updateUsuarioRol);      // Actualizar relación
router.delete("/:id", deleteUsuarioRol);   // Eliminar relación

export default router;
