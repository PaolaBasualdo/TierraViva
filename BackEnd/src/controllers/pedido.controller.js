import {
  Carrito,
  CarritoProducto,
  Producto,
  Pedido,
  PedidoProducto,
} from "../models/index.js";

// Obtener todos los pedidos (con paginación opcional y filtro por estado o usuario)
export const getPedidos = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado, idUsuario } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { activo: true };
    if (estado) whereClause.estado = estado;
    if (idUsuario) whereClause.idUsuario = idUsuario;

    const pedidos = await Pedido.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["fecha", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Pedidos obtenidos correctamente",
      data: pedidos.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(pedidos.count / limit),
        totalItems: pedidos.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pedidos",
      error: error.message,
    });
  }
};

// Obtener un pedido por ID con sus productos


export const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const pedido = await Pedido.findOne({
      where: { id, activo: true },
      include: [
        {
          model: Producto,
          as: "productos",
          through: {
            attributes: ["cantidad"] // trae cantidad desde PedidoProducto
          }
        }
      ]
    });

    if (!pedido) {
      return res
        .status(404)
        .json({ success: false, message: "Pedido no encontrado" });
    }

    res.status(200).json({
      success: true,
      message: "Pedido encontrado",
      data: pedido
    });
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pedido",
      error: error.message
    });
  }
};

// Crear un nuevo pedido
export const createPedido = async (req, res) => {
  try {
    const { idUsuario, metodo } = req.body;

    if (!idUsuario || !metodo) {
      return res.status(400).json({
        success: false,
        message: "Campos requeridos: idUsuario y metodo",
      });
    }

    const nuevoPedido = await Pedido.create({
      idUsuario,
      metodo,
      estado: "pendiente",
      activo: true,
    });

    res.status(201).json({
      success: true,
      message: "Pedido creado correctamente",
      data: nuevoPedido,
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear pedido",
      error: error.message,
    });
  }
};

// Actualizar un pedido (solo estado permitido)
export const updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ success: false, message: "ID inválido" });

    const pedido = await Pedido.findOne({ where: { id, activo: true } });
    if (!pedido)
      return res
        .status(404)
        .json({ success: false, message: "Pedido no encontrado" });

    const { estado } = req.body;

    if (estado) {
      const estadosValidos = [
        "pendiente",
        "pagado",
        "enviado",
        "entregado",
        "cancelado",
      ];
      if (!estadosValidos.includes(estado)) {
        return res
          .status(400)
          .json({ success: false, message: "Estado inválido" });
      }

      // Reglas de transición de estados
      const transiciones = {
        pendiente: ["pagado", "cancelado"],
        pagado: ["enviado"],
        enviado: ["entregado"],
        entregado: [],
        cancelado: [],
      };

      if (!transiciones[pedido.estado].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: `No se puede cambiar el estado de ${pedido.estado} a ${estado}`,
        });
      }
    }

    await pedido.update({ ...(estado && { estado }) });

    res.status(200).json({
      success: true,
      message: "Pedido actualizado correctamente",
      data: pedido,
    });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar pedido",
      error: error.message,
    });
  }
};

// Eliminar un pedido (soft delete)
export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ success: false, message: "ID inválido" });

    const pedido = await Pedido.findOne({ where: { id, activo: true } });
    if (!pedido)
      return res
        .status(404)
        .json({ success: false, message: "Pedido no encontrado" });

    await pedido.update({ activo: false });

    res.status(200).json({
      success: true,
      message: "Pedido eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar pedido",
      error: error.message,
    });
  }
};

export const crearPedidoDesdeCarrito = async (req, res) => {
  const idUsuario = req.usuario.id;
  const { metodo = "transferencia" } = req.body;

  const carrito = await Carrito.findOne({
    where: { idUsuario, activo: true },
    include: [{ association: "productos", through: { attributes: ["cantidad", "subtotal"] } }],
  });

  if (!carrito || carrito.productos.length === 0)
    return res.status(400).json({ success: false, message: "Carrito vacío" });

  const pedido = await Pedido.create({ idUsuario, metodo, estado: "pendiente", activo: true });

  const pedidoProductos = carrito.productos.map((p) => ({
    idPedido: pedido.id,
    idProducto: p.id,
    cantidad: p.CarritoProducto.cantidad,
    precio_unitario: p.precio,
    subtotal: p.CarritoProducto.subtotal,
  }));

  await PedidoProducto.bulkCreate(pedidoProductos);

  const pedidoCompleto = await Pedido.findByPk(pedido.id, {
    include: [{ association: "productos", through: { attributes: ["cantidad", "subtotal"] } }],
  });

  res.status(201).json({ success: true, message: "Pedido creado (pendiente)", data: pedidoCompleto });
};


export const confirmarPedido = async (req, res) => {
  try {
    const { idPedido } = req.params;
    const { direccion, metodo } = req.body;

    const pedido = await Pedido.findByPk(idPedido);
    if (!pedido)
      return res.status(404).json({ success: false, message: "Pedido no encontrado" });

    // Actualizar pedido a confirmado
    await pedido.update({ estado: "confirmado", metodo, direccion });

    // Vaciar y desactivar carrito
    const carrito = await Carrito.findOne({ where: { idUsuario: pedido.idUsuario, activo: true } });
    if (carrito) {
      await CarritoProducto.destroy({ where: { idCarrito: carrito.id } });
      await carrito.update({ activo: false });
    }

    res.status(200).json({ success: true, message: "Pedido confirmado y carrito inactivado" });
  } catch (error) {
    console.error("Error al confirmar pedido:", error);
    res.status(500).json({
      success: false,
      message: "Error al confirmar pedido",
      error: error.message,
    });
  }
};
