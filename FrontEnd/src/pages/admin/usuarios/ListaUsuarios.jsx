import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, Typography, Box,
  Switch, FormControlLabel, Alert
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import API from "../../../api";
import { useSocket } from "../../../contexts/SocketContext"; // <-- importamos socket

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [solicitudes, setSolicitudes] = useState([]); // <-- para solicitudes en tiempo real
  const navigate = useNavigate();
  const socket = useSocket(); // <-- usamos socket

  const cargarUsuarios = async () => {
    try {
      const url = mostrarInactivos
        ? `/usuarios?incluirInactivos=true&page=${page}&limit=10`
        : `/usuarios?page=${page}&limit=10`;

      const res = await API.get(url);
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

  // --- 🔹 Socket: recibir solicitudes de ser vendedor ---
  useEffect(() => {
    if (!socket) return;

    const handleNuevaSolicitud = (data) => {
      console.log("Nueva solicitud de vendedor recibida:", data);
      setSolicitudes(prev => [...prev, data]);
    };

    socket.on("nuevaSolicitudVendedor", handleNuevaSolicitud);

    return () => {
      socket.off("nuevaSolicitudVendedor", handleNuevaSolicitud);
    };
  }, [socket]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    try {
      await API.delete(`/usuarios/${id}`);
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#6B8E23" }}>
        Usuarios
      </Typography>

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

      {/* Mostrar alert de nuevas solicitudes */}
      {solicitudes.map((s, index) => (
        <Alert
          key={index}
          severity="info"
          sx={{ mb: 1 }}
          onClose={() => setSolicitudes(prev => prev.filter((_, i) => i !== index))}
        >
          Nueva solicitud de vendedor de <strong>{s.nombre}</strong>
        </Alert>
      ))}

      <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        
        <TableCell>Nombre</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Roles</TableCell>
        <TableCell>Estado</TableCell> {/* 🔹 NUEVA COLUMNA */}
        <TableCell>Activo</TableCell>
        <TableCell>Acciones</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {usuarios.map((usuario) => (
        <TableRow key={usuario.id} sx={{ opacity: usuario.activo ? 1 : 0.5 }}>
          
          <TableCell>{usuario.nombre}</TableCell>
          <TableCell>{usuario.email}</TableCell>
          <TableCell>{usuario.roles.map((r) => r.nombre).join(", ")}</TableCell>

          {/* 🔹 NUEVA CELDA: mostrar estado con color */}
          <TableCell>
            <Box
              component="span"
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: "bold",
                color: "#fff",
                bgcolor:
                  usuario.estado === "activo"
                    ? "success.main"
                    : usuario.estado === "suspendido"
                    ? "error.main"
                    : "warning.main", // pendiente
              }}
            >
              {usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1)}
            </Box>
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
              <IconButton color="error" onClick={() => handleDelete(usuario.id)}>
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
