import React from "react";
import { Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // ✅ import
import ProductoDetalleCompo from "../components/ProductoDetalleCompo";

function ProductoDetalle() {
  const navigate = useNavigate(); // ✅ hook para poder usar navigate

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        position: "relative", // ✅ importante para que la flecha se posicione bien
      }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)} // 🔄 mejor: volver a la página anterior
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          backgroundColor: "white",
          borderRadius: 2,
          textTransform: "none",
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
      >
        Volver
      </Button>

      <ProductoDetalleCompo />
    </Box>
  );
}

export default ProductoDetalle;
