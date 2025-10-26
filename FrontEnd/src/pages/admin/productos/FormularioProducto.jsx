import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Avatar,
  Input,
} from "@mui/material";
import { AddAPhoto, Delete } from "@mui/icons-material";
import API from "../../../api";

export default function FormularioProducto() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    idCategoria: "",
    estado: "pendiente",
    etiqueta: "",
  });

  // 1. Estado para la imagen actual (solo para edición)
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  // 2. Estado para el archivo NUEVO seleccionado por el usuario
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activo, setActivo] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar categorías
    API.get("/categorias")
      .then((res) => setCategorias(res.data.data || res.data))
      .catch((err) => console.error(err));

    if (id) {
      // Cargar producto a editar
      API.get(`/productos/${id}`)
        .then((res) => {
          const p = res.data.data || res.data;
          setForm({
            nombre: p.nombre || "",
            descripcion: p.descripcion || "",
            precio: p.precio != null ? p.precio : 0,
            stock: p.stock != null ? p.stock : 0,
            idCategoria: p.idCategoria != null ? p.idCategoria : "",
            estado: p.estado || "pendiente",
            etiqueta: p.etiqueta || "",
          });
          setActivo(p.activo ?? true);

          // 3. Obtener la URL de la imagen actual (si existe)
          setCurrentImageUrl(
            p.imageUrl || p.imagenUrl
              ? `/images/${p.imageUrl || p.imagenUrl}`
              : p.imagen
              ? `/images/${p.imagen}`
              : ""
          );
        })
        .catch((err) => console.error(err));
    } else {
      // Limpiar al cambiar a modo creación
      setCurrentImageUrl("");
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 4. Manejador para el campo de tipo 'file'
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  // 5. Manejador para eliminar la previsualización de la imagen
  const handleRemoveImage = () => {
    setImageFile(null); // Borra el archivo seleccionado
    setCurrentImageUrl(""); // Borra la imagen actual para que la DB sepa que debe quedar NULL
    // Nota: El backend debe estar preparado para recibir una imagen nula o un flag para eliminarla
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 6. 🚨 Crear FormData
    const dataToSend = new FormData();

    // 7. Adjuntar la imagen si hay una nueva seleccionada
    if (imageFile) {
      // CRUCIAL: 'image' debe coincidir con el campo Multer del backend
      dataToSend.append("image", imageFile);
    }

    // 8. Adjuntar todos los datos de texto del formulario
    Object.keys(form).forEach((key) => {
      const value =
        form[key] === null || form[key] === undefined ? "" : form[key];
      dataToSend.append(key, value);
    });

    // 9. Añadir el estado 'activo' (que está separado del 'form')
    dataToSend.append("activo", activo);

    // 10. Si es una edición y el usuario eliminó la imagen existente, enviamos un flag
    // Esto asume que tu backend sabe interpretar un valor vacío o un flag para poner 'imagenUrl' en NULL.
    if (id && currentImageUrl === "" && !imageFile) {
      dataToSend.append("removeImage", true); // Envía un flag para que el controlador ponga la imagenUrl en NULL
    }

    try {
      if (id) {
        // PUT para edición
        await API.put(`/productos/${id}`, dataToSend);
      } else {
        // POST para creación
        await API.post("/productos", dataToSend);
      }
      navigate("/admin/productos");
    } catch (error) {
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // 11. Determinar la URL de la imagen a mostrar
  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : currentImageUrl || "";

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        {id ? "Editar Producto" : "Nuevo Producto"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* 🚨 Zona de Subida de Imagen */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 2,
            p: 1,
            border: "1px solid #ccc",
            borderRadius: 1,
          }}
        >
          <Avatar
            src={previewUrl}
            sx={{ width: 80, height: 80, bgcolor: "grey.300" }}
            variant="rounded"
          >
            {!previewUrl && <AddAPhoto />}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Imagen Principal
            </Typography>

            <Input
              type="file"
              id="producto-image"
              name="image"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              sx={{ display: "none" }}
            />

            <label htmlFor="producto-image">
              <Button
                variant="outlined"
                component="span"
                size="small"
                disabled={loading}
              >
                {previewUrl ? "Cambiar Imagen" : "Seleccionar Imagen"}
              </Button>
            </label>

            {(previewUrl || imageFile) && (
              <Button
                variant="text"
                color="error"
                startIcon={<Delete />}
                onClick={handleRemoveImage}
                sx={{ ml: 1 }}
                disabled={loading}
              >
                Quitar
              </Button>
            )}

            {imageFile && (
              <Typography
                variant="caption"
                display="block"
                color="textSecondary"
                sx={{ mt: 0.5 }}
              >
                **Archivo listo:** {imageFile.name}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Campos de Texto */}
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          label="Precio"
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          required
          inputProps={{ step: "0.01" }}
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          required
          inputProps={{ min: "0" }}
        />

        {/* Selects */}
        <TextField
          select
          label="Categoría"
          name="idCategoria"
          value={form.idCategoria}
          onChange={handleChange}
          required
        >
          {categorias.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.nombre}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Estado"
          name="estado"
          value={form.estado}
          onChange={handleChange}
          required
        >
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="aprobado">Aprobado</MenuItem>
          <MenuItem value="rechazado">Rechazado</MenuItem>
        </TextField>
        <TextField
          select
          label="Etiqueta"
          name="etiqueta"
          value={form.etiqueta}
          onChange={handleChange}
        >
          <MenuItem value="">Ninguna</MenuItem>
          <MenuItem value="producto de estacion">Producto de estación</MenuItem>
          <MenuItem value="stock limitado">Stock limitado</MenuItem>
          <MenuItem value="edicion unica">Edición única</MenuItem>
        </TextField>

        {/* Checkbox Activo (Solo en Edición) */}
        {id && (
          <FormControlLabel
            control={
              <Checkbox
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
            }
            label="Activo"
          />
        )}

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/admin/productos")}
            disabled={loading}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

{
  /*import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField, Button, Box, Typography, Paper, MenuItem, FormControlLabel, Checkbox
} from "@mui/material";
import API from "../../../api";

export default function FormularioProducto() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    idCategoria: "",
    estado: "pendiente",
    etiqueta: "",
  });
  const [activo, setActivo] = useState(true); // separado
  const [categorias, setCategorias] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar categorías
    API.get("/categorias")
      .then(res => setCategorias(res.data.data || res.data))
      .catch(err => console.error(err));

    if (id) {
      // Cargar producto a editar
      API.get(`/productos/${id}`)
        .then(res => {
          const p = res.data.data || res.data;
          setForm({
            nombre: p.nombre || "",
            descripcion: p.descripcion || "",
            precio: p.precio != null ? p.precio : 0,
            stock: p.stock != null ? p.stock : 0,
            idCategoria: p.idCategoria != null ? p.idCategoria : "",
            estado: p.estado || "pendiente",
            etiqueta: p.etiqueta || "",
          });
          setActivo(p.activo ?? true); // cargamos activo
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, activo }; // incluimos activo
      if (id) {
        await API.put(`/productos/${id}`, payload);
      } else {
        await API.post("/productos", payload);
      }
      navigate("/admin/productos");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        {id ? "Editar Producto" : "Nuevo Producto"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <TextField
          label="Descripción"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          label="Precio"
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          required
        />
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <TextField
          select
          label="Categoría"
          name="idCategoria"
          value={form.idCategoria}
          onChange={handleChange}
          required
        >
          {categorias.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Estado"
          name="estado"
          value={form.estado}
          onChange={handleChange}
          required
        >
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="aprobado">Aprobado</MenuItem>
          <MenuItem value="rechazado">Rechazado</MenuItem>
        </TextField>
        <TextField
          select
          label="Etiqueta"
          name="etiqueta"
          value={form.etiqueta}
          onChange={handleChange}
        >
          <MenuItem value="">Ninguna</MenuItem>
          <MenuItem value="producto de estacion">Producto de estación</MenuItem>
          <MenuItem value="stock limitado">Stock limitado</MenuItem>
          <MenuItem value="edicion unica">Edición única</MenuItem>
        </TextField>

        {id && (
          <FormControlLabel
            control={
              <Checkbox
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
            }
            label="Activo"
          />
        )}

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained">Guardar</Button>
          <Button variant="outlined" onClick={() => navigate("/admin/productos")}>Cancelar</Button>
        </Box>
      </Box>
    </Paper>
  );
}
*/
}
