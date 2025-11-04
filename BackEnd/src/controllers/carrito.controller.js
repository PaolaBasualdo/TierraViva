import Carrito from "../models/Carrito.js";
import CarritoProducto from "../models/CarritoProducto.js";
import Producto from "../models/Producto.js";

/** 🔹 Obtener todos los carritos (solo admin o debug) */
export const getCarritos = async (req, res) => {
  try {
    const carritos = await Carrito.findAll();
    res.status(200).json({
      success: true,
      message: "Carritos obtenidos correctamente",
      data: carritos,
    });
  } catch (error) {
    console.error("Error al obtener carritos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener carritos",
      error: error.message,
    });
  }
};

/** Obtener carrito por ID */
export const getCarritoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id))
      return res.status(400).json({ success: false, message: "ID inválido" });

    const carrito = await Carrito.findByPk(id, {
      include: [
        {
          association: "productos",
          attributes: ["id", "nombre", "precio", "imagen"],
          through: { attributes: ["cantidad", "subtotal"] },
        },
      ],
    });

    if (!carrito)
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });

    res.status(200).json({ success: true, data: carrito });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ success: false, message: "Error al obtener carrito", error: error.message });
  }
};

/**  Crear carrito (solo si no hay uno activo) */
export const createCarrito = async (req, res) => {
  try {
    const { idUsuario } = req.body;
    if (!idUsuario || isNaN(idUsuario)) {
      return res.status(400).json({ success: false, message: "Se requiere un idUsuario válido" });
    }

    // Si ya tiene uno activo, devolverlo
    const carritoExistente = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (carritoExistente) {
      return res.status(200).json({ success: true, data: carritoExistente });
    }

    const nuevoCarrito = await Carrito.create({ idUsuario, activo: true });
    res.status(201).json({ success: true, message: "Carrito creado exitosamente", data: nuevoCarrito });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ success: false, message: "Error al crear carrito", error: error.message });
  }
};

/**  Obtener o crear el carrito activo del usuario */
export const getCarritoActivo = async (req, res) => {
  try {
    const idUsuario = req.user.id;

    const carrito = await Carrito.findOne({
      where: { idUsuario, activo: true },
      include: [
        {
          model: Producto,
          as: "productos",
          through: { attributes: ["cantidad", "subtotal"] },
        },
      ],
    });

    //  Si no hay carrito, solo devolver vacío, NO crear uno nuevo
    if (!carrito) {
      return res.status(200).json({
        success: true,
        data: { productos: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: carrito,
    });
  } catch (error) {
    console.error("Error al obtener carrito activo:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

/** Agregar producto al carrito */
export const agregarProducto = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { idProducto, cantidad = 1 } = req.body;

    let carrito = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (!carrito) carrito = await Carrito.create({ idUsuario, activo: true });

    let item = await CarritoProducto.findOne({ where: { idCarrito: carrito.id, idProducto } });
    const producto = await Producto.findByPk(idProducto);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

    if (item) {
      item.cantidad += cantidad;
      item.subtotal = item.cantidad * producto.precio;
      await item.save();
    } else {
      await CarritoProducto.create({
        idCarrito: carrito.id,
        idProducto,
        cantidad,
        subtotal: cantidad * producto.precio,
      });
    }

    const carritoActualizado = await Carrito.findByPk(carrito.id, {
      include: [
        {
          association: "productos",
          attributes: ["id", "nombre", "precio", "imagen"],
          through: { attributes: ["cantidad", "subtotal"] },
        },
      ],
    });

    res.status(200).json({ success: true, data: carritoActualizado });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ success: false, message: "Error al agregar producto" });
  }
};

/** 🔹 Vaciar carrito sin eliminarlo (para permitir checkout cancelado) */
export const vaciarCarrito = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const carrito = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (!carrito) return res.status(404).json({ message: "Carrito no encontrado" });

    await CarritoProducto.destroy({ where: { idCarrito: carrito.id } });

    res.status(200).json({ success: true, message: "Carrito vaciado correctamente" });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ success: false, message: "Error al vaciar carrito" });
  }
};

/** 🔹 Disminuir cantidad o eliminar producto */
export const disminuirCantidad = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { idProducto } = req.params;

    const carrito = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (!carrito) return res.status(404).json({ message: "Carrito no encontrado" });

    const item = await CarritoProducto.findOne({ where: { idCarrito: carrito.id, idProducto } });
    if (!item) return res.status(404).json({ message: "Producto no encontrado en el carrito" });

    const producto = await Producto.findByPk(idProducto);
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      item.subtotal = item.cantidad * producto.precio;
      await item.save();
    } else {
      await item.destroy();
    }

    const carritoActualizado = await Carrito.findByPk(carrito.id, {
      include: [
        {
          association: "productos",
          attributes: ["id", "nombre", "precio", "imagen"],
          through: { attributes: ["cantidad", "subtotal"] },
        },
      ],
    });

    res.status(200).json({ success: true, data: carritoActualizado });
  } catch (error) {
    console.error("Error al disminuir cantidad:", error);
    res.status(500).json({ success: false, message: "Error al disminuir cantidad" });
  }
};

/** 🔹 Eliminar producto del carrito */
export const eliminarProducto = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { idProducto } = req.params;

    const carrito = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (!carrito) return res.status(404).json({ message: "Carrito no encontrado" });

    const item = await CarritoProducto.findOne({ where: { idCarrito: carrito.id, idProducto } });
    if (!item) return res.status(404).json({ message: "Producto no encontrado en el carrito" });

    await item.destroy();

    const carritoActualizado = await Carrito.findByPk(carrito.id, {
      include: [
        {
          association: "productos",
          attributes: ["id", "nombre", "precio", "imagen"],
          through: { attributes: ["cantidad", "subtotal"] },
        },
      ],
    });

    res.status(200).json({ success: true, data: carritoActualizado });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ success: false, message: "Error al eliminar producto del carrito" });
  }
};

/** 🔹 Marcar carrito como inactivo cuando se confirma el pago */
export const cerrarCarrito = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    const carrito = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (!carrito) return res.status(404).json({ message: "Carrito no encontrado" });

    await carrito.update({ activo: false });

    res.status(200).json({ success: true, message: "Carrito cerrado al confirmar el pago" });
  } catch (error) {
    console.error("Error al cerrar carrito:", error);
    res.status(500).json({ success: false, message: "Error al cerrar carrito" });
  }
};
