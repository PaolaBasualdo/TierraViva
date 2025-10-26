import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Typography } from "@mui/material";
import CarritoResumen from "../components/CarritoResumen";

function Carrito() {
  return (
    <>
 

      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          backgroundColor: "#F5F5DC",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#5D4037",
            textAlign: "center",
            mb: 3,
            fontWeight: "bold",
          }}
        >
          Tu carrito
        </Typography>

        <CarritoResumen />
      </Box>

      
    </>
  );
}

export default Carrito;
