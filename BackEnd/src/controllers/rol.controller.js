import Rol from "../models/Rol.js";

// Obtener todos los roles activos
export const getRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll({ where: { activo: true } });
    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener roles",
      error: error.message,
    });
  }
};

// Obtener rol por ID (solo activos)
export const getRolById = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.findOne({ where: { id, activo: true } });

    if (!rol) {
      return res.status(404).json({
        success: false,
        message: "Rol no encontrado o inactivo",
      });
    }

    res.status(200).json({
      success: true,
      data: rol,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener rol",
      error: error.message,
    });
  }
};

// Crear nuevo rol
export const createRol = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: "El nombre del rol es obligatorio",
      });
    }

    // Verificar si ya existe (activo o inactivo)
    const existe = await Rol.findOne({ where: { nombre } });
    if (existe) {
      return res.status(400).json({
        success: false,
        message: "El rol ya existe",
      });
    }

    const nuevoRol = await Rol.create({ nombre, activo: true });

    res.status(201).json({
      success: true,
      message: "Rol creado correctamente",
      data: nuevoRol,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear rol",
      error: error.message,
    });
  }
};

// Actualizar rol (solo si está activo)
export const updateRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const rol = await Rol.findOne({ where: { id, activo: true } });
    if (!rol) {
      return res.status(404).json({
        success: false,
        message: "Rol no encontrado o inactivo",
      });
    }

    // Evitar duplicados
    if (nombre) {
      const existe = await Rol.findOne({ where: { nombre, activo: true } });
      if (existe && existe.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un rol con ese nombre",
        });
      }
    }

    await rol.update({ nombre });

    res.status(200).json({
      success: true,
      message: "Rol actualizado correctamente",
      data: rol,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar rol",
      error: error.message,
    });
  }
};

// Soft delete de rol
export const deleteRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.findOne({ where: { id, activo: true } });

    if (!rol) {
      return res.status(404).json({
        success: false,
        message: "Rol no encontrado o ya inactivo",
      });
    }

    await rol.update({ activo: false });

    res.status(200).json({
      success: true,
      message: "Rol desactivado correctamente (soft delete)",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al desactivar rol",
      error: error.message,
    });
  }
};
