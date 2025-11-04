import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Producto = sequelize.define(
  "Producto",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, unique: true, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    precio: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
    estado: {
      type: DataTypes.ENUM("pendiente", "aprobado", "rechazado"),
      allowNull: false,
      defaultValue: "pendiente",
    },
    etiqueta: {
      type: DataTypes.ENUM(
        "producto de estacion",
        "stock limitado",
        "edicion unica"
      ),
      allowNull: true,
    },
    idUsuario: { type: DataTypes.INTEGER, allowNull: false },
    idCategoria: { type: DataTypes.INTEGER, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "productos",
    timestamps: true,
  }
);

export default Producto;
