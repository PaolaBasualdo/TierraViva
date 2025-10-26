// src/middleware/validations.js
import { body, param, query, validationResult } from "express-validator";


// -------------------- Middleware general para validar resultados --------------------
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// -------------------- Productos --------------------
export const validateProductoCreate = [
  body("nombre")
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("precio")
    .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0"),
  body("stock")
    .isInt({ min: 0 }).withMessage("El stock debe ser un número entero mayor o igual a 0"),
  body("idCategoria")
    .optional()
    .isInt({ min: 1 }).withMessage("El ID de categoría debe ser un número entero positivo"),
  body("descripcion")
    .optional()
    .isLength({ max: 1000 }).withMessage("La descripción no puede exceder 1000 caracteres"),
  body("etiqueta")
    .optional()
    .isIn(["producto de estacion", "stock limitado", "edicion unica"])
    .withMessage("Etiqueta inválida"),
  body("idUsuario")
    .isInt({ min: 1 }).withMessage("El ID del usuario es obligatorio y debe ser un entero positivo")
];

export const validateProductoUpdate = [
  body("nombre")
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("precio")
    .optional()
    .isFloat({ min: 0 }).withMessage("El precio debe ser un número mayor o igual a 0"),
  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("El stock debe ser un número entero mayor o igual a 0"),
  body("idCategoria")
    .optional()
    .isInt({ min: 1 }).withMessage("El ID de categoría debe ser un número entero positivo"),
  body("descripcion")
    .optional()
    .isLength({ max: 1000 }).withMessage("La descripción no puede exceder 1000 caracteres"),
  body("etiqueta")
    .optional()
    .isIn(["producto de estacion", "stock limitado", "edicion unica"])
    .withMessage("Etiqueta inválida")
];

export const validateProductoId = [
  param("id")
    .isInt({ min: 1 }).withMessage("El ID del producto debe ser un número entero positivo")
];

// -------------------- Categorías --------------------
export const validateCategoriaCreate = [
  body("nombre")
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("imagenUrl")
    .optional()
    .isURL().withMessage("La URL de la imagen debe ser válida")
];

export const validateCategoriaUpdate = [
  body("nombre")
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("imagenUrl")
    .optional()
    .isURL().withMessage("La URL de la imagen debe ser válida")
];

export const validateCategoriaId = [
  param("id")
    .isInt({ min: 1 }).withMessage("El ID de categoría debe ser un número entero positivo")
];

// -------------------- Usuarios --------------------
export const validateUsuarioCreate = [
  body("nombre")
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("email")
    .isEmail().withMessage("Debe ser un email válido")
    .normalizeEmail(),
  body("rolId")
    .isInt({ min: 1 }).withMessage("El rol debe ser un número entero positivo")
];

export const validateUsuarioUpdate = [
  body("nombre")
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("email")
    .optional()
    .isEmail().withMessage("Debe ser un email válido")
    .normalizeEmail(),
  body("rolId")
    .optional()
    .isInt({ min: 1 }).withMessage("El rol debe ser un número entero positivo")
];

// -------------------- Paginación --------------------
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("La página debe ser un número entero positivo"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("El límite debe ser un número entre 1 y 100")
];

// -------------------- AUTH --------------------


// Registro
export const validateRegister = [
  body("nombre")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),

  body("email")
    .notEmpty().withMessage("El email es obligatorio")
    .isEmail().withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("telefono")
    .optional()
    .isLength({ min: 6, max: 20 }).withMessage("El teléfono debe tener entre 6 y 20 caracteres"),

  body("direccion")
    .optional()
    .isLength({ max: 200 }).withMessage("La dirección no puede tener más de 200 caracteres")
];

// Login
export const validateLogin = [
  body("email")
    .notEmpty().withMessage("El email es obligatorio")
    .isEmail().withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("La contraseña es obligatoria")
];

export const validateGoogleLogin = [
  body("token")
    .notEmpty().withMessage("El token de Google es obligatorio")
];
