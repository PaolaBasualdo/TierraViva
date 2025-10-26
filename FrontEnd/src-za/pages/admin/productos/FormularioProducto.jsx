import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField, Button, Box, Typography, Paper, MenuItem, FormControlLabel, Checkbox
} from "@mui/material";
import axios from "axios";

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
    axios.get("http://localhost:3000/api/v1/categorias")
      .then(res => setCategorias(res.data.data || res.data))
      .catch(err => console.error(err));

    if (id) {
      // Cargar producto a editar
      axios.get(`http://localhost:3000/api/v1/productos/${id}`)
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
        await axios.put(`http://localhost:3000/api/v1/productos/${id}`, payload);
      } else {
        await axios.post("http://localhost:3000/api/v1/productos", payload);
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
