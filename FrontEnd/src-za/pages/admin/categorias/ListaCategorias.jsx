// src/pages/admin/categorias/ListaCategorias.jsx
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
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

export default function ListaCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [mostrarInactivas, setMostrarInactivas] = useState(false);
  const [orden, setOrden] = useState("alfabetico"); // "alfabetico" o "fecha"
  const navigate = useNavigate();

  const cargarCategorias = async () => {
    try {
      const url = mostrarInactivas
        ? "http://localhost:3000/api/v1/categorias?incluirInactivas=true"
        : "http://localhost:3000/api/v1/categorias";

      const res = await axios.get(url);
      let data = res.data.data || [];

      // Ordenar
      data.sort((a, b) => {
        if (orden === "alfabetico") return a.nombre.localeCompare(b.nombre);
        if (orden === "fecha")
          return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
      });

      setCategorias(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, [mostrarInactivas, orden]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres desactivar esta categoría?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/categorias/${id}`);
      cargarCategorias();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
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
                checked={mostrarInactivas}
                onChange={(e) => setMostrarInactivas(e.target.checked)}
              />
            }
            label="Mostrar inactivas"
          />
          <Select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="alfabetico">Orden: Alfabético</MenuItem>
            <MenuItem value="fecha">Orden: Fecha</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/categorias/nuevo")}
          >
            Nueva Categoría
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(categorias) &&
              categorias.map((categoria) => (
                <TableRow
                  key={categoria.id}
                  sx={{ opacity: categoria.activo ? 1 : 0.6 }}
                >
                  <TableCell>{categoria.id}</TableCell>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>
                    {categoria.activo ? "Activa ✅" : "Inactiva ❌"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/admin/categorias/${categoria.id}/editar`)
                      }
                    >
                      <Edit />
                    </IconButton>
                    {/* Solo mostrar Delete si está activo */}
                    {categoria.activo && (
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(categoria.id)}
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
    </Box>
  );
}
