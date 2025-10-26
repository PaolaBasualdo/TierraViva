// src/controllers/categoria.controller.js
import Categoria from "../models/Categoria.js";

// Obtener todas las categorías (con paginación y solo activas)
export const getCategorias = async (req, res) => {
  try {
    const { page = 1, limit = 10, incluirInactivas = "false" } = req.query;
    const offset = (page - 1) * limit;

    const where = incluirInactivas === "true" ? {} : { activo: true };

    const { count, rows } = await Categoria.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["nombre", "ASC"]],
    });

    res.status(200).json({
      success: true,
      message: "Categorías obtenidas correctamente",
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías",
      error: error.message,
    });
  }
};


// Obtener categoría por ID
export const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const categoria = await Categoria.findByPk(id); // 👈 sin filtro de activo
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Categoría encontrada",
      data: categoria,
    });
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener categoría",
      error: error.message,
    });
  }
};

export const createCategoria = async (req, res) => {
  try {
    // 1. Obtener datos de texto de req.body
    // Nota: 'imagenUrl' ya no se espera aquí, solo el 'nombre'.
    const { nombre } = req.body; 
    
    // 2. Obtener el nombre del archivo subido por Multer
    // Si la subida fue exitosa, la información está en req.file
    const imagenData = req.file; 

    if (!nombre || nombre.trim() === "")
      return res.status(400).json({
        success: false,
        message: "El nombre de la categoría es obligatorio",
      });

    // 3. Verificar duplicado
    const existe = await Categoria.findOne({ where: { nombre } });
    if (existe)
      return res.status(400).json({
        success: false,
        message: "Ya existe una categoría con ese nombre",
      });

    // 4. Determinar el nombre del archivo a guardar
    // Usamos el nombre que Multer le asignó, o null si no se subió imagen (ej: imagen opcional)
    const nombreArchivo = imagenData ? imagenData.filename : null;

    // 5. Crear la Categoría en la Base de Datos
    const nuevaCategoria = await Categoria.create({ 
      nombre, 
      // ⬇️ ¡INTEGRACIÓN DE MULTER! Guardamos el nombre del archivo
      imagenUrl: nombreArchivo, 
      activo: true 
    });

    // 6. Respuesta exitosa
    const categoriaResponse = nuevaCategoria.toJSON();
    // Añadimos la URL accesible para el frontend (si hay imagen)
    if (nombreArchivo) {
        categoriaResponse.imageUrl = `/images/${nombreArchivo}`;
    }

    res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      data: categoriaResponse,
    });
    
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear categoría",
      error: error.message,
    });
  }
};

// Actualizar categoría
export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, activo } = req.body; // ahora activo también

    if (isNaN(id))
      return res.status(400).json({ success: false, message: "ID inválido" });

    const categoria = await Categoria.findByPk(id); // sin filtro de activo
    if (!categoria)
      return res.status(404).json({ success: false, message: "Categoría no encontrada" });

    if (nombre !== undefined && nombre.trim() === "")
      return res.status(400).json({ success: false, message: "El nombre no puede estar vacío" });

    // Verificar duplicado solo si cambia el nombre
    if (nombre && nombre !== categoria.nombre) {
      const existe = await Categoria.findOne({ where: { nombre } });
      if (existe)
        return res.status(400).json({ success: false, message: "Ya existe otra categoría con ese nombre" });
    }

    // Actualiza los campos que vienen
    if (nombre !== undefined) categoria.nombre = nombre;
    if (activo !== undefined) categoria.activo = activo;

    await categoria.save();

    res.status(200).json({
      success: true,
      message: "Categoría actualizada exitosamente",
      data: categoria,
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ success: false, message: "Error al actualizar categoría", error: error.message });
  }
};

// Soft delete de categoría
export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id))
      return res.status(400).json({ success: false, message: "ID inválido" });

    const categoria = await Categoria.findOne({ where: { id, activo: true } });
    if (!categoria)
      return res.status(404).json({ success: false, message: "Categoría no encontrada" });

    await categoria.update({ activo: false });

    res.status(200).json({
      success: true,
      message: "Categoría eliminada (soft delete)",
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar categoría",
      error: error.message,
    });
  }
};