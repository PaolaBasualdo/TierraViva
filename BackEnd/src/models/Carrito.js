import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Carrito = sequelize.define(
  "Carrito",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios", // 👈 nombre de la tabla, no del modelo
        key: "id",
      },
    },
  },
  {
    tableName: "carritos",
    timestamps: false,
  }
);

export default Carrito;
