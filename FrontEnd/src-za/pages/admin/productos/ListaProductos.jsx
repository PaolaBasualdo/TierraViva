import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, Typography, Box, Switch, FormControlLabel
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Cantidad por página
  const navigate = useNavigate();

  const cargarProductos = async () => {
    try {
      const url = mostrarInactivos
        ? `http://localhost:3000/api/v1/productos?incluirInactivos=true&page=${page}&limit=${limit}`
        : `http://localhost:3000/api/v1/productos?page=${page}&limit=${limit}`;

      const res = await axios.get(url);
      let data = res.data.data || [];
      setTotalPages(res.data.pagination?.totalPages || 1);

      // Orden alfabético por nombre
      data.sort((a, b) => a.nombre.localeCompare(b.nombre));

      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [mostrarInactivos, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/productos/${id}`);
      setProductos(productos.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 2 }}>
        

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
              <TableCell>ID</TableCell>
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
              <TableRow key={producto.id} sx={{ opacity: producto.activo ? 1 : 0.5 }}>
                <TableCell>{producto.id}</TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>${producto.precio}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.idCategoria}</TableCell>
                <TableCell>{producto.activo ? producto.estado : "Inactivo"}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/admin/productos/${producto.id}/editar`)}
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

      {/* Paginación */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Anterior
        </Button>
        <Typography sx={{ alignSelf: "center" }}>Página {page} de {totalPages}</Typography>
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
