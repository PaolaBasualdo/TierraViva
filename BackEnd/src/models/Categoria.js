import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const Categoria = sequelize.define('Categoria', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
  imagenUrl: { type: DataTypes.STRING, allowNull: true },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
},

{
  tableName: 'categorias',
  timestamps: true
});

export default Categoria;