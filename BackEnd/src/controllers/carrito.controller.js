// src/controllers/carrito.controller.js
import Carrito from "../models/Carrito.js";
import CarritoProducto from "../models/CarritoProducto.js";
import Producto from "../models/Producto.js";


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


export const getCarritoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const carrito = await Carrito.findByPk(id);
    if (!carrito) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    }

    res.status(200).json({ success: true, data: carrito });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ success: false, message: "Error al obtener carrito", error: error.message });
  }
};


export const createCarrito = async (req, res) => {
  try {
    const { idUsuario } = req.body;
    if (!idUsuario || isNaN(idUsuario)) {
      return res.status(400).json({ success: false, message: "Se requiere un idUsuario válido" });
    }

    const carritoExistente = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (carritoExistente) {
      return res.status(400).json({ success: false, message: "El usuario ya tiene un carrito activo" });
    }

    const nuevoCarrito = await Carrito.create({ idUsuario, activo: true });

    res.status(201).json({ success: true, message: "Carrito creado exitosamente", data: nuevoCarrito });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ success: false, message: "Error al crear carrito", error: error.message });
  }
};


export const getCarritoActivo = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

    let carrito = await Carrito.findOne({
      where: { idUsuario, activo: true },
      include: [
        {
          association: "productos",
          attributes: ["id", "nombre", "precio", "imagen"],
          through: { attributes: ["cantidad", "subtotal"] },
        },
      ],
    });

    if (!carrito) {
      carrito = await Carrito.create({ idUsuario, activo: true });
      return res.status(201).json({ success: true, data: carrito });
    }

    res.status(200).json({ success: true, data: carrito });
  } catch (error) {
    console.error("Error al obtener carrito activo:", error);
    res.status(500).json({ success: false, message: "Error al obtener carrito activo" });
  }
};


export const agregarProducto = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { idProducto, cantidad = 1 } = req.body;

    const carrito = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (!carrito) return res.status(404).json({ message: "Carrito no encontrado" });

    let item = await CarritoProducto.findOne({ where: { idCarrito: carrito.id, idProducto } });

    if (item) {
      // Incrementar cantidad y actualizar subtotal
      item.cantidad += cantidad;
      const producto = await Producto.findByPk(idProducto);
      item.subtotal = item.cantidad * producto.precio;
      await item.save();
    } else {
      const producto = await Producto.findByPk(idProducto);
      if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

      item = await CarritoProducto.create({
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


export const updateCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

    const carrito = await Carrito.findByPk(id);
    if (!carrito) return res.status(404).json({ success: false, message: "Carrito no encontrado" });

    await carrito.update(req.body);
    res.status(200).json({ success: true, message: "Carrito actualizado correctamente", data: carrito });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ success: false, message: "Error al actualizar carrito", error: error.message });
  }
};


export const deleteCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return res.status(400).json({ success: false, message: "ID inválido" });

    const carrito = await Carrito.findByPk(id);
    if (!carrito) return res.status(404).json({ success: false, message: "Carrito no encontrado" });

    await carrito.destroy();
    res.status(200).json({ success: true, message: "Carrito eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar carrito:", error);
    res.status(500).json({ success: false, message: "Error al eliminar carrito", error: error.message });
  }
};
export const disminuirCantidad = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { idProducto } = req.params;

    const carrito = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (!carrito) return res.status(404).json({ message: "Carrito no encontrado" });

    const item = await CarritoProducto.findOne({
      where: { idCarrito: carrito.id, idProducto },
    });

    if (!item) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito" });
    }

    if (item.cantidad > 1) {
      const producto = await Producto.findByPk(idProducto);
      item.cantidad -= 1;
      item.subtotal = item.cantidad * producto.precio;
      await item.save();
    } else {
      await item.destroy(); // Si la cantidad llega a 0, lo eliminamos del carrito
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
export const eliminarProducto = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { idProducto } = req.params;

    const carrito = await Carrito.findOne({ where: { idUsuario, activo: true } });
    if (!carrito) return res.status(404).json({ message: "Carrito no encontrado" });

    const item = await CarritoProducto.findOne({
      where: { idCarrito: carrito.id, idProducto },
    });

    if (!item) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito" });
    }

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
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ success: false, message: "Error al eliminar producto del carrito" });
  }
};
