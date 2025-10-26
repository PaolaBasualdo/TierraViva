import { Router } from "express";

// Importar todas tus rutas
import categoriaRoutes from "./categoria.routes.js";
import productoRoutes from "./producto.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import rolRoutes from "./rol.routes.js";
import usuarioRolRoutes from "./usuarioRol.routes.js";
import carritoRoutes from "./carrito.routes.js";
import carritoProductoRoutes from "./carritoProducto.routes.js";
import pedidoRoutes from "./pedido.routes.js";
import pedidoProductoRoutes from "./pedidoProducto.routes.js";
import pagoRoutes from "./pago.routes.js";
import authRoutes from "./auth.routes.js";
import notificacionRoutes from "./notificacion.routes.js";
import contactoRoutes from "./contacto.routes.js";
// Nueva ruta IA
import aiRoutes from "./ai.routes.js";

const router = Router();

// Montar rutas
router.use("/categorias", categoriaRoutes);
router.use("/productos", productoRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/roles", rolRoutes);
router.use("/usuario-rol", usuarioRolRoutes);
router.use("/carritos", carritoRoutes);
router.use("/carrito-producto", carritoProductoRoutes);
router.use("/pedidos", pedidoRoutes);
router.use("/pedido-producto", pedidoProductoRoutes);
router.use("/pagos", pagoRoutes);
router.use("/auth", authRoutes);         // login, register, refreshToken
router.use("/notificaciones", notificacionRoutes);
router.use("/contacto", contactoRoutes);

// Ruta para IA (chatbox)
router.use("/ia", aiRoutes);

export default router;
