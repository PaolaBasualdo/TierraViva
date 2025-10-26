// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import { Usuario, Rol } from "../models/index.js"; // ajustá según exportes

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Traigo usuario + roles (importante para autorizaciones)
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Rol,
            as: "roles",
            attributes: ["id", "nombre"],
            through: { attributes: [] },
          },
        ],
      });

      if (!usuario) {
        return res.status(401).json({ success: false, message: "Usuario no encontrado" });
      }

      req.usuario = usuario; // UNIFICAR: usar siempre req.usuario
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: "Token inválido o expirado" });
    }
  } else {
    return res.status(401).json({ success: false, message: "No autorizado, no hay token" });
  }
};
