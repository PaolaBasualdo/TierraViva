// src/routes/v1/notificacion.routes.js
import { Router } from "express";
import { 
  crearNotificacion, 
  listarNotificaciones, 
  marcarLeida 
} from "../../controllers/notificacion.controller.js";
import { protect } from "../../middleware/auth.middleware.js"; // middleware de autenticación

const router = Router();

// Crear notificación (solo admin o procesos internos)
router.post("/", protect, crearNotificacion);

// Listar notificaciones del usuario logueado
router.get("/", protect, listarNotificaciones);

// Marcar notificación como leída
router.put("/:id/leida", protect, marcarLeida);

export default router;
