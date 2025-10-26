import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const PedidoProducto = sequelize.define('PedidoProducto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.FLOAT, allowNull: false },
  subtotal: { type: DataTypes.FLOAT, allowNull: false },

  // 🔹 Relación con Pedido
  idPedido: { type: DataTypes.INTEGER, allowNull: false },

  // 🔹 Relación con Producto
  idProducto: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'pedido_producto',
  timestamps: false
});

export default PedidoProducto;
