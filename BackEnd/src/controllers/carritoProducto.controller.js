// src/controllers/carritoProducto.controller.js
import CarritoProducto from "../models/CarritoProducto.js";
import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

// Obtener todos los productos en carritos (solo activos)
export const getCarritoProductos = async (req, res) => {
  try {
    const items = await CarritoProducto.findAll({
      where: { activo: true }
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener productos en carritos",
      error: error.message,
    });
  }
};

// Obtener un item por ID
export const getCarritoProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const item = await CarritoProducto.findOne({ where: { id, activo: true } });
    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener item", error: error.message });
  }
};

// Agregar producto al carrito
export const createCarritoProducto = async (req, res) => {
  try {
    const { idCarrito, idProducto, cantidad, subtotal } = req.body;

    // Validaciones básicas
    if (!idCarrito || !idProducto)
      return res.status(400).json({ message: "idCarrito e idProducto son obligatorios" });

    if (cantidad <= 0)
      return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });

    // Verificar que exista el carrito y esté activo
    const carrito = await Carrito.findByPk(idCarrito);
    if (!carrito || !carrito.activo)
      return res.status(404).json({ message: "Carrito no encontrado o inactivo" });

    // Verificar que exista el producto
    const producto = await Producto.findByPk(idProducto);
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    // Crear el registro
    const nuevo = await CarritoProducto.create({
      idCarrito,
      idProducto,
      cantidad,
      subtotal,
      activo: true
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar producto al carrito",
      error: error.message,
    });
  }
};

// Actualizar cantidad de un producto en el carrito
export const updateCarritoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, subtotal } = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const item = await CarritoProducto.findOne({ where: { id, activo: true } });
    if (!item) return res.status(404).json({ message: "Item no encontrado para actualizar" });

    if (cantidad && cantidad <= 0)
      return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });

    await item.update({ cantidad, subtotal });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar item",
      error: error.message,
    });
  }
};

// Soft delete de producto en carrito
export const deleteCarritoProducto = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "ID inválido" });

    const item = await CarritoProducto.findOne({ where: { id, activo: true } });
    if (!item) return res.status(404).json({ message: "Item no encontrado para eliminar" });

    await item.update({ activo: false });

    res.status(200).json({ message: "Item eliminado (soft delete)" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar item",
      error: error.message,
    });
  }
};
