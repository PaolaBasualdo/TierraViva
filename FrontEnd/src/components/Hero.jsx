import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack"; //  importar snackbar
import { getImageUrl } from "../utils/imageUtils";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import API from "../api";

export default function Hero() {
  const HERO_IMAGE_FILENAME = "ciruelas-1759705659516.jpg";
  const finalImageUrl = getImageUrl(HERO_IMAGE_FILENAME);

  const { isAuthenticated } = useAuth();
  const { agregarProducto } = useCarrito();
  const { enqueueSnackbar } = useSnackbar(); //  inicializar
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const { data } = await API.get(`/productos/16`); // id real del producto
        if (data.success) setProducto(data.data);
      } catch (error) {
        console.error("Error al cargar producto:", error);
        enqueueSnackbar("Error al cargar el producto destacado.", {
          variant: "error",
          autoHideDuration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [enqueueSnackbar]);

  const handleComprar = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Debes iniciar sesión o registrarte para comprar productos.", {
        variant: "warning",
        autoHideDuration: 4000,
      });
      navigate("/login");
      return;
    }

    if (!producto) {
      enqueueSnackbar("Producto no disponible.", {
        variant: "error",
        autoHideDuration: 4000,
      });
      return;
    }

    agregarProducto(producto.id);
    enqueueSnackbar(`${producto.nombre} agregado al carrito 🛒`, {
      variant: "success",
      autoHideDuration: 4000,
    });
  };

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography>Cargando producto...</Typography>
      </Box>
    );
  }

  if (!producto) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography>Producto no disponible</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "info.main", py: { xs: 4, md: 8 } }}>
      <Container
        sx={{
          border: "2px solid",
          borderColor: "primary.main",
          borderRadius: 2,
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 3, md: 4 },
          }}
        >
          <Box
            component="img"
            src={finalImageUrl}
            alt={producto.nombre}
            sx={{
              width: { xs: "100%", sm: "80%", md: "300px" },
              borderRadius: 2,
              boxShadow: 3,
              objectFit: "cover",
            }}
          />

          <Box
            sx={{
              maxWidth: 500,
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 3 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h4"
              color="text.primary"
              fontWeight="bold"
              gutterBottom
            >
              ¡Llegó la temporada de {producto.nombre}!
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}
            >
              {producto.descripcion || "Descripción no disponible."}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 3, py: 1.2 }}
                onClick={handleComprar}
              >
                Comprar
              </Button>

              <Button
                variant="outlined"
                color="primary"
                sx={{ px: 3, py: 1.2 }}
                onClick={() => navigate("/vermas")}
              >
                Saber más
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}





