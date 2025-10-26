// src/components/CategoriaCard.jsx

import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
//1. Importar la función auxiliar (ajusta la ruta según donde esté el archivo)
import { getImageUrl } from "../utils/imageUtils"; // Asumiendo que está en src/utils
import { useSnackbar } from "notistack";

function CategoriaCard({ id, nombre, imagenUrl }) {
  
  // 2. Resolver la URL de la imagen al inicio del componente
  // 'imagenUrl' aquí es el nombre del archivo, lo convertimos a la URL completa.
  const finalImageUrl = getImageUrl(imagenUrl);
    
  return (
    <Link to={`/categoria/${id}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          width: 250,
          height: 320,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "center",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.03)",
          },
        }}
      >
        <CardMedia
          component="img"
          //  3. Usar la URL resuelta
          image={finalImageUrl} 
          alt={nombre}
          sx={{
            height: 160,
            objectFit: "cover",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1.5,
          }}
        >
          <Typography
            variant="subtitle1"
            color="text.primary"
            noWrap
            sx={{ fontSize: "1.1rem" }}
          >
            {nombre}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CategoriaCard;