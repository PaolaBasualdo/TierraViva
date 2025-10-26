import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const Pago = sequelize.define('Pago', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  montoTotal: { type: DataTypes.FLOAT, allowNull: false },
  metodo: { type: DataTypes.STRING, allowNull: false },
  estado: { 
    type: DataTypes.ENUM('completado', 'pendiente', 'fallido'), 
    allowNull: false, 
    defaultValue: 'pendiente' 
  },
  activo: { 
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
}, {
  tableName: 'pagos',
  timestamps: true
});

export default Pago;
