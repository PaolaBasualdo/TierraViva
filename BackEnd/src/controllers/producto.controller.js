// src/controllers/producto.controller.js
import { Usuario, Producto, Notificacion, Categoria } from "../models/index.js";
import { validationResult } from "express-validator";
import { io } from "../../index.js";
import { enviarEmail } from "../config/emailConfig.js";
import { Op } from "sequelize";


export const getProductos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoria,
      incluirInactivos = "false",
      admin = "false",
      orderBy,
      minPrecio,
      maxPrecio,
      estado,
      search,
      idUsuario,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // 🔹 Filtrar por categoría
    if (categoria) whereClause.idCategoria = categoria;

    // 🔹 Filtrar por rango de precios
    if (minPrecio || maxPrecio) {
      whereClause.precio = {};
      if (minPrecio) whereClause.precio[Op.gte] = parseFloat(minPrecio);
      if (maxPrecio) whereClause.precio[Op.lte] = parseFloat(maxPrecio);
    }

    // 🔹 Filtrar por estado (solo si el valor es válido)
    if (estado && ["pendiente", "aprobado", "rechazado"].includes(estado)) {
      whereClause.estado = estado;
    }

    // 🔹 Filtrar por usuario específico (solo para admin)
    if (admin === "true" && idUsuario) {
      whereClause.idUsuario = idUsuario;
    }

    // 🔹 Filtro de texto (nombre o descripción)
    if (search) {
  whereClause[Op.or] = [
    { nombre: { [Op.like]: `%${search}%` } },
    { descripcion: { [Op.like]: `%${search}%` } },
  ];
}

    // 🔸 Si NO es admin → solo mostrar aprobados y activos
    if (admin !== "true") {
      whereClause.activo = true;
      whereClause.estado = "aprobado";
    } else {
      if (incluirInactivos !== "true") whereClause.activo = true;
    }

    // 🔹 Ordenamiento dinámico
    let order = [["nombre", "ASC"]];
    if (orderBy === "fecha_desc") order = [["createdAt", "DESC"]];
    else if (orderBy === "fecha_asc") order = [["createdAt", "ASC"]];
    else if (orderBy === "precio_asc") order = [["precio", "ASC"]];
    else if (orderBy === "precio_desc") order = [["precio", "DESC"]];

    const productos = await Producto.findAndCountAll({
  where: whereClause,
  include: {
    model: Categoria,
    as: "categoria",
    attributes: ["id", "nombre"], // solo lo que necesitas
  },
  limit: parseInt(limit),
  offset: parseInt(offset),
  order,
});

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error en getProductos:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los productos",
    });
  }
};


{/*
/// Obtener todos los productos con paginación y filtros
export const getProductos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoria,
      incluirInactivos = "false",
      admin = "false",
      orderBy, // nuevo parámetro
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filtrar por categoría si se indica
    if (categoria) {
      whereClause.idCategoria = categoria;
    }

    // Si NO es admin → solo mostrar aprobados y activos
    if (admin !== "true") {
      whereClause.activo = true;
      whereClause.estado = "aprobado";
    } else {
      // Si es admin y no pide incluir inactivos, se filtra solo eso
      if (incluirInactivos !== "true") {
        whereClause.activo = true;
      }
      // El admin puede ver pendientes, rechazados, etc.
    }

    //  Ordenamiento dinámico
    let order = [["nombre", "ASC"]]; // default
    if (orderBy === "fecha_desc") {
      order = [["createdAt", "DESC"]];
    } else if (orderBy === "fecha_asc") {
      order = [["createdAt", "ASC"]];
    }

    const productos = await Producto.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order,
    });

    res.json({
      success: true,
      data: productos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(productos.count / limit),
        totalItems: productos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error en getProductos:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los productos",
    });
  }
};*/}




// Obtener un producto por ID (ahora devuelve aunque esté inactivo)
export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /productos/:id v1", { id });

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de producto inválido",
      });
    }

    // 🔹 Incluimos la categoría asociada
    const producto = await Producto.findByPk(id, {
      include: {
        model: Categoria,
        as: "categoria",
        attributes: ["id", "nombre"], // solo lo necesario
      },
    });

    if (!producto) {
      return res.status(404).json({
        success: false,
        error: "Producto no encontrado",
      });
    }

    res.json({
      success: true,
      data: producto,
    });
  } catch (error) {
    console.error("Error en getProductoById:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el producto",
    });
  }
};
// Crear un nuevo producto (INTEGRACIÓN CON MULTER)
export const createProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de texto inválidos",
        details: errors.array(),
      });
    }

    const idUsuario = req.usuario?.id;
    if (!idUsuario)
      return res
        .status(401)
        .json({ success: false, message: "No autenticado" });

    const imagenData = req.file;
    if (!imagenData) {
      return res.status(400).json({
        success: false,
        message: "Se requiere una imagen válida.",
      });
    }

    const nombreArchivo = imagenData.filename;
    const { nombre, descripcion, precio, stock, idCategoria } = req.body;

    const nuevoProducto = await Producto.create({
      nombre,
      imagen: nombreArchivo,
      descripcion,
      precio,
      stock,
      idCategoria,
      idUsuario,
      activo: true,
    });

    // -------------------- NOTIFICACIÓN POR EMAIL --------------------
    const adminEmail = "paoladeembalse@gmail.com";
    const asunto = `Nuevo producto pendiente: ${nuevoProducto.nombre}`;
    const mensajeHtml = `
      <p>Se ha creado un nuevo producto que requiere revisión:</p>
      <ul>
        <li><strong>Nombre:</strong> ${nuevoProducto.nombre}</li>
        <li><strong>Descripción:</strong> ${nuevoProducto.descripcion}</li>
        <li><strong>Precio:</strong> $${nuevoProducto.precio}</li>
        <li><strong>Stock:</strong> ${nuevoProducto.stock}</li>
        <li><strong>Vendedor:</strong> ${req.usuario.nombre}</li>
      </ul>
      <p>Acceda al panel de administración para aprobarlo.</p>
    `;

    await enviarEmail({ para: adminEmail, asunto, mensajeHtml });

    // -------------------- NOTIFICACIÓN EN DB  --------------------
    await Notificacion.create({
      mensaje: `Nuevo producto pendiente: "${nuevoProducto.nombre}" de ${req.usuario.nombre}`,
      tipo: "nuevoProducto",
      itemId: nuevoProducto.id,
      leido: false,
      usuarioId: 9, // el admin
    });

    res.status(201).json({
      success: true,
      data: {
        ...nuevoProducto.toJSON(),
        imageUrl: `/images/${nombreArchivo}`,
      },
      message: "Producto creado y administrador notificado por email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error interno" });
  }
};


{/*export const createProducto = async (req, res) => {
  try {
    // 1. Manejo de Errores de Validación (si aplicables a campos de texto)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de texto inválidos",
        details: errors.array(),
      });
    }

    // 2. Verificar autenticación
    const idUsuario = req.usuario?.id;
    if (!idUsuario)
      return res
        .status(401)
        .json({ success: false, message: "No autenticado" });

    // 3. Obtener el nombre del archivo subido por Multer
    const imagenData = req.file; // Multer adjunta la información del archivo aquí

    // 4. VALIDACIÓN DE ARCHIVO (CRUCIAL)
    if (!imagenData) {
      // Si Multer no encontró el campo 'image' o si el filtro (fileFilter) lo rechazó
      return res.status(400).json({
        success: false,
        message:
          "Se requiere una imagen válida. Asegúrate de enviar el campo 'image' y de que sea un archivo JPG o PNG.",
      });
    }

    // El nombre del archivo que Multer guardó en el disco:
    const nombreArchivo = imagenData.filename;

    // 5. Obtener los datos de texto del cuerpo (req.body)
    // NOTA: El campo 'imagen' ya NO se espera en req.body.
    const { nombre, descripcion, precio, stock, idCategoria } = req.body;

    // 6. Crear el Producto en la Base de Datos
    const nuevoProducto = await Producto.create({
      nombre,
      // ¡INTEGRACIÓN DE MULTER! Guardamos el nombre del archivo
      imagen: nombreArchivo,
      descripcion,
      precio,
      stock,
      idCategoria,
      idUsuario,
      activo: true,
    });
    // -------------------- NOTIFICACIÓN A ADMINS --------------------

    // 1. CREAR LA NOTIFICACIÓN en la DB (para persistencia)
    // Es un poco redundante crear una notificación por cada admin en la DB,
    // pero funciona si luego el admin solo ve sus notificaciones.
    const admins = await Usuario.findAll({
      where: { es_Admin: true },
      attributes: ["id"],
    });

    const notificacionData = {
      mensaje: `Nuevo producto pendiente: "${nuevoProducto.nombre}" de ${req.usuario.nombre}`,
      tipo: "nuevoProducto", //  tipo para el Front-end
      itemId: nuevoProducto.id, // ID del producto
      leido: false,
    };

    // Creamos la notificacion para cada admin.
    const notificacionesCreadas = await Promise.all(
      admins.map((a) =>
        Notificacion.create({ ...notificacionData, usuarioId: a.id })
      )
    );

    // 2. EMITIR POR SOCKET A LA SALA 'admins'
    // Enviamos el evento `nuevaNotificacion` solo a los usuarios que se unieron a esa sala.
    io.to("admins").emit("nuevaNotificacion", {
      // Puedes enviar las notificaciones creadas o un resumen.
      message: notificacionData.mensaje,
      productoId: nuevoProducto.id,
      vendedor: req.usuario.nombre,
    });

    res.status(201).json({
      success: true,
      data: {
        ...nuevoProducto.toJSON(),
        // Ruta completa para que el frontend pueda visualizar la imagen
        imageUrl: `/images/${nombreArchivo}`,
      },
      message: "Producto creado y esperando aprobación.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error interno" });
  }
};*/}

{
  /*export const createProducto = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: "Datos inválidos", details: errors.array() });
    }

    // Tomo el id del vendedor desde el token
    const idUsuario = req.usuario ? req.usuario.id : null;
    if (!idUsuario) return res.status(401).json({ success: false, message: "No autenticado" });

    const { nombre, descripcion, precio, stock, idCategoria } = req.body;

    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      stock,
      idCategoria,
      idUsuario,
      activo: true,
    });

    // Emitir evento a admins
io.emit("nuevoProducto", {
  id: nuevoProducto.id,
  nombre: nuevoProducto.nombre,
  vendedor: req.usuario.nombre, // o como tengas el nombre en req.usuario
  idUsuario: req.usuario.id,
  estado: "pendiente"
});

res.status(201).json({ success: true, data: nuevoProducto, message: "Producto creado" });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error interno" });
  }
};*/
}

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validaciones de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos inválidos",
        details: errors.array(),
      });
    }

    // 2️⃣ Buscar producto
    const producto = await Producto.findByPk(id);
    if (!producto)
      return res
        .status(404)
        .json({ success: false, error: "Producto no encontrado" });

    // 3️⃣ Verificar permisos
    const esAdmin = req.usuario.es_admin;
    const esVendedorPropio = producto.idUsuario === req.usuario.id;

    // Solo admin o vendedor propio con producto pendiente puede editar
    if (!esAdmin && (!esVendedorPropio || producto.estado !== "pendiente")) {
      return res.status(403).json({
        success: false,
        message: "No tenés permiso para editar este producto",
      });
    }

    // 4️⃣ Preparar objeto de actualización
    const {
      nombre,
      descripcion,
      precio,
      stock,
      idCategoria,
      estado,
      etiqueta,
      activo,
    } = req.body;

    const updates = {
      nombre,
      descripcion,
      precio,
      stock,
      idCategoria,
      estado,
      etiqueta,
      // solo admins pueden cambiar activo
      activo: esAdmin ? activo : producto.activo,
    };

    // 5️⃣ Manejo de imagen

    if (req.file) {
      // Nueva imagen subida
      updates.imagen = req.file.filename;
    } else if (
      req.body.removeImage === "true" ||
      req.body.removeImage === true
    ) {
      // Eliminar imagen existente
      updates.imagen = null;
    } else {
      // Mantener imagen anterior
      updates.imagen = producto.imagen;
    }

    // 6️⃣ Actualizar producto en la BD
    await producto.update(updates);

    // 7️⃣ Notificación si un admin cambia estado
    if (esAdmin && estado && estado !== producto.estado) {
      const notificacion = await Notificacion.create({
        usuarioId: producto.idUsuario,
        mensaje: `Tu producto "${producto.nombre}" fue ${estado}`,
        leido: false,
      });

      io.to(`user_${producto.idUsuario}`).emit(
        "nuevaNotificacion",
        notificacion
      );
    }

    res.json({
      success: true,
      data: producto,
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error en updateProducto:", error);
    res.status(500).json({
      success: false,
      error: "Error interno",
      message: "No se pudo actualizar el producto",
    });
  }
};

{
  /*export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array(),
      });
    }

    // Buscar producto
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ success: false, error: "Producto no encontrado" });

    // Si no es admin, verificar que sea dueño
    if (!req.usuario.esAdmin && producto.idUsuario !== req.usuario.id) {
      return res.status(403).json({ success: false, message: "No tenés permiso para editar este producto" });
    }

    // Desestructuramos campos posibles a actualizar
    const { nombre, descripcion, precio, stock, idCategoria, estado, etiqueta, activo } = req.body;

    await producto.update({
      nombre,
      descripcion,
      precio,
      stock,
      idCategoria,
      estado,
      etiqueta,
      activo,
    });

    // Notificación con Socket.IO si el admin cambió el estado
    if (req.usuario.esAdmin && estado) {
      io.to(`user_${producto.idUsuario}`).emit("respuestaAdmin", {
        tipo: "producto",
        estado, // aprobado / rechazado / suspendido
        idProducto: producto.id,
        mensaje: `Tu producto "${producto.nombre}" fue ${estado}`
      });
    }

    res.json({
      success: true,
      data: producto,
      message: "Producto actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error en updateProducto:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el producto",
    });
  }
};*/
}

// Eliminar un producto (soft delete → activo = false)
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // updateProducto: previa búsqueda
    const producto = await Producto.findByPk(id);
    if (!producto)
      return res
        .status(404)
        .json({ success: false, error: "Producto no encontrado" });

    // Si no es admin, verificar que sea dueño
    if (!req.usuario.esAdmin && producto.idUsuario !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: "No tenés permiso para editar este producto",
      });
    }

    await producto.update({ activo: false });

    res.json({
      success: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error en deleteProducto:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el producto",
    });
  }
};
// GET /api/v1/productos/mios

export const getMisProductos = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) return res.status(401).json({ message: "No autorizado" });

    const productos = await Producto.findAll({
      where: { idUsuario: usuarioId },
      include: [
        {
          model: Usuario,
          as: "vendedor",
          attributes: ["id", "nombre", "email"],
        },
      ],
      order: [["nombre", "ASC"]],
    });

    res.json({ success: true, data: productos });
  } catch (error) {
    console.error("Error en getMisProductos:", error);
    res.status(500).json({ message: "Error al obtener tus productos" });
  }
};
