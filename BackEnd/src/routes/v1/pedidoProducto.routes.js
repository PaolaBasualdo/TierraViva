import { Router } from "express";
import {
  getPedidoProductos,
  getPedidoProductoById,
  createPedidoProducto,
  updatePedidoProducto,
  deletePedidoProducto,
} from "../../controllers/pedidoProducto.controller.js";

const router = Router();

// Rutas de PedidoProducto
router.get("/", getPedidoProductos);          // Listar todos los items de pedidos
router.get("/:id", getPedidoProductoById);    // Obtener un item por ID
router.post("/", createPedidoProducto);       // Agregar un producto a un pedido
router.put("/:id", updatePedidoProducto);     // Actualizar un item
router.delete("/:id", deletePedidoProducto);  // Eliminar un item

export default router;
