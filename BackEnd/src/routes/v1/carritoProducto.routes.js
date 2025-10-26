import { Router } from "express";
import {
  getCarritoProductos,
  getCarritoProductoById,
  createCarritoProducto,
  updateCarritoProducto,
  deleteCarritoProducto,
} from "../../controllers/carritoProducto.controller.js";

const router = Router();

// Rutas de CarritoProducto
router.get("/", getCarritoProductos);          // Listar todos los items en carritos
router.get("/:id", getCarritoProductoById);    // Obtener un item por ID
router.post("/", createCarritoProducto);       // Agregar producto al carrito
router.put("/:id", updateCarritoProducto);     // Actualizar un item en carrito
router.delete("/:id", deleteCarritoProducto);  // Eliminar un item del carrito

export default router;
