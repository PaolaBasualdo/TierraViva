import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Chip,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";
import { useSnackbar } from "notistack";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";

export default function ProductCard({
  id,
  nombre,
  precio,
  imagen,
  etiqueta,
  oferta,
  descuento,
}) {
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();

  const finalImageUrl = getImageUrl(imagen);
  const precioConDescuento = oferta
    ? precio - (precio * descuento) / 100
    : precio;

  // Lógica del botón "Comprar"
  const handleComprar = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Debes iniciar sesión o registrarte para comprar productos.", {
        variant: "warning",
      });
      navigate("/login");
      return;
    }

    agregarProducto(id, 1);
    enqueueSnackbar(`${nombre} agregado al carrito 🛒`, {
      variant: "success",
    });
  };

  return (
    <Card
      sx={{
        width: 250,
        height: 370,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box position="relative">
        {etiqueta && (
          <Chip
            label={etiqueta}
            color="secondary"
            sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}
          />
        )}
        {oferta && (
          <Chip
            label={`${descuento}% off`}
            color="warning"
            sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
          />
        )}

        <Link to={`/productos/${id}`} style={{ textDecoration: "none" }}>
          <CardMedia
            component="img"
            image={finalImageUrl}
            alt={nombre}
            sx={{ height: 160, objectFit: "cover" }}
          />
        </Link>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            color="text.primary"
            sx={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "80%",
            }}
            title={nombre}
          >
            {nombre}
          </Typography>
          <IconButton size="small">
            <FavoriteBorderIcon color="secondary" />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: "center", mb: 2 }}>
          {oferta ? (
            <>
              <Typography
                variant="body2"
                color="text.disabled"
                sx={{ textDecoration: "line-through" }}
              >
                ${precio}
              </Typography>
              <Typography
                variant="h5"
                color="error"
                fontWeight="bold"
                sx={{ fontSize: "1.8rem" }}
              >
                ${precioConDescuento}
              </Typography>
            </>
          ) : (
            <Typography
              variant="h5"
              color="primary"
              fontWeight={600}
              sx={{ fontSize: "1.8rem" }}
            >
              ${precio}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <Button
            variant="contained"
            size="medium"
            onClick={handleComprar}
            sx={{
              fontSize: "1rem",
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Comprar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

