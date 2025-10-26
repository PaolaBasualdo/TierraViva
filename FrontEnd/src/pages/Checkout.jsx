// src/pages/Checkout.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import API from "../api";

export default function Checkout() {
  const { idPedido } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("transferencia");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        const res = await API.get(`/pedidos/${idPedido}`);
        setPedido(res.data.data);
      } catch (err) {
        console.error(err);
        enqueueSnackbar("Error al cargar el pedido ❌", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchPedido();
  }, [idPedido, enqueueSnackbar]);

  const handleConfirmar = async () => {
    try {
      await API.put(`/pedidos/${idPedido}`, {
        direccion,
        metodo: metodoPago,
        estado: "confirmado",
      });
      enqueueSnackbar("Pedido confirmado ✅", { variant: "success" });
      navigate(`/pedido/${idPedido}`); // o "/perfil/pedidos"
    } catch (error) {
      enqueueSnackbar("Error al confirmar el pedido ❌", { variant: "error" });
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={8}>
        <CircularProgress color="primary" />
      </Box>
    );

  if (!pedido)
    return (
      <Typography align="center" mt={8} color="text.secondary">
        No se encontró el pedido.
      </Typography>
    );

  return (
    <Box sx={{ backgroundColor: "background.default", py: 4 }}>
      <Paper
        sx={{
          maxWidth: 600,
          mx: "auto",
          p: 4,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Confirmar pedido #{pedido.id}
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Verificá tus datos antes de finalizar la compra.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Dirección */}
        <TextField
          label="Dirección de entrega"
          fullWidth
          variant="outlined"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Método de pago */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Método de pago
        </Typography>
        <RadioGroup
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          sx={{ mb: 3 }}
        >
          <FormControlLabel
            value="transferencia"
            control={<Radio color="primary" />}
            label="Transferencia bancaria"
          />
          <FormControlLabel
            value="tarjeta"
            control={<Radio color="primary" />}
            label="Tarjeta de crédito/débito"
          />
          <FormControlLabel
            value="efectivo"
            control={<Radio color="primary" />}
            label="Efectivo al recibir"
          />
        </RadioGroup>

        {/* Resumen */}
        <Divider sx={{ mb: 3 }} />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Resumen del pedido:
        </Typography>
{console.log("pedido:", pedido)}
{console.log("productos:", pedido?.productos)}

        {pedido.productos?.map((p) => (
          <Box
            key={p.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              pl: 1,
            }}
          >
            <Typography>{p.nombre}</Typography>
            <Typography>
              {p.PedidoProducto?.cantidad} × ${p.precio}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleConfirmar}
          sx={{
            py: 1.2,
            fontSize: "16px",
          }}
        >
          Confirmar pedido
        </Button>
      </Paper>
    </Box>
  );
}
