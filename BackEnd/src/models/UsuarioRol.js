// src/models/UsuarioRol.js
import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const UsuarioRol = sequelize.define('UsuarioRol', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  idUsuario: { type: DataTypes.INTEGER, allowNull: false },
  idRol: { type: DataTypes.INTEGER, allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true } // Soft delete
}, {
  tableName: 'usuario_rol',
  timestamps: false
});

export default UsuarioRol;

