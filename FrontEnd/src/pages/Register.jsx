// src/pages/Register.jsx
import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  PersonAdd,
  Email,
  Lock,
  Phone,
  Home as HomeIcon,
} from "@mui/icons-material";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSnackbar } from "notistack"; 

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); //  Inicializamos notificaciones

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);

      if (res.data.success) {
        const { usuario, accessToken, refreshToken } = res.data.data;

        // Guardar en contexto y localStorage
        login(usuario, { accessToken, refreshToken });

        // Mostrar notificación de éxito
        enqueueSnackbar(res.data.message || "¡Registro exitoso!", {
          variant: "success",
        });

        // Redirigir al Home luego de 1.5s
        setTimeout(() => navigate("/"), 1500);
      } else {
        enqueueSnackbar(res.data.message || "Error desconocido", {
          variant: "error",
        });
      }

      // Limpiar formulario
      setForm({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.response?.data?.message || "Error en el registro", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate("/");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F5DC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "#EAD8C0",
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleGoBack}
              sx={{ position: "absolute", top: 16, left: 16 }}
            >
              <ArrowBack sx={{ color: "#5D4037" }} />
            </IconButton>

            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "#6B8E23",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <PersonAdd sx={{ fontSize: 40, color: "#fff" }} />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#5D4037", mb: 2 }}
            >
              Crear Cuenta
            </Typography>

            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 3, color: "#8C6D5A" }}
            >
              Completa tus datos para registrarte en nuestra plataforma
            </Typography>

            <Box component="form" sx={{ mt: 1, width: "100%" }} onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nombre completo"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonAdd sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Correo electrónico"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <VisibilityOff sx={{ color: "#6B8E23" }} />
                        ) : (
                          <Visibility sx={{ color: "#6B8E23" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: "#6B8E23",
                  "&:hover": { backgroundColor: "#5A7A1E" },
                  color: "#fff",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Registrarme"
                )}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderColor: "#6B8E23",
                  color: "#5D4037",
                  "&:hover": { borderColor: "#5A7A1E" },
                }}
                onClick={handleGoBack}
              >
                Volver al Inicio
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}


{/*// src/pages/Register.jsx
import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowBack,
  PersonAdd,
  Email,
  Lock,
  Phone,
  Home as HomeIcon,
} from "@mui/icons-material";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);

      if (res.data.success) {
        const { usuario, accessToken, refreshToken } = res.data.data;

        // Guardar en contexto y localStorage
        login(usuario, { accessToken, refreshToken });

        setSuccess(res.data.message || "¡Registro exitoso!");
         // Guardar mensaje flash para el Home
  localStorage.setItem("flashMessage", res.data.message || "¡Registro exitoso!");


        // Redirigir al Home luego de 1.5s
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(res.data.message || "Error desconocido ❌");
      }

      // Limpiar formulario
      setForm({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        direccion: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error en el registro ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F5DC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              backgroundColor: "#EAD8C0",
              position: "relative",
            }}
          >
            <IconButton
              onClick={handleGoBack}
              sx={{ position: "absolute", top: 16, left: 16 }}
            >
              <ArrowBack sx={{ color: "#5D4037" }} />
            </IconButton>

            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                backgroundColor: "#6B8E23",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <PersonAdd sx={{ fontSize: 40, color: "#fff" }} />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#5D4037", mb: 2 }}
            >
              Crear Cuenta
            </Typography>

            <Typography
              variant="body2"
              align="center"
              sx={{ mb: 3, color: "#8C6D5A" }}
            >
              Completa tus datos para registrarte en nuestra plataforma
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" sx={{ mt: 1, width: "100%" }} onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nombre completo"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonAdd sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Correo electrónico"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <VisibilityOff sx={{ color: "#6B8E23" }} />
                        ) : (
                          <Visibility sx={{ color: "#6B8E23" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Teléfono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon sx={{ color: "#6B8E23" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: "#6B8E23",
                  "&:hover": { backgroundColor: "#5A7A1E" },
                  color: "#fff",
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Registrarme"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderColor: "#6B8E23",
                  color: "#5D4037",
                  "&:hover": { borderColor: "#5A7A1E" },
                }}
                onClick={handleGoBack}
              >
                Volver al Inicio
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}*/}
