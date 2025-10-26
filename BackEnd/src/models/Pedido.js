import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const Pedido = sequelize.define('Pedido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  estado: { 
    type: DataTypes.ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'), 
    allowNull: false, 
    defaultValue: 'pendiente' 
  },
  metodo: { type: DataTypes.STRING, allowNull: false },
  idUsuario: { type: DataTypes.INTEGER, allowNull: false },
  activo: { 
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
}, {
  tableName: 'pedidos',
  timestamps: true,
});

export default Pedido;