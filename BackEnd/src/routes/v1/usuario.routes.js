// src/routes/api/usuarios.routes.js
import { Router } from "express";

import {
  getUsuarios, getUsuarioById, createUsuario,
  updateUsuario, deleteUsuario, getPerfil, updatePerfil, patchRolVendedor  
} from "../../controllers/usuario.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/roles.middleware.js";
import uploadImage from "../../middleware/upload.js"; 
import { testEmail } from "../../controllers/usuario.controller.js";

const router = Router();

router.get("/test-email", testEmail);

// Perfil propio
router.get("/perfil", protect, getPerfil);
router.put("/perfil", protect, uploadImage, updatePerfil);

// NUEVA RUTA para switch "Quiero ser vendedor"
router.put("/rol-vendedor", protect, patchRolVendedor);

// Rutas admin para manejo de usuarios
router.get("/", protect, adminOnly, getUsuarios);
router.get("/:id", protect, adminOnly, getUsuarioById);
router.post("/", protect, adminOnly, createUsuario);
router.put("/:id", protect, adminOnly, updateUsuario);
router.delete("/:id", protect, adminOnly, deleteUsuario);



export default router;