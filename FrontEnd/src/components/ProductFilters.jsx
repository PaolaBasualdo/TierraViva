// src/components/ProductFilters.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Slider,
  Paper,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ProductFilters = ({ onFilterChange }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState([0, 10000]); // rango base
  const [maxPrecio, setMaxPrecio] = useState(10000);

  useEffect(() => {
    // En un caso real, podrías obtener el precio máximo del backend
    setMaxPrecio(10000);
  }, []);

  const handleChange = () => {
    onFilterChange({ nombre, precio });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        bgcolor: "background.paper",
        p: 3,
        mb: 2,
        borderRadius: 2,
        border: "1px solid rgba(107, 142, 35, 0.3)",
      }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        gap={3}
      >
        {/* Búsqueda por nombre */}
        <Box display="flex" alignItems="center" gap={1} flex={1}>
          <SearchIcon sx={{ color: "primary.main" }} />
          <TextField
            fullWidth
            label="Buscar producto"
            variant="outlined"
            size="small"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Filtro por precio */}
        <Box flex={1}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Rango de precio:
          </Typography>
          
  <Slider
    value={precio}
    onChange={(e, newValue) => setPrecio(newValue)}
    min={0}
    max={maxPrecio}
    valueLabelDisplay="auto"
  />
  <Box display="flex" justifyContent="space-between" mt={1}>
    <TextField
      type="number"
      size="small"
      value={precio[0]}
      onChange={(e) => setPrecio([+e.target.value || 0, precio[1]])}
      sx={{ width: 100 }}
    />
    <TextField
      type="number"
      size="small"
      value={precio[1]}
      onChange={(e) => setPrecio([precio[0], +e.target.value || maxPrecio])}
      sx={{ width: 100 }}
    />
  </Box>

        </Box>

        {/* Botón de aplicar */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleChange}
          sx={{ px: 3, borderRadius: 2 }}
        >
         Buscar
        </Button>
        <Button
  variant="outlined"
  color="secondary"
  onClick={() => {
    setNombre("");
    setPrecio([0, maxPrecio]);
    onFilterChange({ nombre: "", precio: [0, maxPrecio] });
  }}
  sx={{ px: 3, borderRadius: 2 }}
>
  Limpiar
</Button>

      </Box>
    </Paper>
  );
};

export default ProductFilters;
