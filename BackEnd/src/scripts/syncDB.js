// src/scripts/syncDatabase.js
import dotenv from "dotenv";
import sequelize from "../config/database.js";  // o "../db/connection.js" si aún no renombraste la carpeta

import Usuario from '../models/Usuario.js';
import Rol from '../models/Rol.js';
import UsuarioRol from '../models/UsuarioRol.js';
import Producto from '../models/Producto.js';
import Categoria from '../models/Categoria.js';
import Carrito from '../models/Carrito.js';
import CarritoProducto from '../models/CarritoProducto.js';
import Pedido from '../models/Pedido.js';
import PedidoProducto from '../models/PedidoProducto.js';
import Pago from '../models/Pago.js';
import Notificacion from '../models/Notificacion.js';

dotenv.config();

const syncDatabase = async () => {
  try {
    console.log("🔄 Sincronizando base de datos...");

    await sequelize.authenticate();
    console.log("✅ Conexión a DB establecida");

    // Sincronizar todos los modelos
    await sequelize.sync({  alter: true });
    console.log("✅ Modelos sincronizados exitosamente");

    console.log("🎉 Sincronización completada");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante la sincronización:", error);
    process.exit(1);
  }
};

syncDatabase();


//node src/scripts/syncDB.js