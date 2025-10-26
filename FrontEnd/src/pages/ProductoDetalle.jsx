import React from "react";
import { Box } from "@mui/material";
import ProductoDetalleCompo from "../components/ProductoDetalleCompo";

function ProductoDetalle() {
  return (
    <Box
      sx={{
        minHeight: "60vh", // empuja el footer hacia abajo
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2, // padding horizontal opcional
      }}
    >
      <ProductoDetalleCompo />
    </Box>
  );
}

export default ProductoDetalle;
