import { useEffect, useState } from "react";
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Paper, 
  Box, 
  Button,
  CardMedia // 🚨 1. Importar CardMedia para mostrar la imagen
} from "@mui/material";
import API from "../api";
// 🚨 2. Importar la utilidad de imagen
import { getImageUrl } from "../utils/imageUtils";

export default function MisProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await API.get("/productos/mios");
        let rawProductos = res.data.data || [];
        
        // 🚨 3. Pre-procesar los productos para resolver la URL de la imagen
        const processedProductos = rawProductos.map(p => ({
            ...p,
            // Asumimos que el campo de la imagen en el producto se llama 'imagen'
            imagenUrl: getImageUrl(p.imagen), 
        }));
        
        setProductos(processedProductos);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Mis Productos
      </Typography>
      {productos.length === 0 ? (
        <Typography>No tenés productos cargados.</Typography>
      ) : (
        productos.map((p) => (
          <Paper 
            key={p.id} 
            sx={{ 
              p: 2, 
              mb: 2, 
              display: 'flex', // 🚨 4. Usar flexbox para alinear imagen y texto
              gap: 2,
              alignItems: 'center'
            }}
          >
            {/* 🚨 5. Mostrar la imagen si existe */}
            {p.imagenUrl && (
                <CardMedia
                    component="img"
                    image={p.imagenUrl} // Usamos la URL resuelta
                    alt={p.nombre}
                    sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                />
            )}
            
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{p.nombre}</Typography>
                <Typography>{p.descripcion}</Typography>
                <Typography>Precio: ${p.precio}</Typography>
                <Typography>Stock: {p.stock}</Typography>
                <Button variant="outlined" sx={{ mt: 1 }}>
                  Editar
                </Button>
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
}