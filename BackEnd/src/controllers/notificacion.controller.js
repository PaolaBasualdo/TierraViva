// src/controllers/notificacion.controller.js
import { Notificacion, Usuario } from "../models/index.js";
import { validationResult } from "express-validator";

// Crear una notificación
export const crearNotificacion = async (req, res) => {
  try {
    const { usuarioId, titulo, mensaje, tipo } = req.body;

    // Validación simple
    if (!usuarioId || !titulo || !mensaje) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan datos obligatorios: usuarioId, titulo, mensaje" 
      });
    }

    const notificacion = await Notificacion.create({
      usuarioId,
      titulo,
      mensaje,
      tipo,
      leido: false
    });

    res.status(201).json({
      success: true,
      data: notificacion,
      message: "Notificación creada correctamente"
    });

  } catch (error) {
    console.error("Error en crearNotificacion:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// Listar notificaciones de un usuario
export const listarNotificaciones = async (req, res) => {
  try {
    const usuarioId = req.usuario.id; // asumimos que viene del middleware de autenticación

    const notificaciones = await Notificacion.findAll({
      where: { usuarioId },
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      data: notificaciones
    });

  } catch (error) {
    console.error("Error en listarNotificaciones:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// Marcar una notificación como leída
export const marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) {
      return res.status(404).json({ success: false, message: "Notificación no encontrada" });
    }

    notificacion.leido = true;
    await notificacion.save();

    res.json({
      success: true,
      data: notificacion,
      message: "Notificación marcada como leída"
    });

  } catch (error) {
    console.error("Error en marcarLeida:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
