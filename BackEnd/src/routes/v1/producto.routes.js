// src/routes/api/productos.routes.js
import { Router } from "express";
import {
  getProductos, getProductoById, createProducto,
  updateProducto, deleteProducto, getMisProductos
} from "../../controllers/producto.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { sellerOnly } from "../../middleware/roles.middleware.js";
import uploadImage from "../../middleware/upload.js"; 
import { query } from "express-validator";

const router = Router();

// públicas


router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("page debe ser un número entero ≥ 1"),
    query("limit")
      .optional()
      .isInt({ min: 1 })
      .withMessage("limit debe ser un número entero ≥ 1"),
    query("minPrecio")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("minPrecio debe ser un número ≥ 0"),
    query("maxPrecio")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("maxPrecio debe ser un número ≥ 0"),
    query("estado")
      .optional()
      .isIn(["pendiente", "aprobado", "rechazado"])
      .withMessage("estado inválido"),
    query("orderBy")
      .optional()
      .isIn(["fecha_desc", "fecha_asc", "precio_asc", "precio_desc"])
      .withMessage("orderBy no válido"),
    query("incluirInactivos")
      .optional()
      .isIn(["true", "false"])
      .withMessage("incluirInactivos debe ser true o false"),
  ],
  getProductos
);

// protegidas
router.get("/mios", protect, getMisProductos); 
router.get("/:id", getProductoById);

// protegidas (vendedor o admin)
router.post("/", protect, sellerOnly, uploadImage, createProducto);
router.put("/:id", protect, sellerOnly, uploadImage, updateProducto);
router.delete("/:id", protect, sellerOnly, deleteProducto);

export default router;
