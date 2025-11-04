import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import {
  getCarritos,
  getCarritoById,
  createCarrito,
 
  
  getCarritoActivo,
  agregarProducto,
  vaciarCarrito,
  disminuirCantidad,
  eliminarProducto
} from "../../controllers/carrito.controller.js";

const router = Router();

//Todas las rutas requieren autenticación
router.use(protect);

// Rutas principales
router.get("/", getCarritos);
router.get("/activo", getCarritoActivo);
router.post("/", createCarrito);



// Acciones sobre el carrito activo
router.post("/agregar", agregarProducto);
router.put("/disminuir/:idProducto", disminuirCantidad);   
router.delete("/producto/:idProducto", eliminarProducto);  
router.post("/vaciar", vaciarCarrito);

export default router;

