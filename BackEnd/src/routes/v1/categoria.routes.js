import { Router } from "express";
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../../controllers/categoria.controller.js";
import uploadImage from "../../middleware/upload.js"; 

const router = Router();

// Rutas de categoría
router.get("/", getCategorias);          // Listar todas
router.get("/:id", getCategoriaById);    // Buscar por ID
router.post("/", uploadImage, createCategoria);       // Crear
router.put("/:id", uploadImage, updateCategoria);     // Actualizar
router.delete("/:id", deleteCategoria);  // Eliminar

export default router;
