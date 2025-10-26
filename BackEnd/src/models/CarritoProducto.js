import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const CarritoProducto = sequelize.define('CarritoProducto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  idCarrito: { type: DataTypes.INTEGER, allowNull: false },
  idProducto: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  subtotal: { type: DataTypes.FLOAT, allowNull: false },
}, {
  tableName: 'carrito_producto',
  timestamps: false
});

export default CarritoProducto;