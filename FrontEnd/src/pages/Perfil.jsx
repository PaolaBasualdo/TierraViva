import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Fade,
  CircularProgress,
  Avatar,
  TextField,
  Alert,
} from "@mui/material";
import {
  ExitToApp,
  ArrowBack,
  Edit,
  Save,
  Cancel,
  CloudUpload,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import API from "../api";

export default function Perfil() {
  const { user, logout, updateUserData } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [esVendedor, setEsVendedor] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ direccion: "", telefono: "", nombre: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchProfile = async () => {
    if (!user) {
      logout();
      navigate("/");
      return;
    }

    try {
      const res = await API.get("/usuarios/perfil");
      const apiUser = res.data.data || user;

      const normalizedUser = {
        ...apiUser,
        fotoPerfil: apiUser.fotoPerfil
          ? apiUser.fotoPerfil
          : apiUser.imageUrl
          ? apiUser.imageUrl
          : apiUser.imagen
          ? `/images/${apiUser.imagen}`
          : null,
        roles:
          apiUser.roles?.map((r) => (typeof r === "string" ? r : r.nombre)) ||
          [],
        isAdmin: apiUser.es_admin || false,
      };

      setUserData(normalizedUser);
      updateUserData(normalizedUser);

      const tieneRolVendedor = normalizedUser.roles.includes("vendedor");
      setEsVendedor(tieneRolVendedor);

      setForm({
        nombre: normalizedUser?.nombre || "",
        direccion: normalizedUser?.direccion || "",
        telefono: normalizedUser?.telefono || "",
      });

      setSuccess("");
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, logout, navigate]);

  const handleSolicitarVendedor = async () => {
    try {
      await API.put("/usuarios/rol-vendedor", { esVendedor: true });
      setSolicitudEnviada(true);
      enqueueSnackbar("Solicitud de vendedor enviada al administrador", {
        variant: "success",
        autoHideDuration: 4000,
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("No se pudo enviar la solicitud de vendedor", {
        variant: "error",
        autoHideDuration: 4000,
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
      setSuccess("Nueva imagen seleccionada. Presione Guardar.");
      setError("");
    } else {
      setProfileImage(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const dataToSend = new FormData();

      if (profileImage) {
        dataToSend.append("image", profileImage);
      }

      Object.keys(form).forEach((key) => {
        const value = form[key] ?? "";
        dataToSend.append(key, value);
      });

      const res = await API.put("/usuarios/perfil", dataToSend);

      const updatedUser = res.data.data;
      const avatarUrl =
        updatedUser.imageUrl ||
        (updatedUser.imagen ? `/images/${updatedUser.imagen}` : null);

      setUserData({ ...updatedUser, fotoPerfil: avatarUrl });
      updateUserData({ ...updatedUser });
      setProfileImage(null);
      setEditMode(false);
      enqueueSnackbar("Perfil y/o imagen actualizados correctamente", {
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "No se pudo guardar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({
      nombre: userData?.nombre || "",
      direccion: userData?.direccion || "",
      telefono: userData?.telefono || "",
    });
    setProfileImage(null);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              position: "relative",
              bgcolor: "background.paper",
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              sx={{ position: "absolute", top: 16, left: 16 }}
            >
              Volver
            </Button>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Avatar
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : userData?.fotoPerfil || ""
                }
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "secondary.main",
                  mx: "auto",
                }}
              >
                {!profileImage && !userData?.fotoPerfil
                  ? userData?.nombre?.[0] || "U"
                  : null}
              </Avatar>

              {editMode && (
                <>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-profile-image"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload-profile-image">
                    <Button
                      variant="contained"
                      component="span"
                      size="small"
                      color="primary"
                      startIcon={<CloudUpload />}
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: -10,
                        transform: "translateY(50%)",
                      }}
                    >
                      Cambiar
                    </Button>
                  </label>
                </>
              )}
            </Box>

            {editMode ? (
              <>
                <TextField
                  label="Nombre Completo"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Dirección"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Cancel />}
                    sx={{ ml: 2 }}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  {userData?.nombre || "Usuario"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Email: {userData?.email || "-"}
                </Typography>
                <Typography variant="body1">
                  Dirección: {userData?.direccion || "-"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Teléfono: {userData?.telefono || "-"}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  sx={{ mt: 2 }}
                  onClick={() => setEditMode(true)}
                >
                  Editar perfil
                </Button>
              </>
            )}

            <Box sx={{ mt: 3, borderTop: 1, pt: 3, borderColor: "divider" }}>
              {esVendedor ? (
                <>
                  <Typography
                    variant="subtitle1"
                    color="success.main"
                    sx={{ mb: 1 }}
                  >
                    ¡Eres vendedor activo!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/nuevo-producto")}
                  >
                    Agregar producto
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/mis-productos")}
                  >
                    Ver mis productos
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    if (!solicitudEnviada) handleSolicitarVendedor();
                  }}
                  disabled={solicitudEnviada}
                >
                  {solicitudEnviada
                    ? "Solicitud enviada"
                    : "Quiero ser vendedor"}
                </Button>
              )}

              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 3 }}
                startIcon={<ExitToApp />}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Cerrar sesión
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}

{
  /*import { useEffect, useState } from "react";
// import { useSocket } from "../contexts/SocketContext";  <-- REMOVIDO
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Fade,
  CircularProgress,
  Avatar,
  Checkbox,
  FormControlLabel,
  Alert,
  TextField,
} from "@mui/material";
import {
  ExitToApp,
  ArrowBack,
  Edit,
  Save,
  Cancel,
  CloudUpload,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Perfil() {
  const { user, logout, updateUserData } = useAuth(); // Asume que useAuth tiene una función para actualizar el usuario local
  // const socket = useSocket(); // REMOVIDO
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [esVendedor, setEsVendedor] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Nuevo estado para mensajes de éxito
  const [editMode, setEditMode] = useState(false);

  // 1. Estado para los campos de texto (dirección, teléfono, etc.)
  const [form, setForm] = useState({ direccion: "", telefono: "", nombre: "" });

  // 2. Estado NUEVO para el archivo de imagen
  const [profileImage, setProfileImage] = useState(null);
const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const navigate = useNavigate();

  // Función para recargar los datos del perfil desde la API
  const fetchProfile = async () => {
    if (!user) {
      logout();
      navigate("/");
      return;
    }

    try {
      const res = await API.get("/usuarios/perfil");
const apiUser = res.data.data || user;

const normalizedUser = {
  ...apiUser,
  fotoPerfil: apiUser.fotoPerfil
    ? apiUser.fotoPerfil
    : apiUser.imageUrl
    ? apiUser.imageUrl
    : apiUser.imagen
    ? `/images/${apiUser.imagen}`
    : null,
  roles: apiUser.roles?.map(r => (typeof r === "string" ? r : r.nombre)) || [],
  isAdmin: apiUser.es_admin || false
};

setUserData(normalizedUser);
updateUserData(normalizedUser); // Mantener el contexto actualizado

const tieneRolVendedor = normalizedUser.roles.includes("vendedor");
setEsVendedor(tieneRolVendedor);

setForm({
  nombre: normalizedUser?.nombre || "",
  direccion: normalizedUser?.direccion || "",
  telefono: normalizedUser?.telefono || "",
});
      setSuccess(""); // Limpiar éxito al recargar
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  // Efecto de carga inicial
  useEffect(() => {
    fetchProfile();
  }, [user, logout, navigate]);

  // --- 🔹 REMOVIDA la Lógica de Sockets para recargar el perfil ---

  // Manejador Quiero ser vendedor
  const handleSolicitarVendedor = async () => {
  try {
    await API.put("/usuarios/rol-vendedor", { esVendedor: true });
    setSolicitudEnviada(true); // solo aquí confirmamos que la solicitud se envió
    alert("Solicitud de vendedor enviada al administrador");
  } catch (err) {
    console.error(err);
    setError("No se pudo enviar la solicitud de vendedor.");
  }
};

  // Manejador para campos de texto
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. NUEVO Manejador para el campo de tipo 'file'
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
      setSuccess("Nueva imagen seleccionada. Presione Guardar.");
      setError("");
    } else {
      setProfileImage(null);
    }
  };

  // 4. Lógica de guardado con FormData
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const dataToSend = new FormData();

      if (profileImage) {
        dataToSend.append("image", profileImage);
      }

      Object.keys(form).forEach((key) => {
        const value =
          form[key] === null || form[key] === undefined ? "" : form[key];
        dataToSend.append(key, value);
      });

      const res = await API.put("/usuarios/perfil", dataToSend);

      const updatedUser = res.data.data;
      const avatarUrl =
        updatedUser.imageUrl ||
        (updatedUser.imagen ? `/images/${updatedUser.imagen}` : null);

      setUserData({ ...updatedUser, fotoPerfil: avatarUrl });
      updateUserData({ ...updatedUser }); // Actualiza el Contexto de Autenticación
      setProfileImage(null); // Limpiar el estado del archivo
      setEditMode(false);
      setSuccess("Perfil y/o imagen actualizados correctamente.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "No se pudo guardar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar la edición y restaurar los datos
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      nombre: userData?.nombre || "",
      direccion: userData?.direccion || "",
      telefono: userData?.telefono || "",
    });
    setProfileImage(null);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              position: "relative",
              bgcolor: "background.paper",
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              sx={{ position: "absolute", top: 16, left: 16 }}
            >
              Volver
            </Button>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* AVATAR Y MANEJO DE IMAGEN *
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Avatar
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : userData?.fotoPerfil || ""
                }
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "secondary.main",
                  mx: "auto",
                }}
              >
                {!profileImage && !userData?.fotoPerfil
                  ? userData?.nombre?.[0] || "U"
                  : null}
              </Avatar>

              {editMode && (
                <>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-profile-image"
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload-profile-image">
                    <Button
                      variant="contained"
                      component="span"
                      size="small"
                      color="primary"
                      startIcon={<CloudUpload />}
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: -10,
                        transform: "translateY(50%)",
                      }}
                    >
                      Cambiar
                    </Button>
                  </label>
                </>
              )}
            </Box>

            {/* DATOS DEL USUARIO *
            {editMode ? (
              <>
                <TextField
                  label="Nombre Completo"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Dirección"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Cancel />}
                    sx={{ ml: 2 }}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  {userData?.nombre || "Usuario"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Email: {userData?.email || "-"}
                </Typography>
                <Typography variant="body1">
                  Dirección: {userData?.direccion || "-"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Teléfono: {userData?.telefono || "-"}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  sx={{ mt: 2 }}
                  onClick={() => setEditMode(true)}
                >
                  Editar perfil
                </Button>
              </>
            )}

            {/* SWITCH VENDEDOR Y CERRAR SESIÓN *
            <Box sx={{ mt: 3, borderTop: 1, pt: 3, borderColor: "divider" }}>
              {esVendedor ? (
                <>
                  <Typography
                    variant="subtitle1"
                    color="success.main"
                    sx={{ mb: 1 }}
                  >
                    ¡Eres vendedor activo!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/nuevo-producto")}
                  >
                    Agregar producto
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/mis-productos")}
                  >
                    Ver mis productos
                  </Button>
                </>
              ) : (
                <FormControlLabel
  control={
    <Checkbox
      checked={solicitudEnviada}
      onChange={async (e) => {
        if (!solicitudEnviada) { // evitar volver a enviar si ya se hizo
          try {
            await handleSolicitarVendedor();
          } catch (err) {
            console.error(err);
          }
        }
      }}
    />
  }
  label={solicitudEnviada ? "Solicitud enviada" : "Quiero ser vendedor"}
  sx={{ mt: 2 }}
/>
              )}

              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 3 }}
                startIcon={<ExitToApp />}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Cerrar sesión
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}*/
}

{
  /*import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Fade,
  CircularProgress,
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
  TextField,
} from "@mui/material";
import {
  ExitToApp,
  ArrowBack,
  Edit,
  Save,
  Cancel,
  CloudUpload,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";


export default function Perfil() {
  const { user, logout, updateUserData } = useAuth(); // Asume que useAuth tiene una función para actualizar el usuario local
  const socket = useSocket();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [esVendedor, setEsVendedor] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Nuevo estado para mensajes de éxito
  const [editMode, setEditMode] = useState(false);

  // 1. Estado para los campos de texto (dirección, teléfono, etc.)
  const [form, setForm] = useState({ direccion: "", telefono: "", nombre: "" });

  // 2. Estado NUEVO para el archivo de imagen
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();

  // Función para recargar los datos del perfil desde la API
  const fetchProfile = async () => {
    if (!user) {
      logout();
      navigate("/");
      return;
    }

    try {
      const res = await API.get("/usuarios/perfil");
      const usuario = res.data.data || user;

      // Usamos el campo 'imageUrl' que enviamos desde el backend si existe
      // Si no, usamos 'usuario.imagen' que tiene solo el nombre del archivo
      const avatarUrl =
        usuario.imageUrl ||
        (usuario.imagen ? `/images/${usuario.imagen}` : null);

      setUserData({ ...usuario, fotoPerfil: avatarUrl });

      const tieneRolVendedor = usuario.roles?.includes("vendedor");
      setEsVendedor(tieneRolVendedor);

      setForm({
        nombre: usuario?.nombre || "",
        direccion: usuario?.direccion || "",
        telefono: usuario?.telefono || "",
      });
      setSuccess(""); // Limpiar éxito al recargar
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  // Efecto de carga inicial y recarga si el socket indica un cambio de rol
  useEffect(() => {
    fetchProfile();
  }, [user, logout, navigate]);

  // --- 🔹 Lógica de Sockets para recargar el perfil si el Admin actúa ---
  useEffect(() => {
    if (!socket) return;

    const handleNotificacion = (noti) => {
      alert(`🔔 Notificación: ${noti.mensaje}`);
      if (noti.tipo === "rolVendedor" || noti.tipo === "estadoUsuario") {
        // Recargar la data del perfil para actualizar la interfaz
        fetchProfile();
      }
    };

    socket.on("notificacion", handleNotificacion);

    return () => {
      socket.off("notificacion", handleNotificacion);
    };
  }, [socket]);

  // Manejador del Switch (Quiero ser vendedor)
  const handleSwitchChange = async (event) => {
    // Lógica se mantiene igual...
    const nuevoValor = event.target.checked;
    try {
      await API.put("/usuarios/rol-vendedor", { esVendedor: nuevoValor });
      alert("Solicitud de vendedor enviada al administrador");
    } catch (err) {
      console.error(err);
      setError("No se pudo enviar la solicitud de vendedor.");
    }
  };

  // Manejador para campos de texto
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. NUEVO Manejador para el campo de tipo 'file'
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
      setSuccess("Nueva imagen seleccionada. Presione Guardar.");
      setError("");
    } else {
      setProfileImage(null);
    }
  };

  // 4. Lógica de guardado con FormData
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 🚨 Crear el objeto FormData (necesario para enviar archivos)
      const dataToSend = new FormData();

      // a) Adjuntar la imagen si hay una nueva seleccionada
      if (profileImage) {
        // CRUCIAL: 'image' debe coincidir con el campo Multer del backend
        dataToSend.append("image", profileImage);
      }

      // b) Adjuntar los campos de texto
      // Recorremos el estado 'form' y añadimos cada campo al FormData
      Object.keys(form).forEach((key) => {
        // Aseguramos que los valores nulos o vacíos se envíen
        const value =
          form[key] === null || form[key] === undefined ? "" : form[key];
        dataToSend.append(key, value);
      });

      // 🚨 Nota: La subida de password también debe ir aquí si lo incluyes en el form.

      // c) Enviar la petición PUT (Axios usará multipart/form-data)
      const res = await API.put("/usuarios/perfil", dataToSend);

      // 5. Actualizar la UI
      // Usamos la URL que viene en la respuesta del backend
      const updatedUser = res.data.data;
      const avatarUrl =
        updatedUser.imageUrl ||
        (updatedUser.imagen ? `/images/${updatedUser.imagen}` : null);

      setUserData({ ...updatedUser, fotoPerfil: avatarUrl });
      updateUserData({ ...updatedUser }); // Actualiza el Contexto de Autenticación
      setProfileImage(null); // Limpiar el estado del archivo
      setEditMode(false);
      setSuccess("Perfil y/o imagen actualizados correctamente.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "No se pudo guardar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  // Función para cancelar la edición y restaurar los datos
  const handleCancel = () => {
    setEditMode(false);
    // Restaurar los campos de texto a los valores de userData
    setForm({
      nombre: userData?.nombre || "",
      direccion: userData?.direccion || "",
      telefono: userData?.telefono || "",
    });
    setProfileImage(null); // Limpiar cualquier imagen que se haya seleccionado
    setError("");
    setSuccess("");
  };
  

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              position: "relative",
              bgcolor: "background.paper",
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              sx={{ position: "absolute", top: 16, left: 16 }}
            >
              Volver
            </Button>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {/* AVATAR Y MANEJO DE IMAGEN *
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
              <Avatar
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : userData?.fotoPerfil || ""
                }
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "secondary.main",
                  mx: "auto",
                }}
              >
                {/* Si no hay imagen, mostrar la inicial del nombre o "U" 
                {!profileImage && !userData?.fotoPerfil
                  ? userData?.nombre?.[0] || "U"
                  : null}
              </Avatar>

              {/* Input de archivo solo en modo edición *
              {editMode && (
                <>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-profile-image"
                    type="file"
                    name="image" // Nombre crucial para Multer
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload-profile-image">
                    <Button
                      variant="contained"
                      component="span"
                      size="small"
                      color="primary"
                      startIcon={<CloudUpload />}
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: -10,
                        transform: "translateY(50%)",
                      }}
                    >
                      Cambiar
                    </Button>
                  </label>
                </>
              )}
            </Box>

            {/* DATOS DEL USUARIO *
            {editMode ? (
              <>
                {/* Nombre de usuario (Editable) *
                <TextField
                  label="Nombre Completo"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                {/* Dirección y Teléfono (Editables) *
                <TextField
                  label="Dirección"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                {/* Botones de Guardar/Cancelar *
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Cancel />}
                    sx={{ ml: 2 }}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {/* Vista Normal *
                <Typography variant="h5" gutterBottom>
                  {userData?.nombre || "Usuario"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Email: {userData?.email || "-"}
                </Typography>
                <Typography variant="body1">
                  Dirección: {userData?.direccion || "-"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Teléfono: {userData?.telefono || "-"}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  sx={{ mt: 2 }}
                  onClick={() => setEditMode(true)}
                >
                  Editar perfil
                </Button>
              </>
            )}

            {/* SWITCH VENDEDOR Y CERRAR SESIÓN *
            <Box sx={{ mt: 3, borderTop: 1, pt: 3, borderColor: "divider" }}>
              {esVendedor ? (
                <>
                  <Typography
                    variant="subtitle1"
                    color="success.main"
                    sx={{ mb: 1 }}
                  >
                    ¡Eres vendedor activo!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/nuevo-producto")}
                  >
                    Agregar producto
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/mis-productos")}
                  >
                    Ver mis productos
                  </Button>
                </>
              ) : (
                <FormControlLabel
                  control={
                    <Switch
                      checked={esVendedor}
                      onChange={handleSwitchChange}
                      color="primary"
                    />
                  }
                  label="Quiero ser vendedor (Solicitud)"
                  sx={{ mt: 2 }}
                />
              )}

              <Button
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 3 }}
                startIcon={<ExitToApp />}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Cerrar sesión
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}*/
}

{
  /* 
  import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Fade,
  CircularProgress,
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
  TextField,
} from "@mui/material";
import { ExitToApp, ArrowBack, Edit, Save, Cancel } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Perfil() {
  const { user, logout } = useAuth();
  const socket = useSocket();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [esVendedor, setEsVendedor] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ direccion: "", telefono: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        logout();
        navigate("/");
        return;
      }

      try {
        const res = await API.get("/usuarios/perfil");
        const usuario = res.data.data || user;
        setUserData(usuario);

        const tieneRolVendedor = usuario.roles?.includes("vendedor");
        setEsVendedor(tieneRolVendedor);
        console.log("Usuario desde perfil:", usuario);
        console.log("Roles:", usuario.roles);

        setForm({
          direccion: usuario?.direccion || "",
          telefono: usuario?.telefono || "",
        });
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, logout, navigate]);

  // --- 🔹 Eventos de socket ---
  useEffect(() => {
  if (!socket) return;
  console.log("Socket conectado desde perfil:", socket.id);
   
    /**
     * @param {Object} noti - { mensaje: string, tipo: string, itemId: number }
     * Escucha las notificaciones personales enviadas por el administrador (aprobación de rol, estado de producto, etc.).
     
    const handleNotificacion = (noti) => {
        console.log("🔔 Notificación recibida del Admin:", noti);

        // 1. Mostrar la notificación al usuario (Toast, Alert, etc.)
        // Usamos la función alert temporalmente para una implementación rápida.
        alert(`🔔 Notificación: ${noti.mensaje}`); 

        // 2. Lógica para actualizar el estado del componente si es necesario.
        // Si el admin aprobó o revocó el rol de vendedor, o cambió el estado del usuario,
        // necesitamos recargar los datos del perfil.
        if (noti.tipo === 'rolVendedor' || noti.tipo === 'estadoUsuario') {
            // Recargar la data del perfil para actualizar la interfaz (esVendedor, activo)
            fetchProfile(); // Asume que tienes una función fetchProfile que recarga userData
        }
    }

    socket.on("notificacion", handleNotificacion);
    
    return () => {
        // Importante: Limpiar el listener al desmontar el componente
        socket.off("notificacion", handleNotificacion);
    };
}, [socket]); // El array de dependencia solo necesita el socket

    
    

  const handleSwitchChange = async (event) => {
const nuevoValor = event.target.checked;
 try {
 // 1. Llamar a la API para actualizar el rol/estado en la DB.
      // Esta llamada desencadenará la notificación por socket a los admins
      // desde el Back-end (patchRolVendedor corregido).
await API.put("/usuarios/rol-vendedor", { esVendedor: nuevoValor });
 alert("Solicitud de vendedor enviada al administrador");
      
      // Opcional: Si quieres reflejar el cambio en la UI inmediatamente
      // (asumiendo que es una solicitud y no una aprobación inmediata)
      // setEsVendedor(nuevoValor); // o recargar perfil

 } catch (err) {
console.error(err);
 setError("No se pudo enviar la solicitud de vendedor.");
 } };


  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await API.put("/usuarios/perfil", form);

      setUserData(res.data.data);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el perfil");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "background.default",
      }}
    >
      <Fade in={true} timeout={800}>
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
              position: "relative",
              bgcolor: "background.paper",
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              sx={{ position: "absolute", top: 16, left: 16 }}
            >
              Volver
            </Button>

            {error && <Alert severity="error">{error}</Alert>}

            <Avatar
              src={userData?.fotoPerfil || ""}
              sx={{
                width: 80,
                height: 80,
                bgcolor: "secondary.main",
                mx: "auto",
                mb: 2,
              }}
            >
              {(!userData?.fotoPerfil && userData?.nombre?.[0]) || "U"}
            </Avatar>

            <Typography variant="h5" gutterBottom>
              {userData?.nombre || "Usuario"}
            </Typography>

            <Typography variant="body1" gutterBottom>
              Email: {userData?.email || "-"}
            </Typography>

            {editMode ? (
              <>
                <TextField
                  label="Dirección"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSave}
                  >
                    Guardar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Cancel />}
                    sx={{ ml: 2 }}
                    onClick={() => setEditMode(false)}
                  >
                    Cancelar
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body1">
                  Dirección: {userData?.direccion || "-"}
                </Typography>
                <Typography variant="body1">
                  Teléfono: {userData?.telefono || "-"}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  sx={{ mt: 2 }}
                  onClick={() => setEditMode(true)}
                >
                  Editar perfil
                </Button>
              </>
            )}

            {esVendedor ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/nuevo-producto")}
                >
                  Agregar producto
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/mis-productos")}
                >
                  Ver mis productos
                </Button>
              </>
            ) : (
              <FormControlLabel
                control={
                  <Switch
                    checked={esVendedor}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Quiero ser vendedor"
                sx={{ mt: 2 }}
              />
            )}

            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 3 }}
              startIcon={<ExitToApp />}
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Cerrar sesión
            </Button>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}*/
}
