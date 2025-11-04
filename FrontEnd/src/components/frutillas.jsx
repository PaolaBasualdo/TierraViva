import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  useTheme,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Importá tus imágenes locales
import frutilla1 from "../assets/berry-4272318_1280.jpg";
import frutilla2 from "../assets/strawberry-2459835_1280.jpg";
import frutilla3 from "../assets/strawberry-4667387_1280.jpg";

export default function ProductoDetalleFrutillas() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const imagenes = [frutilla1, frutilla2, frutilla3];

  const siguiente = () => {
    setIndex((prev) => (prev + 1) % imagenes.length);
  };

  const anterior = () => {
    setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <Navbar/>,
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        position: "relative",
      }}
    >
      {/* Botón volver */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
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

      {/* Card del producto */}
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          maxWidth: 900,
          m: "auto",
          mt: theme.spacing(3),
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: theme.shadows[3],
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Contenedor del slider */}
        <Box sx={{ position: "relative", width: { xs: "100%", sm: 350 } }}>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: { xs: 220, sm: "100%" },
              objectFit: "cover",
              transition: "opacity 0.5s ease",
            }}
            image={imagenes[index]}
            alt={`Frutilla ${index + 1}`}
          />

          {/* Botones del slider */}
          <IconButton
            onClick={anterior}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ArrowBack />
          </IconButton>

          <IconButton
            onClick={siguiente}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>

        {/* Contenido del producto */}
        <CardContent sx={{ flex: 1, p: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Frutillas
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            El rojo más tentador. Nuestras frutillas son el placer simple de la
            naturaleza: brillantes, intensamente dulces y con una jugosidad que
            explota en cada mordida. Cultivadas con esmero, tienen ese sabor
            auténtico que evoca el sol y los días felices. Perfectas para
            postres, smoothies o para disfrutar solas. ¡Imposible comer solo
            una!
          </Typography>

          <Typography
            variant="h4"
            color="primary"
            fontWeight={700}
            sx={{ mt: 1, mb: 3 }}
          >
            $6000
          </Typography>

          <Button
            variant="contained"
            sx={{
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Agregar al carrito
          </Button>
        </CardContent>
      </Card>
    </Box>,
    <Footer/>
  );
}
