// src/components/CategoriaDetalleCompo.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { Box, Typography, Divider, Paper } from "@mui/material";
import { getImageUrl } from "../utils/imageUtils";
import ProductosxCategoria from "./ProductosxCategoria";

function CategoriaDetalleCompo() {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await API.get(`/categorias/${id}`);
        const rawCategoria = res.data.data || res.data;

        const finalImageUrl = getImageUrl(rawCategoria.imagenUrl || rawCategoria.imagen);

        setCategoria({
          ...rawCategoria,
          imageUrl: finalImageUrl
        });
      } catch (error) {
        console.error("Error al obtener la categoría:", error);
      }
    };

    fetchCategoria();
  }, [id]);

  if (!categoria) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5} mb={8} gap={3}>
      {/* Nombre de la categoría */}
      <Typography variant="h4" color="text.primary" fontWeight="bold">
        {categoria.nombre}
      </Typography>

      {/* Imagen de la categoría */}
      {categoria.imageUrl && (
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            width: "500px",
            maxWidth: "90%",
          }}
        >
          <img
            src={categoria.imageUrl}
            alt={categoria.nombre}
            style={{ width: "100%", display: "block" }}
          />
        </Paper>
      )}

      {/* Divisor visual */}
      <Divider sx={{ width: "80%", my: 4, borderColor: "#6B8E23" }} />

      {/* Sección de productos con fondo suave */}
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          px: { xs: 2, sm: 4 },
          py: 4,
          bgcolor: "#F5F5DC",
          borderRadius: 3,
        }}
      >
        <ProductosxCategoria categoriaId={id} />
      </Paper>
    </Box>
  );
}

export default CategoriaDetalleCompo;



{/*import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from "../../../api";
import { Box, Typography } from '@mui/material';

function CategoriaDetalleCompo() {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/categorias/${id}`)
      .then(res => setCategoria(res.data));
  }, [id]);

  if (!categoria) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={5}
      mb={8} // ✅ margen inferior para que no quede pegado al footer
      gap={3}
    >
      <Typography
        variant="h4"
        sx={{ color: '#5D4037', fontWeight: 'bold' }} // ✅ color de paleta
      >
        {categoria.nombre}
      </Typography>
      <img
        src={categoria.imagenUrl}
        alt={categoria.nombre}
        style={{
          width: '500px', // ✅ más grande
          maxWidth: '90%',
          borderRadius: '12px',
          marginBottom: '20px',
        }}
      />
    </Box>
  );
}

export default CategoriaDetalleCompo;*/}
