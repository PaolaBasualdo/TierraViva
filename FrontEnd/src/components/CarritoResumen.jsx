import { Box, Typography, Button, Divider, IconButton } from "@mui/material";
import { useCarrito } from "../contexts/CarritoContext";
import { getImageUrl } from "../utils/imageUtils";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const CarritoResumen = () => {
  const { carrito, vaciarCarrito, aumentarCantidad, disminuirCantidad, eliminarProducto, total, crearPedido } = useCarrito();
  
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();


  if (!carrito?.length) {
    return (
      <Typography
        variant="h6"
        color="text.secondary"
        textAlign="center"
        sx={{ mt: 3 }}
      >
        Tu carrito está vacío, ¡explora nuestros productos artesanales!
      </Typography>
    );
  }

  const handleAumentar = async (idProducto) => {
    try {
      await aumentarCantidad(idProducto);
      enqueueSnackbar("Cantidad aumentada 🛒", { variant: "info" });
    } catch (error) {
      console.error("Error al aumentar cantidad:", error);
      enqueueSnackbar("Error al aumentar la cantidad", { variant: "error" });
    }
  };

  const handleDisminuir = async (idProducto) => {
    try {
      await disminuirCantidad(idProducto);
      enqueueSnackbar("Cantidad reducida 🛒", { variant: "info" });
    } catch (error) {
      console.error("Error al disminuir cantidad:", error);
      enqueueSnackbar("Error al disminuir la cantidad", { variant: "error" });
    }
  };

  const handleEliminar = async (idProducto) => {
    try {
      await eliminarProducto(idProducto);
      enqueueSnackbar("Producto eliminado del carrito 🗑️", { variant: "warning" });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      enqueueSnackbar("Error al eliminar el producto", { variant: "error" });
    }
  };

  const handleComprar = async () => {
  if (!carrito.length) return;

  try {
    const pedido = await crearPedido();
    enqueueSnackbar(`Pedido #${pedido.id} creado correctamente ✅`, { variant: "success" });

    // Redirigir al checkout
    navigate(`/checkout/${pedido.id}`);
  } catch (error) {
    enqueueSnackbar("Error al procesar el pedido ❌", { variant: "error" });
  }
};

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 8px 16px rgba(93, 64, 55, 0.15)",
        maxWidth: 600,
        width: "100%",
        maxHeight: 600,
        overflowY: "auto",
        border: "1px solid #D8A48F",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        textAlign="center"
        sx={{ color: "primary.main", mb: 3 }}
      >
        Resumen de tu Compra
      </Typography>

      <Divider sx={{ mb: 3, borderColor: "secondary.main" }} />

      {carrito.map((item) => {
        const cantidad = item.cantidad || 1;
        const subtotal = item.subtotal || (item.precio || 0) * cantidad;

        return (
          <Box
            key={item.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "70px 1fr auto",
              alignItems: "center",
              mb: 2,
              pb: 1,
              borderBottom: "1px dotted #A3604D50",
            }}
          >
            <img
              src={getImageUrl(item.imagen)}
              alt={item.nombre || "producto"}
              width={60}
              height={60}
              style={{
                borderRadius: 8,
                objectFit: "cover",
                border: "2px solid #6B8E2350",
              }}
            />

            <Box sx={{ ml: 2 }}>
              <Typography sx={{ fontWeight: "bold", color: "text.primary" }}>
                {item.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.precio?.toFixed(2)} c/u
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, gap: 0.5 }}>
                <IconButton size="small" onClick={() => handleDisminuir(item.id)} color="secondary" sx={{ p: 0.5 }}>
                  <RemoveIcon fontSize="inherit" />
                </IconButton>

                <Typography
                  sx={{
                    mx: 0.5,
                    fontWeight: "bold",
                    color: "primary.main",
                    minWidth: "20px",
                    textAlign: "center",
                  }}
                >
                  {cantidad}
                </Typography>

                <IconButton size="small" onClick={() => handleAumentar(item.id)} color="secondary" sx={{ p: 0.5 }}>
                  <AddIcon fontSize="inherit" />
                </IconButton>

                <IconButton size="small" color="error" onClick={() => handleEliminar(item.id)} sx={{ ml: 1, p: 0.5 }}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Box>

            <Typography sx={{ fontWeight: "bold", color: "primary.main", justifySelf: "end" }}>
              ${subtotal.toFixed(2)}
            </Typography>
          </Box>
        );
      })}

      <Divider sx={{ my: 3, borderColor: "secondary.main" }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ color: "text.primary" }}>Total a Pagar:</Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "secondary.main" }}>
          ${total.toFixed(2)}
        </Typography>
      </Box>

      <Button onClick={handleComprar} variant="contained" color="primary" sx={{ mt: 1, width: "100%", py: 1.5, fontSize: "1rem" }}>
        Finalizar Compra
      </Button>

      <Button onClick={vaciarCarrito} variant="text" color="secondary" sx={{ mt: 1, width: "100%", color: "text.secondary", "&:hover": { backgroundColor: "transparent", textDecoration: "underline" } }}>
        Vaciar carrito
      </Button>
    </Box>
  );
};

export default CarritoResumen;



{
  /*import { Box, Typography, Button, Divider, IconButton } from "@mui/material";
import { useCarrito } from "../contexts/CarritoContext";
import { getImageUrl } from "../utils/imageUtils";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";



const CarritoResumen = () => {
    const {
        carrito,
        vaciarCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarProducto,
        total // ¡Usamos el total del contexto que ya se calcula correctamente!
    } = useCarrito();

    // NOTA: ELIMINAMOS la re-calculación local del total, ya que el contexto
    // ya lo hace con el subtotal que viene del backend.
    
    // const total = carrito.reduce((acc, item) => acc + (item.precio || 0) * (item.cantidad || 1), 0);
    // ELIMINADA: Usamos el 'total' que viene del useCarrito()

    const handleComprar = async () => {
        // ... (lógica de handleComprar se mantiene igual)
        if (!carrito.length) return;
        // ...
    };

    if (!carrito.length) {
        return (
            <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
                Tu carrito está vacío, ¡explora nuestros productos artesanales!
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                p: 4, // Más padding
                backgroundColor: "background.paper", // Arcilla clara
                borderRadius: 3, // Más redondeado
                boxShadow: "0 8px 16px rgba(93, 64, 55, 0.15)", // Sombra más marcada
                maxWidth: 600,
                width: "100%",
                maxHeight: 600, // Permitimos un poco más de altura
                overflowY: "auto",
                border: '1px solid #D8A48F' // Un borde sutil de Rosa seco claro
            }}
        >
            <Typography 
                variant="h5" 
                gutterBottom 
                textAlign="center" 
                sx={{ color: 'primary.main', mb: 3 }} // Título en Verde Oliva
            >
                Resumen de tu Compra
            </Typography>

            <Divider sx={{ mb: 3, borderColor: 'secondary.main' }} /> {/* Separador Terracota 

            {carrito.map((item) => {
                const cantidad = item.cantidad || 1;
                // Usamos el subtotal del contexto/backend para mayor precisión
                const subtotal = item.subtotal || (item.precio || 0) * cantidad; 

                return (
                    <Box
                        key={item.id}
                        sx={{
                            display: "grid", // Usamos grid para una mejor alineación
                            gridTemplateColumns: "70px 1fr auto", // Imagen | Info | Subtotal
                            alignItems: "center",
                            mb: 2,
                            pb: 1,
                            borderBottom: '1px dotted #A3604D50' // Línea punteada suave
                        }}
                    >
                        {/* 1. IMAGEN *
                        <img
                            src={getImageUrl(item.imagen)}
                            alt={item.nombre || "producto"}
                            width={60}
                            height={60}
                            style={{
                                borderRadius: 8,
                                objectFit: "cover",
                                border: '2px solid #6B8E2350' // Borde sutil Verde Oliva
                            }}
                        />

                        {/* 2. INFO Y CONTROLES DE CANTIDAD *
                        <Box sx={{ ml: 2 }}>
                            <Typography sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {item.nombre}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ${item.precio?.toFixed(2)} c/u
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, gap: 0.5 }}>
                                <IconButton
                                    size="small"
                                    onClick={() => disminuirCantidad(item.id)}
                                    color="secondary" // Usamos Terracota
                                    sx={{ p: 0.5 }}
                                >
                                    <RemoveIcon fontSize="inherit" />
                                </IconButton>

                                <Typography sx={{ 
                                    mx: 0.5, 
                                    fontWeight: 'bold', 
                                    color: 'primary.main', 
                                    minWidth: '20px', 
                                    textAlign: 'center' 
                                }}>
                                    {cantidad}
                                </Typography>

                                <IconButton
                                    size="small"
                                    onClick={() => aumentarCantidad(item.id)}
                                    color="secondary"
                                    sx={{ p: 0.5 }}
                                >
                                    <AddIcon fontSize="inherit" />
                                </IconButton>

                                <IconButton
                                    size="small"
                                    color="error" // Usamos el color de error de MUI (o podrías definir un color Terracota para esto)
                                    onClick={() => eliminarProducto(item.id)}
                                    sx={{ ml: 1, p: 0.5 }}
                                >
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* 3. SUBTOTAL *
                        <Typography sx={{ fontWeight: 'bold', color: 'primary.main', justifySelf: 'end' }}>
                            ${subtotal.toFixed(2)}
                        </Typography>
                    </Box>
                );
            })}

            <Divider sx={{ my: 3, borderColor: 'secondary.main' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                 <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Total a Pagar:
                 </Typography>
                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                    ${total.toFixed(2)} {/* Usamos el total del contexto *
                 </Typography>
            </Box>


            <Button
                onClick={handleComprar}
                variant="contained"
                color="primary"
                sx={{ mt: 1, width: "100%", py: 1.5, fontSize: '1rem' }} // Botón principal, Verde Oliva
            >
                Finalizar Compra
            </Button>

            <Button
                onClick={vaciarCarrito}
                variant="text" // Cambiamos a 'text' para que sea más sutil y no compita
                color="secondary"
                sx={{ mt: 1, width: "100%", color: 'text.secondary', '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}
            >
                Vaciar carrito
            </Button>
        </Box>
    );
};

export default CarritoResumen;*/
}

{
  /*import { useCarrito } from "../context/CarritoContext";
import { Box, Typography, Button } from "@mui/material";
import { useCuponContexto } from "../context/CuponContext";


function CarritoResumen() {
  const { carrito, total, vaciarCarrito } = useCarrito();
  const { cuponActivo } = useCuponContexto();

  return (
    <Box
      sx={{
        backgroundColor: "#F5F5DC", // Beige claro
        padding: 3,
        borderRadius: 2,
        boxShadow: "0 2px 4px rgba(93, 64, 55, 0.2)", // Sombra marrón
        maxWidth: 600,
        margin: "auto",
      }}
    >
      <Typography variant="h6" sx={{ color: "#5D4037", marginBottom: 2 }}>
        Carrito de compras
      </Typography>

      {carrito.length === 0 ? (
        <Typography sx={{ color: "#5D4037" }}>No hay productos en el carrito.</Typography>
      ) : (
        <>
          {carrito.map((producto, i) => (
            <Box
              key={i}
              sx={{
                borderBottom: `1px solid rgba(163, 96, 77, 0.1)`, // Patrón terracota tenue
                paddingBottom: 2,
                marginBottom: 2,
              }}
            >
              <Typography sx={{ color: "#5D4037" }}>{producto.nombre}</Typography>
              <Typography sx={{ color: "#A3604D" }}>${producto.precio}</Typography>
            </Box>
          ))}
          <Box sx={{ marginTop: 2 }}>
            <Typography sx={{ color: "#5D4037", fontWeight: "bold" }}>
              Total: ${total}
            </Typography>
            <Button
              variant="contained"
              onClick={vaciarCarrito}
              sx={{
                backgroundColor: "#6B8E23", // Verde oliva
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#5D7230", // Verde oliva más oscuro
                },
                marginTop: 2,
              }}
            >
              Vaciar carrito
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default CarritoResumen;*/
}
