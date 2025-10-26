import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, Typography, Box,
  Switch, FormControlLabel
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const cargarUsuarios = async () => {
    try {
      const url = mostrarInactivos
        ? `http://localhost:3000/api/v1/usuarios?incluirInactivos=true&page=${page}&limit=${limit}`
        : `http://localhost:3000/api/v1/usuarios?page=${page}&limit=${limit}`;

      const res = await axios.get(url);
      let data = res.data.data || [];
      data.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setUsuarios(data);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [mostrarInactivos, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/usuarios/${id}`);
      setUsuarios(usuarios.filter(u => u.id !== id));
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
            onClick={() => navigate("/admin/usuarios/nuevo")}
          >
            Nuevo Usuario
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id} sx={{ opacity: usuario.activo ? 1 : 0.5 }}>
                <TableCell>{usuario.id}</TableCell>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  {usuario.roles.map(r => r.nombre).join(", ")}
                </TableCell>
                <TableCell>{usuario.activo ? "Sí" : "No"}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/admin/usuarios/${usuario.id}/editar`)}
                  >
                    <Edit />
                  </IconButton>
                  {usuario.activo && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(usuario.id)}
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
