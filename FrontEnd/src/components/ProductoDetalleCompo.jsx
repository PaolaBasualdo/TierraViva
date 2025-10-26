import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  useTheme,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { getImageUrl } from "../utils/imageUtils";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import { useSnackbar } from "notistack";

export default function ProductoDetalleCompo() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { agregarProducto } = useCarrito();
  const { enqueueSnackbar } = useSnackbar();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await API.get(`/productos/${id}`);
        let rawProducto = res.data.data || res.data;
        const processedProducto = {
          ...rawProducto,
          imagen: getImageUrl(rawProducto.imagen),
        };
        setProducto(processedProducto);
      } catch {
        setError("Error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={theme.spacing(4)}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={theme.spacing(4)}>
        {error}
      </Typography>
    );

  if (!producto) return null;

  const aumentar = () => setCantidad((prev) => prev + 1);
  const disminuir = () => setCantidad((prev) => (prev > 1 ? prev - 1 : 1));

  const handleComprar = () => {
    if (!isAuthenticated) {
      enqueueSnackbar("Debes iniciar sesión o registrarte para comprar productos.", {
        variant: "warning",
        autoHideDuration: 4000,
      });
      navigate("/login");
      return;
    }

    agregarProducto(producto.id, cantidad);
    enqueueSnackbar(`${cantidad} x ${producto.nombre} agregado al carrito 🛒`, {
      variant: "success",
      autoHideDuration: 3000,
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
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
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: "100%", sm: 350 },
            height: { xs: 220, sm: "auto" },
            objectFit: "cover",
          }}
          image={producto.imagen}
          alt={producto.nombre}
        />

        <CardContent sx={{ flex: 1, p: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {producto.nombre}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {producto.descripcion || "Sin descripción disponible."}
          </Typography>

          <Typography
            variant="h4"
            color="primary"
            fontWeight={700}
            sx={{ mt: 1, mb: 3 }}
          >
            ${producto.precio}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 3,
              mt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
                px: 1.5,
              }}
            >
              <IconButton size="small" onClick={disminuir}>
                <Remove />
              </IconButton>
              <Typography sx={{ mx: 1.5, fontSize: "1.2rem" }}>
                {cantidad}
              </Typography>
              <IconButton size="small" onClick={aumentar}>
                <Add />
              </IconButton>
            </Box>

            <Button
              variant="contained"
              onClick={handleComprar}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Comprar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}




{
  /*import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Chip,
  useTheme,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import API from "../api";
import { getImageUrl } from "../utils/imageUtils";

function ProductoDetalleCompo() {
  const theme = useTheme();
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar producto
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await API.get(`/productos/${id}`);
        let rawProducto = res.data.data || res.data;
        const processedProducto = {
          ...rawProducto,
          imagen: getImageUrl(rawProducto.imagen),
        };
        setProducto(processedProducto);
      } catch {
        setError("Error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  {
    /// Cargar mensajes
  useEffect(() => {
    const fetchMensajes = async () => {
      try {
        const res = await API.get(`/productos/${id}/mensajes`);
        setMensajes(res.data);
      } catch {
        setError("Error al cargar los mensajes.");
      }
    };
    fetchMensajes();
  }, [id]);

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;
    try {
      await API.post(`/productos/${id}/mensajes`, { texto: nuevoMensaje });
      setNuevoMensaje("");
      const res = await API.get(`/productos/${id}/mensajes`);
      setMensajes(res.data);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };
  }

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={theme.spacing(4)}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (error)
    return (
      <Typography color="error" align="center" mt={theme.spacing(4)}>
        {error}
      </Typography>
    );

  if (!producto) return null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          maxWidth: 900,
          m: "auto",
          mt: theme.spacing(3),
          borderRadius: theme.shape.borderRadius * 2,
          boxShadow: theme.shadows[3],
        }}
      >
        {/* Imagen 
        <Box position="relative">
          <CardMedia
            component="img"
            sx={{
              width: { xs: "100%", sm: 350 },
              height: { xs: 220, sm: "auto" },
              objectFit: "cover",
              borderRadius: { sm: "8px 0 0 8px" },
            }}
            image={producto.imagen}
            alt={producto.nombre}
          />
        </Box>

        {/* Info *
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {producto.nombre}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {producto.descripcion || "Sin descripción disponible."}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            ${producto.precio}
          </Typography>
          {/* Botón Comprar *
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Button variant="contained" size="small">
              Comprar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProductoDetalleCompo;
    */
}
