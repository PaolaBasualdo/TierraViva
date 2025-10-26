import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  MenuItem
} from "@mui/material";
import axios from "axios";

export default function FormularioUsuario() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    estado: "pendiente",
    activo: true,
    roles: [1], // por defecto comprador (id 1)
    esVendedor: false // solo para manejar el switch
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar usuario en modo edición
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/api/v1/usuarios/${id}`)
        .then((res) => {
          const usuario = res.data.data;
          setForm({
            nombre: usuario.nombre,
            email: usuario.email,
            password: "",
            estado: usuario.estado,
            activo: usuario.activo,
            roles: usuario.roles.map((r) => r.id),
            esVendedor: usuario.roles.some((r) => r.nombre === "vendedor")
          });
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  // Actualizar valores
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Switch activo
  const handleActivoChange = (e) => {
    setForm({ ...form, activo: e.target.checked });
  };

  // Switch rol vendedor
  const handleVendedorChange = (e) => {
    const esVendedor = e.target.checked;
    let roles = [...form.roles];

    if (esVendedor) {
      if (!roles.includes(2)) roles.push(2); // id 2 = vendedor
    } else {
      roles = roles.filter((r) => r !== 2);
    }

    setForm({ ...form, esVendedor, roles });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre,
        email: form.email,
        password: form.password || undefined,
        estado: form.estado,
        activo: form.activo,
        roles: form.roles
      };

      if (id) {
        await axios.put(
          `http://localhost:3000/api/v1/usuarios/${id}`,
          payload
        );
      } else {
        await axios.post("http://localhost:3000/api/v1/usuarios", payload);
      }
      navigate("/admin/usuarios");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        {id ? "Editar Usuario" : "Nuevo Usuario"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {!id && (
          <TextField
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}

        <TextField
          select
          label="Estado"
          name="estado"
          value={form.estado}
          onChange={handleChange}
          required
        >
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="activo">Activo</MenuItem>
          <MenuItem value="suspendido">Suspendido</MenuItem>
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={form.activo}
              onChange={handleActivoChange}
              name="activo"
            />
          }
          label="Usuario activo"
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.esVendedor}
              onChange={handleVendedorChange}
              name="esVendedor"
            />
          }
          label="Rol adicional: Vendedor"
        />

        <Button type="submit" variant="contained">
          Guardar
        </Button>
        <Button variant="outlined" onClick={() => navigate("/admin/usuarios")}>
          Cancelar
        </Button>
      </Box>
    </Paper>
  );
}
