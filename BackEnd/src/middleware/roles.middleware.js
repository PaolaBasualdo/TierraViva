// src/middleware/roles.middleware.js
export const adminOnly = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ success: false, message: "No autenticado" });
  }

  // En tu modelo el campo es `es_admin`
  if (req.usuario.es_admin) return next();

  return res.status(403).json({ success: false, message: "Acceso denegado: requiere rol administrador" });
};

export const sellerOnly = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ success: false, message: "No autenticado" });
  }

  // Admins siempre pasan
  if (req.usuario.es_admin) return next();

  // En tu modelo todavía no tenés "rol vendedor" como campo,
  // pero si pensás manejarlo con una relación a otra tabla de roles
  // este bloque se puede usar más adelante.
  const roles = (req.usuario.roles || []).map(r => r.nombre.toLowerCase());
  if (roles.includes("vendedor") || roles.includes("seller")) return next();

  return res.status(403).json({ success: false, message: "Acceso denegado: requiere rol vendedor" });
};
