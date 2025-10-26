import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const Rol = sequelize.define('Rol', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
  activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }, // 👈 agregado
}, {
  tableName: 'roles',
  timestamps: false
});

export default Rol;
