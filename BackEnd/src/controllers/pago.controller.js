import Pago from "../models/Pago.js";

// Obtener todos los pagos (opcional paginación y filtro por estado)
export const getPagos = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { activo: true };
    if (estado) whereClause.estado = estado;

    const { count, rows } = await Pago.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["fecha", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Pagos obtenidos correctamente",
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pagos",
      error: error.message,
    });
  }
};

// Obtener pago por ID
export const getPagoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ success: false, message: "ID inválido" });

    const pago = await Pago.findOne({ where: { id, activo: true } });
    if (!pago)
      return res.status(404).json({ success: false, message: "Pago no encontrado" });

    res.status(200).json({
      success: true,
      message: "Pago encontrado",
      data: pago,
    });
  } catch (error) {
    console.error("Error al obtener pago:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pago",
      error: error.message,
    });
  }
};

// Crear nuevo pago
export const createPago = async (req, res) => {
  try {
    const { montoTotal, metodo, estado } = req.body;
    if (!montoTotal || montoTotal <= 0)
      return res.status(400).json({ success: false, message: "Monto total inválido" });
    if (!metodo || metodo.trim() === "")
      return res.status(400).json({ success: false, message: "Método de pago obligatorio" });

    const nuevoPago = await Pago.create({ montoTotal, metodo, estado, activo: true });

    res.status(201).json({
      success: true,
      message: "Pago creado correctamente",
      data: nuevoPago,
    });
  } catch (error) {
    console.error("Error al crear pago:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear pago",
      error: error.message,
    });
  }
};

// Actualizar pago (solo campos permitidos)
export const updatePago = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ success: false, message: "ID inválido" });

    const pago = await Pago.findOne({ where: { id, activo: true } });
    if (!pago)
      return res.status(404).json({ success: false, message: "Pago no encontrado" });

    // Solo permitimos actualizar 'estado' y 'metodo'
    const { estado, metodo } = req.body;

    // Validaciones de negocio
    const estadosValidos = ["pendiente", "completado", "fallido"];
    if (estado) {
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ success: false, message: "Estado inválido" });
      }
      // Solo se puede actualizar estado si el pago aún está pendiente
      if (pago.estado !== "pendiente") {
        return res.status(400).json({ 
          success: false, 
          message: "Solo se puede actualizar el estado de pagos pendientes" 
        });
      }
    }

    // Actualizamos únicamente los campos permitidos
    await pago.update({ 
      ...(estado && { estado }), 
      ...(metodo && pago.estado === "pendiente" && { metodo }) 
    });

    res.status(200).json({
      success: true,
      message: "Pago actualizado correctamente",
      data: pago,
    });
  } catch (error) {
    console.error("Error al actualizar pago:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar pago",
      error: error.message,
    });
  }
};


// Soft delete de pago
export const deletePago = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ success: false, message: "ID inválido" });

    const pago = await Pago.findOne({ where: { id, activo: true } });
    if (!pago)
      return res.status(404).json({ success: false, message: "Pago no encontrado" });

    await pago.update({ activo: false });

    res.status(200).json({
      success: true,
      message: "Pago eliminado (soft delete)",
    });
  } catch (error) {
    console.error("Error al eliminar pago:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar pago",
      error: error.message,
    });
  }
};
