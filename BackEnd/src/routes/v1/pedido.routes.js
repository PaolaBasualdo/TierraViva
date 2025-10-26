// src/routes/api/pedido.routes.js
import { Router } from "express";
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
  crearPedidoDesdeCarrito,
} from "../../controllers/pedido.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/roles.middleware.js";

const router = Router();

//  Solo admin puede listar y eliminar
router.get("/", protect, adminOnly, getPedidos);
router.get("/:id", protect, getPedidoById);
router.post("/", protect, createPedido);
router.put("/:id", protect, updatePedido);
router.delete("/:id", protect, adminOnly, deletePedido);

//  Crear pedido desde carrito (usuario autenticado)
router.post("/desde-carrito", protect, crearPedidoDesdeCarrito);

export default router;
