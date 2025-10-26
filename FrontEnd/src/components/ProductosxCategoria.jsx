// src/components/ProductosxCategoria.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import API from "../api";
import ProductCard from "./ProductCard";

function ProductosxCategoria({ categoriaId }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await API.get("/productos", {
          params: {
            categoria: categoriaId, // enviamos el id de la categoría
            limit: 100, // por ejemplo, todos
          },
        });

        setProductos(res.data.data || []);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoriaId) fetchProductos();
  }, [categoriaId]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "40vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography>Cargando productos...</Typography>
      </Box>
    );
  }

  if (productos.length === 0) {
    return (
      <Box sx={{ minHeight: "40vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No hay productos por el momento.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, mt: 4 }}>
      <Grid container spacing={2} justifyContent="center">
        {productos.map((prod) => (
          <Grid item key={prod.id}>
            <ProductCard {...prod} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductosxCategoria;
