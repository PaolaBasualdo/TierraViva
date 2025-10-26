import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";  // ✅ Importante
import API from "../api";

export default function NuevoProducto() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    idCategoria: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // ✅ para usar el sistema global

  useEffect(() => {
    API.get("/categorias")
      .then((res) => setCategorias(res.data.data || res.data))
      .catch((err) => console.error("Error cargando categorías", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!imageFile) {
        setError("Debe seleccionar una imagen para el producto.");
        setLoading(false);
        return;
      }

      const dataToSend = new FormData();
      dataToSend.append("image", imageFile);

      Object.entries(form).forEach(([key, value]) =>
        dataToSend.append(key, value ?? "")
      );

      dataToSend.append("estado", "pendiente");

      const response = await API.post("/productos", dataToSend);
      console.log("Producto creado:", response.data.data);

      // Mostrar dos notificaciones por separado
      enqueueSnackbar("Producto creado correctamente.", { variant: "success" });

      setTimeout(() => {
        enqueueSnackbar("Notificación enviada al administrador.", { variant: "info" });
      }, 1000);

      // Redirigir luego de un breve delay
      setTimeout(() => navigate("/mis-productos"), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "No se pudo crear el producto. Verifique los datos y la imagen.";
      setError(msg);
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, position: "relative" }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/Perfil")}
          color="primary"
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            fontWeight: "bold",
          }}
        >
          Volver
        </Button>

        <Typography variant="h5" gutterBottom textAlign="center">
          Nuevo producto
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Precio"
            name="precio"
            type="number"
            value={form.precio}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ step: "0.01" }}
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ min: "0" }}
          />

          {/* Imagen */}
          <Box
            sx={{
              my: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" sx={{ mb: 1 }}>
              Imagen del Producto
            </Typography>

            {imageFile ? (
              <Box sx={{ mb: 2 }}>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Vista previa"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Typography variant="caption" color="textSecondary" display="block">
                  {imageFile.name}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                No hay imagen seleccionada
              </Typography>
            )}

            <Button variant="outlined" component="label">
              {imageFile ? "Cambiar imagen" : "Subir imagen"}
              <input
                hidden
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                required={!imageFile}
              />
            </Button>
          </Box>

          {/* Categoría */}
          <TextField
            select
            label="Categoría"
            name="idCategoria"
            value={form.idCategoria}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {categorias.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nombre}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 3, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Producto"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}


{
  /*import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext"; // 🔹 importar socket

export default function NuevoProducto() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen: "",
    idCategoria: "",
  });
  const [categorias, setCategorias] = useState([]); // categorías desde la BD
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const socket = useSocket(); // 🔹 hook para usar socket

  useEffect(() => {
    API.get("/categorias")
      .then((res) => setCategorias(res.data.data || res.data))
      .catch((err) => console.error("Error cargando categorías", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/productos", {
        ...form,
        estado: "pendiente", // 🚩 queda pendiente hasta aprobación
      });

      

      navigate("/mis-productos"); // redirigir a lista del vendedor
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el producto");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Nuevo producto
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
          />
          <TextField
            label="Precio"
            name="precio"
            type="number"
            value={form.precio}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="URL Imagen"
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            select
            label="Categoría"
            name="idCategoria"
            value={form.idCategoria}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {categorias.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nombre}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}*/
}
