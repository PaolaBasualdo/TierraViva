// src/pages/Login.jsx
import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link as MuiLink,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import API from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth(); // contexto
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- Login local ---
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await API.post("/auth/login", form);
    if (res.data.success) {
      const { usuario, accessToken, refreshToken } = res.data.data;
      login(usuario, { accessToken, refreshToken });

      // 👇 redirigir según rol
      if (usuario.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } else {
      setError(res.data.message || "Credenciales incorrectas ❌");
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Error en el login ❌");
  } finally {
    setLoading(false);
  }
};

// --- Login con Google ---
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/google", {
        access_token: tokenResponse.access_token,
      });
      const { usuario, accessToken, refreshToken } = res.data.data;
      login(usuario, { accessToken, refreshToken });

      // 👇 redirigir según rol
      if (usuario.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesión con Google ❌");
    } finally {
      setLoading(false);
    }
  },
  onError: () => setError("Error en login con Google ❌"),
});

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography
          variant="h5"
          mb={2}
          color="text.primary"
          fontWeight="bold"
          align="center"
        >
          Iniciar sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
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
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Entrar"}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>O</Divider>

        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => googleLogin()}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#6B8E23" }} /> : "Iniciar sesión con Google"}
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 3, color: "text.secondary" }}
        >
          ¿No tenés cuenta?{" "}
          <MuiLink component={Link} to="/register" underline="hover">
            Registrate
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}
