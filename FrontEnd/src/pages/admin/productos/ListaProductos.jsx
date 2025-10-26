import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import API from "../../../api";
import { useSocket } from "../../../contexts/SocketContext"; // 👈 importamos el hook del socket

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();
  const socket = useSocket(); // 👈 traemos la instancia del socket

  const cargarProductos = async () => {
    try {
      const url = mostrarInactivos
        ? `/productos?admin=true&incluirInactivos=true&page=${page}&limit=${limit}`
        : `/productos?admin=true&page=${page}&limit=${limit}`;

      const res = await API.get(url);
      let data = res.data.data || [];
      setTotalPages(res.data.pagination?.totalPages || 1);

      // Orden alfabético
      data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [mostrarInactivos, page]);

  // 🔹 Socket.IO: escuchar nuevos productos
  useEffect(() => {
    if (!socket) return;

    socket.on("nuevoNotificacion", (data) => {
      alert(
        `Nueva Notificación: ${
          data.message || "Hay un producto pendiente de revisión"
        }`
      );
      // Opcional: recargar la lista automáticamente
      cargarProductos();
    });

    return () => {
      socket.off("nuevaNotificacion");
    };
  }, [socket]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await API.delete(`/productos/${id}`);
      setProductos(productos.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", color: "#6B8E23" }}
      >
        Productos
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={mostrarInactivos}
                onChange={(e) => setMostrarInactivos(e.target.checked)}
              />
            }
            label="Mostrar inactivos"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/productos/nuevo")}
          >
            Nuevo Producto
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow
                key={producto.id}
                sx={{ opacity: producto.activo ? 1 : 0.5 }}
              >
                
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>${producto.precio}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.categoria?.nombre || "Sin categoría"}</TableCell>
                <TableCell>
                  {producto.activo ? producto.estado : "Inactivo"}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      navigate(`/admin/productos/${producto.id}/editar`)
                    }
                  >
                    <Edit />
                  </IconButton>
                  {producto.activo && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(producto.id)}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </Button>
        <Typography sx={{ alignSelf: "center" }}>
          Página {page} de {totalPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
}
