import { Router } from "express";
import {
  getPagos,
  getPagoById,
  createPago,
  updatePago,
  deletePago,
} from "../../controllers/pago.controller.js";

const router = Router();

// Rutas de Pago
router.get("/", getPagos);          // Listar todos los pagos
router.get("/:id", getPagoById);    // Obtener un pago por ID
router.post("/", createPago);       // Crear un nuevo pago
router.put("/:id", updatePago);     // Actualizar un pago
router.delete("/:id", deletePago);  // Eliminar un pago

export default router;
