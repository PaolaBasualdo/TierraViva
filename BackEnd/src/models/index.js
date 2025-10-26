import sequelize from "../config/database.js";

// Modelos
import Usuario from './Usuario.js';
import Rol from './Rol.js';
import UsuarioRol from './UsuarioRol.js';
import Producto from './Producto.js';
import Categoria from './Categoria.js';
import Carrito from './Carrito.js';
import CarritoProducto from './CarritoProducto.js';
import Pedido from './Pedido.js';
import PedidoProducto from './PedidoProducto.js';
import Pago from './Pago.js';
import Notificacion  from "./Notificacion.js";

/* Relaciones */

// === Usuario <-> Rol (muchos a muchos) ===
Usuario.belongsToMany(Rol, {
  through: UsuarioRol,
  foreignKey: 'idUsuario',
  otherKey: 'idRol',
  as: 'roles'
});
Rol.belongsToMany(Usuario, {
  through: UsuarioRol,
  foreignKey: 'idRol',
  otherKey: 'idUsuario',
  as: 'usuarios'
});

// === Usuario -> Carrito (uno a muchos, pero solo uno activo a la vez) ===
Usuario.hasMany(Carrito, {
  foreignKey: 'idUsuario',
  as: 'carritos'
});
Carrito.belongsTo(Usuario, {
  foreignKey: 'idUsuario',
  as: 'usuario'
});

// === Usuario -> Pedido (uno a muchos) ===
Usuario.hasMany(Pedido, {
  foreignKey: 'idUsuario',
  as: 'pedidos'
});
Pedido.belongsTo(Usuario, {
  foreignKey: 'idUsuario',
  as: 'usuario'
});

// === Usuario -> Producto (uno a muchos) ===
Usuario.hasMany(Producto, {
  foreignKey: 'idUsuario',
  as: 'productos'
});
Producto.belongsTo(Usuario, {
  foreignKey: 'idUsuario',
  as: 'vendedor'
});

// === Producto <-> Carrito (muchos a muchos) ===
Producto.belongsToMany(Carrito, {
  through: CarritoProducto,
  foreignKey: 'idProducto',
  otherKey: 'idCarrito',
  as: 'carritos'
});
Carrito.belongsToMany(Producto, {
  through: CarritoProducto,
  foreignKey: 'idCarrito',
  otherKey: 'idProducto',
  as: 'productos'
});

// === Producto <-> Pedido (muchos a muchos) ===
Producto.belongsToMany(Pedido, {
  through: PedidoProducto,
  foreignKey: 'idProducto',
  otherKey: 'idPedido',
  as: 'pedidos'
});
Pedido.belongsToMany(Producto, {
  through: PedidoProducto,
  foreignKey: 'idPedido',
  otherKey: 'idProducto',
  as: 'productos'
});

// === Producto -> Categoria (muchos a uno) ===
Categoria.hasMany(Producto, {
  foreignKey: 'idCategoria',
  as: 'productos'
});
Producto.belongsTo(Categoria, {
  foreignKey: 'idCategoria',
  as: 'categoria'
});

// === Pedido -> Pago (uno a uno) ===
Pedido.hasOne(Pago, {
  foreignKey: 'idPedido',
  as: 'pago'
});
Pago.belongsTo(Pedido, {
  foreignKey: 'idPedido',
  as: 'pedido'
});
// Usuario ↔ Notificacion (1 a muchos)
Usuario.hasMany(Notificacion, { foreignKey: "usuarioId", as: "notificaciones" });
Notificacion.belongsTo(Usuario, { foreignKey: "usuarioId", as: "usuario" });



/* Exportar todo junto */
export {
  sequelize,
  Usuario,
  Rol,
  UsuarioRol,
  Producto,
  Categoria,
  Carrito,
  CarritoProducto,
  Pedido,
  PedidoProducto,
  Pago, 
  Notificacion
};