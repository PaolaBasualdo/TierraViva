// src/components/FilterBar.jsx
import React, { useState, useEffect } from "react";
import { Box, Chip, Typography, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import API from "../api";

function FilterBar() {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
  const fetchCategorias = async () => {
    try {
      const res = await API.get("/categorias"); // 👈 usa la ruta correcta
      setCategorias(res.data.data || []);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  fetchCategorias();
}, []);

  return (
    <Box sx={{ mt: 1, px: 1 }}>
      <Paper
        elevation={4}
        sx={{
          bgcolor: "#F5F5DC",
          px: 2,
          py: 2,
          borderRadius: 2,
          border: "1px solid rgba(107, 142, 35, 0.3)",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-evenly"
          flexWrap="wrap"
          gap={0.5}
        >
          <Box display="flex" alignItems="center" gap={1} mr={10}>
            <SearchIcon sx={{ color: "#6B8E23", fontSize: "40px" }} />
            <Typography
              variant="body2"
              sx={{ color: "#5D4037", fontWeight: "bold", fontSize: "16px" }}
            >
              CATEGORÍAS:
            </Typography>
          </Box>

          {categorias.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.nombre}
              onClick={() => navigate(`/categoria/${cat.id}`)}
              variant="outlined"
              sx={{
                color: "#6B8E23",
                borderColor: "#6B8E23",
                fontWeight: "500",
                cursor: "pointer",
                fontSize: "14px",
                px: 1,
                py: 1,
                textAlign: "center",
                flex: "1 1 120px",
                maxWidth: "200px",
                "&:hover": {
                  bgcolor: "rgba(107,142,35,0.1)",
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

export default FilterBar;

