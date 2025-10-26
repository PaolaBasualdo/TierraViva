// src/controllers/usuario.controller.js

import { Usuario, Rol, Notificacion } from "../models/index.js";
import { validationResult } from "express-validator";
import { io } from "../../index.js";

import { enviarEmail } from "../config/emailConfig.js";

// Perfil del usuario logueado (ruta protegida)
export const perfilController = async (req, res) => {
  res.json({ success: true, data: req.usuario });
};

// Obtener todos los usuarios con paginación y filtros
export const getUsuarios = async (req, res) => {
  try {
    console.log("GET /usuarios v1");

    const { page = 1, limit = 10, estado, incluirInactivos } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (!incluirInactivos || incluirInactivos === "false") {
      whereClause.activo = true; // solo activos por defecto
    }
    if (estado) {
      whereClause.estado = estado; // filtrar por estado
    }

    const usuarios = await Usuario.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Rol,
          as: "roles",
          attributes: ["id", "nombre"],
          through: { attributes: [] },
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["nombre", "ASC"]], // orden alfabético por nombre
    });

    res.json({
      success: true,
      data: usuarios.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(usuarios.count / limit),
        totalItems: usuarios.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error en getUsuarios:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los usuarios",
    });
  }
};

// Obtener un usuario por ID (activo o inactivo)
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
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
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    res.json({ success: true, data: usuario });
  } catch (error) {
    console.error("Error en getUsuarioById:", error);
    res.status(500).json({ success: false, error: "Error interno" });
  }
};
// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array(),
      });
    }

    const { nombre, email, password, telefono, direccion, estado } = req.body;

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      telefono,
      direccion,
      estado,
      activo: true, // siempre activo al crearse
    });
    if (req.body.roles && req.body.roles.length > 0) {
      await nuevoUsuario.setRoles(req.body.roles); // 👈 Sequelize genera este método
    }

    res.status(201).json({
      success: true,
      data: nuevoUsuario,
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    console.error("Error en createUsuario:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el usuario",
    });
  }
};
// Actualizar usuario (admin)
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array(),
      });
    }

    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Rol, as: "roles", through: { attributes: [] } }],
    });

    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" });
    }

    // ✅ Validación correcta de admin
    if (!req.usuario.es_admin) {
      return res
        .status(403)
        .json({ success: false, message: "No tenés permiso" });
    }

    const {
      nombre,
      email,
      password,
      telefono,
      direccion,
      estado,
      activo,
      roles,
    } = req.body;

    // Guardamos estado y roles anteriores para detectar cambios
    const rolesPrevios = usuario.roles.map((r) => r.nombre);
    const estadoPrevio = usuario.estado;

    await usuario.update({ nombre, email, password, telefono, direccion, estado, activo });

    if (roles) {
      await usuario.setRoles(roles);
    }

    // --------------- EMITIR EVENTOS SOCKET.IO ---------------
    const rolVendedor = roles?.includes(2); // id 2 = vendedor
    const teniaRolVendedor = rolesPrevios.includes("vendedor");
    if (rolVendedor !== teniaRolVendedor) {
      io.to(`user_${usuario.id}`).emit("respuestaAdmin", {
        tipo: "rolVendedor",
        estado: rolVendedor ? "aprobado" : "rechazado",
      });
    }

    if (estado && estado !== estadoPrevio) {
      io.to(`user_${usuario.id}`).emit("respuestaAdmin", {
        tipo: "estadoUsuario",
        estado,
      });
    }

    res.json({
      success: true,
      data: usuario,
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error en updateUsuario:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el usuario",
    });
  }
};

export const testEmail = async (req, res) => {
  try {
    const enviado = await enviarEmail({
      para: "tu_correo_destino@gmail.com", // <-- reemplazá por el correo donde querés recibir la prueba
      asunto: "📬 Prueba de envío desde Tierra Viva",
      mensajeHtml: `
        <h2>¡Funciona!</h2>
        <p>Este es un correo de prueba enviado desde el backend de <b>Tierra Viva</b>.</p>
        <p>Fecha: ${new Date().toLocaleString()}</p>
      `,
    });

    if (enviado) {
      return res.status(200).json({ success: true, message: "Correo enviado correctamente." });
    } else {
      return res.status(500).json({ success: false, message: "Error al enviar el correo." });
    }
  } catch (error) {
    console.error("Error al enviar correo de prueba:", error);
    res.status(500).json({ success: false, message: "Fallo al enviar el correo." });
  }
};


{
  /*export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: "Datos de entrada inválidos", details: errors.array() });
    }

    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Rol, as: "roles", through: { attributes: [] } }],
    });

    if (!usuario) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    const { nombre, email, password, telefono, direccion, estado, activo, roles } = req.body;

    // Guardamos estado y roles anteriores para detectar cambios
    const rolesPrevios = usuario.roles.map(r => r.nombre);
    const estadoPrevio = usuario.estado;

    await usuario.update({ nombre, email, password, telefono, direccion, estado, activo });

    if (roles) {
      await usuario.setRoles(roles);
    }

    // --------------- EMITIR EVENTOS SOCKET.IO ---------------
    // Detectar cambio de rol vendedor
    const rolVendedor = roles?.includes(2); // id 2 = vendedor
    const teniaRolVendedor = rolesPrevios.includes("vendedor");
    if (rolVendedor !== teniaRolVendedor) {
      io.to(`user_${usuario.id}`).emit("respuestaAdmin", {
        tipo: "rolVendedor",
        estado: rolVendedor ? "aprobado" : "rechazado",
      });
    }

    // Detectar cambio de estado del usuario
    if (estado && estado !== estadoPrevio) {
      io.to(`user_${usuario.id}`).emit("respuestaAdmin", {
        tipo: "estadoUsuario",
        estado, // "activo", "pendiente", "suspendido", etc.
      });
    }

    res.json({
      success: true,
      data: usuario,
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error en updateUsuario:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor", message: "No se pudo actualizar el usuario" });
  }
};*/
}

// Obtener perfil del usuario autenticado
// Obtener perfil del usuario autenticado
export const getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: {
        model: Rol,
        as: "roles",
        attributes: ["nombre"],
      },
    });

    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

    res.status(200).json({
      success: true,
      data: {
        ...usuario.toJSON(), // mantiene todos los campos (nombre, email, direccion, telefono, etc.)
        roles: usuario.roles.map((r) => r.nombre), // solo nombres, ej: ["comprador", "vendedor"]
        imageUrl: usuario.imagen
          ? `${BASE_URL}/images/${usuario.imagen}`
          : null, // <-- solo agregamos esto
      },
    });
  } catch (error) {
    console.error("Error en getPerfil:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener el perfil" });
  }
};

// Eliminar un usuario (soft delete → activo = false)
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario || usuario.activo === false) {
      return res.status(404).json({
        success: false,
        error: "Usuario no encontrado",
      });
    }

    await usuario.update({ activo: false });

    res.json({
      success: true,
      message: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error en deleteUsuario:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el usuario",
    });
  }
};

// Actualizar perfil (INTEGRACIÓN BÁSICA DE MULTER - SIN LIMPIEZA)

export const updatePerfil = async (req, res) => {
    
  if (!req.usuario) {
    return res
      .status(401)
      .json({ success: false, message: "Usuario no autenticado" });
  }

  const usuario = await Usuario.findByPk(req.usuario.id);

  if (!usuario) {
    return res
      .status(404)
      .json({ success: false, message: "Usuario no encontrado en la DB" });
  }

  // 1. Obtener datos de texto (req.body) y el archivo (req.file)
  const { nombre, telefono, direccion, password } = req.body;
  const newImageData = req.file; // Archivo NUEVO subido por Multer

  // 2. Lógica para la Imagen
  if (newImageData) {
      // Si se subió una NUEVA imagen (Multer la procesó y guardó)
      const newFileName = newImageData.filename;

      // Actualizamos la referencia en la DB con el nuevo nombre,
      //    sobrescribiendo el valor anterior.
      usuario.imagen = newFileName; 
  }
  // NOTA: Si el usuario ya tenía una imagen, la imagen vieja se pierde
  // la referencia en la DB, pero el archivo físico permanece en el disco.


  // 3. Actualizar otros datos personales
  if (nombre) usuario.nombre = nombre;
  if (telefono) usuario.telefono = telefono;
  if (direccion) usuario.direccion = direccion;
  
  // Asumiendo que tu hook beforeUpdate de Sequelize maneja la encriptación
  if (password) usuario.password = password; 

  // 4. Guardar todos los cambios en la base de datos
  await usuario.save();

  // 5. Preparar respuesta
  const usuarioResponse = usuario.toJSON();
  // Añadimos la URL accesible para el frontend (si tiene imagen)
  if (usuario.imagen) {
    usuarioResponse.imageUrl = `/images/${usuario.imagen}`;
  }


  res.json({
    success: true,
    message: "Perfil actualizado correctamente",
    data: usuarioResponse,
  });
};
//actualizar rol vendedor
{
  /*export const patchRolVendedor = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: { model: Rol, as: "roles", attributes: ["nombre"] },
    });

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Si el switch viene en true, agregamos rol vendedor; si viene false, lo removemos
    const { esVendedor } = req.body;

    const rolVendedor = await Rol.findOne({ where: { nombre: "vendedor" } });
    if (!rolVendedor) {
      return res.status(500).json({ success: false, message: "Rol 'vendedor' no encontrado" });
    }

    if (esVendedor) {
      await usuario.addRol(rolVendedor);
    } else {
      await usuario.removeRol(rolVendedor);
    }

    // Emitimos evento a todos los administradores conectados
    io.emit("solicitarVendedor", {
      usuarioId: usuario.id,
      nombre: usuario.nombre,
      esVendedor,
    });

    res.status(200).json({ success: true, data: { id: usuario.id, nombre: usuario.nombre, esVendedor } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al actualizar rol vendedor" });
  }
};*/
}

export const patchRolVendedor = async (req, res) => {
  try {
    const usuario = req.usuario; // usuario que presionó el switch

    // --- Crear la notificación en la base de datos ---
    await Notificacion.create({
      usuarioId: 9, // id del admin (vos)
      tipo: "solicitudVendedor",
      mensaje: `El usuario ${usuario.nombre} (${usuario.email}) solicita ser vendedor.`,
      estado: "pendiente",
    });

    // --- Enviar correo al administrador ---
    await enviarEmail({
      para: "paoladeembalse@gmail.com",
      asunto: "Nueva solicitud de vendedor",
      mensajeHtml: `
        <h3>Solicitud de usuario</h3>
        <p>El usuario <b>${usuario.nombre}</b> (${usuario.email}) ha solicitado ser vendedor.</p>
        <p>Verificar y aprobar desde el panel de administración.</p>
      `,
    });

    return res.json({
      success: true,
      message: "Solicitud enviada al administrador correctamente.",
    });
  } catch (error) {
    console.error("Error en patchRolVendedor:", error);
    return res.status(500).json({
      success: false,
      message: "No se pudo enviar la solicitud al administrador.",
    });
  }
};



// GET /api/v1/productos/mios
export const getMisProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { usuarioId: req.usuario.id }, // 👈 asumiendo que Producto tiene usuarioId
    });

    res.json({ success: true, data: productos });
  } catch (error) {
    console.error("Error en getMisProductos:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor" });
  }
};
