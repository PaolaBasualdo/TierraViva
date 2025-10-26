import { useState } from "react"; 
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useSnackbar } from "notistack";

import API from "../api";

export default function FormularioContacto() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones simples
    if (!form.nombre || !form.email || !form.mensaje) {
      enqueueSnackbar("Por favor completá todos los campos.", {
        variant: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/contacto", form); //  POST al backend

      if (response.data.success) {
        enqueueSnackbar("Mensaje enviado correctamente.", {
          variant: "success",
        });
        enqueueSnackbar("Notificación enviada al administrador.", {
          variant: "info",
        });
        setForm({ nombre: "", email: "", mensaje: "" });
      } else {
        enqueueSnackbar(response.data.message || "Error al enviar mensaje.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error al enviar contacto:", error);
      enqueueSnackbar("No se pudo enviar el mensaje. Intentalo más tarde.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, color: "text.primary", fontWeight: "bold" }}>
          Contactanos
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Mensaje"
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{
                px: 4,
                "&:hover": {
                  bgcolor: "#7CA82B", // hover más claro del verde oliva
                },
              }}
            >
              {loading ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
