// src/models/Notificacion.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Notificacion = sequelize.define("Notificacion", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM("pendiente", "leido"),
    defaultValue: "pendiente"
  },
  creadoEn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  leidoEn: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "Notificaciones", // fuerza el plural en la DB
  timestamps: false
});

export default Notificacion;
