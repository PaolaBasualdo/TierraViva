import PedidoProducto from "../models/PedidoProducto.js";
import Producto from "../models/Producto.js";

export const getPedidoProductos = async (req, res) => {
  try {
    const items = await PedidoProducto.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos de pedidos", error: error.message });
  }
};

export const getPedidoProductoById = async (req, res) => {
  try {
    const item = await PedidoProducto.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item no encontrado" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener item", error: error.message });
  }
};

export const createPedidoProducto = async (req, res) => {
  try {
    const { cantidad, idProducto } = req.body;

    // 1. Verificar que el producto exista
    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // 2. Tomar el precio actual
    const precio_unitario = producto.precio;

    // 3. Calcular subtotal
    const subtotal = cantidad * precio_unitario;

    // 4. Crear el registro
    const nuevo = await PedidoProducto.create({
      cantidad,
      precio_unitario,
      subtotal,
      idProducto,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar producto al pedido",
      error: error.message,
    });
  }
};

export const updatePedidoProducto = async (req, res) => {
  try {
    const item = await PedidoProducto.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item no encontrado para actualizar" });

    const actualizado = await item.update(req.body);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar item", error: error.message });
  }
};

export const deletePedidoProducto = async (req, res) => {
  try {
    const eliminado = await PedidoProducto.destroy({ where: { id: req.params.id } });
    if (!eliminado) return res.status(404).json({ message: "Item no encontrado para eliminar" });

    res.status(200).json({ message: "Item eliminado del pedido" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar item", error: error.message });
  }
};
