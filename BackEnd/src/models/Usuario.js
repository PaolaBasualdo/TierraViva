import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcrypt";

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Datos básicos
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, 
      // Puede ser null si se registra con Google/Facebook
    },
    imagen: {
      type: DataTypes.STRING, 
      allowNull: true,
    },

    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Estado y roles
    estado: {
      type: DataTypes.ENUM("activo", "suspendido", "pendiente"),
      allowNull: false,
      defaultValue: "activo",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    es_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // Campos para login social
    proveedor: {
      type: DataTypes.STRING, // local | google | facebook
      allowNull: false,
      defaultValue: "local",
    },
    proveedorId: {
      type: DataTypes.STRING, // id que da Google/Facebook
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,

    hooks: {
      // Antes de crear usuario
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      // Antes de actualizar usuario
      beforeUpdate: async (usuario) => {
        if (usuario.changed("password") && usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
  }
);

// Método de instancia para validar contraseña
Usuario.prototype.validarPassword = async function (passwordPlano) {
  if (!this.password) return false; // si no tiene password (ej: Google login)
  return await bcrypt.compare(passwordPlano, this.password);
};

Usuario.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default Usuario;
