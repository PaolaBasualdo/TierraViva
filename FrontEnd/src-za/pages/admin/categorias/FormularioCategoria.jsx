// src/pages/admin/categorias/FormularioCategoria.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField, Button, Box, Typography, Paper, FormControlLabel, Checkbox
} from "@mui/material";
import axios from "axios";

export default function FormularioCategoria() {
  const [nombre, setNombre] = useState("");
  const [activo, setActivo] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/v1/categorias/${id}`)
        .then(res => {
          setNombre(res.data.nombre || "");
          setActivo(res.data.activo ?? true);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:3000/api/v1/categorias/${id}`, { nombre, activo });
      } else {
        await axios.post("http://localhost:3000/api/v1/categorias", { nombre, activo });
      }
      navigate("/admin/categorias");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        {id ? "Editar Categoría" : "Nueva Categoría"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
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
        <Button type="submit" variant="contained">
          Guardar
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/categorias")}
        >
          Cancelar
        </Button>
      </Box>
    </Paper>
  );
}
