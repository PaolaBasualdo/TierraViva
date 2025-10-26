import { createContext, useContext, useState, useEffect } from "react";
import API from "../api";
import { useAuth } from "./AuthContext"; // para saber si el usuario está logueado

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  // Carga inicial
  useEffect(() => {
    if (isAuthenticated) {
      cargarCarrito();
    } else {
      setCarrito([]);
      setTotal(0);
    }
  }, [isAuthenticated]);

  // Calcular total
  const calcularTotal = (items) => {
    const suma = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    setTotal(suma);
  };

  //  Mapeo de productos del backend
  const mapProductosFromBackend = (productos) =>
    productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      cantidad: p.CarritoProducto?.cantidad || 0,
      subtotal: p.CarritoProducto?.subtotal || 0,
    }));

  //  Cargar carrito activo
  const cargarCarrito = async () => {
    try {
      const res = await API.get("/carritos/activo");
      const productos = res.data.data?.productos || [];
      const productosMapeados = mapProductosFromBackend(productos);
      setCarrito(productosMapeados);
      calcularTotal(productosMapeados);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  };

  //  Agregar producto
  const agregarProducto = async (idProducto, cantidad = 1) => {
    if (!idProducto) return console.error("ID de producto inválido.");
    try {
      const res = await API.post("/carritos/agregar", { idProducto, cantidad });
      const productos = res.data.data?.productos || [];
      const productosMapeados = mapProductosFromBackend(productos);
      setCarrito(productosMapeados);
      calcularTotal(productosMapeados);
    } catch (err) {
      console.error("Error al agregar producto:", err);
    }
  };

  // Aumentar cantidad (suma 1 al producto existente)
  const aumentarCantidad = async (idProducto) => {
    try {
      const res = await API.post("/carritos/agregar", {
        idProducto,
        cantidad: 1,
      });
      const productosMapeados = mapProductosFromBackend(
        res.data.data?.productos || []
      );
      setCarrito(productosMapeados);
      calcularTotal(productosMapeados);
    } catch (err) {
      console.error("Error al aumentar cantidad:", err);
    }
  };

  // Disminuir cantidad
  const disminuirCantidad = async (idProducto) => {
    try {
      const res = await API.put(`/carritos/disminuir/${idProducto}`);
      const productosMapeados = mapProductosFromBackend(
        res.data.data?.productos || []
      );
      setCarrito(productosMapeados);
      calcularTotal(productosMapeados);
    } catch (err) {
      console.error("Error al disminuir cantidad:", err);
    }
  };

  // Eliminar producto
  const eliminarProducto = async (idProducto) => {
    try {
      const res = await API.delete(`/carritos/producto/${idProducto}`);
      const productosMapeados = mapProductosFromBackend(
        res.data.data?.productos || []
      );
      setCarrito(productosMapeados);
      calcularTotal(productosMapeados);
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  // Vaciar carrito
  const vaciarCarrito = async () => {
    try {
      await API.post("/carritos/vaciar");
      setCarrito([]);
      setTotal(0);
    } catch (err) {
      console.error("Error al vaciar carrito:", err);
    }
  };

  const crearPedido = async (metodo = "transferencia") => {
    try {
      const res = await API.post("/pedidos/desde-carrito", { metodo });
      if (res.data.success) {
        setCarrito([]);
        setTotal(0);
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Error al crear el pedido");
      }
    } catch (error) {
      console.error("Error al crear pedido:", error);
      throw error;
    }
  };

  // Exportar el contexto
  return (
    <CarritoContext.Provider
      value={{
        carrito,
        total,
        cargarCarrito,
        agregarProducto,
        aumentarCantidad,
        disminuirCantidad,
        eliminarProducto,
        vaciarCarrito,
        crearPedido,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

//  Hook personalizado
export const useCarrito = () => useContext(CarritoContext);

{
  /*// src/context/CarritoContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import API from "../api"; // Asume que es tu instancia configurada de Axios
import { useAuth } from "./AuthContext"; // Para saber si el usuario está logueado

// 1. Creación del Contexto
const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);

  // === Lógica de Carga Inicial ===
  // Carga el carrito del usuario logueado o lo vacía si no hay sesión.
  useEffect(() => {
    if (isAuthenticated) {
      cargarCarrito();
    } else {
      // Limpia el estado local si el usuario hace logout
      setCarrito([]);
      setTotal(0);
    }
  }, [isAuthenticated]);

  // Función interna para calcular el total.
  const calcularTotal = (items) => {
    // Usa el 'subtotal' que debe venir calculado desde el backend para mayor precisión.
    const suma = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    setTotal(suma);
  };
  
  // Función para estandarizar el mapeo de productos del backend
  const mapProductosFromBackend = (productos) => {
    return productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen, 
      // Accede a los datos de la tabla intermedia CarritoProducto
      cantidad: p.CarritoProducto.cantidad,
      subtotal: p.CarritoProducto.subtotal,
    }));
  };

  // Función para cargar el carrito activo del usuario
  const cargarCarrito = async () => {
    try {
      const res = await API.get("/carritos/activo");
      const productos = res.data.data?.productos || [];
      
      const productosMapeados = mapProductosFromBackend(productos);
      setCarrito(productosMapeados);
      calcularTotal(productosMapeados);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  };

  // === Funciones CRUD del Carrito ===

  // Función para agregar producto (si existe, el backend aumenta cantidad)
  const agregarProducto = async (idProducto, cantidad = 1) => {
    if (!idProducto) return console.error("ID de producto inválido.");
    if (!cantidad || cantidad < 1) cantidad = 1;

    try {
      // POST al backend para agregar/aumentar
      const res = await API.post("/carritos/agregar", { idProducto, cantidad });

      let productos = res.data.data.productos || [];
      const productosMapeados = mapProductosFromBackend(productos);
      
      setCarrito(productosMapeados);
      calcularTotal(productosMapeados);
    } catch (err) {
      console.error("Error al agregar producto:", err);
    }
  };

  // Función central para cambiar la cantidad (PUT al backend)
  const actualizarCantidad = async (idProducto, nuevaCantidad) => {
    // Si la cantidad es 0 o menos, llama a eliminar
    if (nuevaCantidad < 1) return eliminarProducto(idProducto);

    try {
      // PUT: Actualiza la cantidad de un producto existente en el carrito
      const res = await API.put("/carritos/actualizar", { 
        idProducto, 
        cantidad: nuevaCantidad 
      });

      let productos = res.data.data.productos || [];
      const productosMapeados = mapProductosFromBackend(productos);

      setCarrito(productosMapeados);
      calcularTotal(productosMapeados);

    } catch (err) {
      console.error("Error al actualizar la cantidad:", err);
    }
  };

  // Función para aumentar la cantidad
  const aumentarCantidad = (idProducto) => {
    const item = carrito.find(p => p.id === idProducto);
    if (item) {
      actualizarCantidad(idProducto, item.cantidad + 1);
    }
  };

  // Función para disminuir la cantidad
  const disminuirCantidad = (idProducto) => {
    const item = carrito.find(p => p.id === idProducto);
    // Solo disminuye si la cantidad es mayor a 1
    if (item && item.cantidad > 1) {
      actualizarCantidad(idProducto, item.cantidad - 1);
    } else if (item && item.cantidad === 1) {
      // Si llega a 1 y se intenta disminuir, se elimina
      eliminarProducto(idProducto);
    }
  };

  // Función para eliminar producto completamente (DELETE al backend)
  const eliminarProducto = async (idProducto) => {
    try {
      // DELETE: Elimina el ítem del carrito
      const res = await API.delete(`/carritos/eliminar/${idProducto}`);
      
      let productos = res.data.data.productos || [];
      const productosMapeados = mapProductosFromBackend(productos);

      setCarrito(productosMapeados);
      calcularTotal(productosMapeados);

    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  // Función para vaciar carrito (POST al backend)
  const vaciarCarrito = async () => {
    try {
      await API.post("/carritos/vaciar");
      setCarrito([]);
      setTotal(0);
    } catch (err) {
      console.error("Error al vaciar carrito:", err);
    }
  };

  // 2. Provisión del Contexto (EXPORTACIÓN)
  return (
    <CarritoContext.Provider 
      value={{ 
        carrito, 
        total, 
        agregarProducto, 
        vaciarCarrito, 
        aumentarCantidad, // Nueva función
        disminuirCantidad, // Nueva función
        eliminarProducto // Nueva función
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

// 3. Hook para usar el contexto
export const useCarrito = () => useContext(CarritoContext);*/
}
