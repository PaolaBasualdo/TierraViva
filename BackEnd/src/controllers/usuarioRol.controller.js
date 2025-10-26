// src/controllers/usuarioRol.controller.js
import UsuarioRol from "../models/UsuarioRol.js";

export const getUsuarioRoles = async (req, res) => {
  try {
    const relaciones = await UsuarioRol.findAll({ where: { activo: true } });
    res.status(200).json({
      success: true,
      data: relaciones,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener relaciones usuario-rol",
      error: error.message,
    });
  }
};

export const getUsuarioRolById = async (req, res) => {
  try {
    const relacion = await UsuarioRol.findOne({ where: { id: req.params.id, activo: true } });
    if (!relacion) {
      return res.status(404).json({
        success: false,
        message: "Relación no encontrada",
      });
    }
    res.status(200).json({
      success: true,
      data: relacion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener relación",
      error: error.message,
    });
  }
};

export const createUsuarioRol = async (req, res) => {
  try {
    const { idUsuario, idRol } = req.body;

    if (!idUsuario || !idRol) {
      return res.status(400).json({
        success: false,
        message: "idUsuario e idRol son obligatorios",
      });
    }

    // Evitar duplicados activos
    const existe = await UsuarioRol.findOne({ where: { idUsuario, idRol, activo: true } });
    if (existe) {
      return res.status(400).json({
        success: false,
        message: "La relación usuario-rol ya existe",
      });
    }

    const nuevaRelacion = await UsuarioRol.create({ idUsuario, idRol });

    res.status(201).json({
      success: true,
      message: "Relación usuario-rol creada correctamente",
      data: nuevaRelacion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear relación usuario-rol",
      error: error.message,
    });
  }
};

export const updateUsuarioRol = async (req, res) => {
  try {
    const relacion = await UsuarioRol.findOne({ where: { id: req.params.id, activo: true } });

    if (!relacion) {
      return res.status(404).json({
        success: false,
        message: "Relación no encontrada para actualizar",
      });
    }

    await relacion.update(req.body);

    res.status(200).json({
      success: true,
      message: "Relación actualizada correctamente",
      data: relacion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar relación",
      error: error.message,
    });
  }
};

export const deleteUsuarioRol = async (req, res) => {
  try {
    const relacion = await UsuarioRol.findOne({ where: { id: req.params.id, activo: true } });

    if (!relacion) {
      return res.status(404).json({
        success: false,
        message: "Relación no encontrada para eliminar",
      });
    }

    await relacion.update({ activo: false });

    res.status(200).json({
      success: true,
      message: "Relación eliminada (soft delete)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar relación",
      error: error.message,
    });
  }
};
