import React from "react";
import FormularioContacto from "../components/FormularioContacto";
import { Box, Typography } from "@mui/material"; 

function Contacto() {
  
 
  const imageUrl = "https://cdn.pixabay.com/photo/2023/04/02/18/21/fruit-market-7895200_1280.jpg";
  
  return (
    <>
      
      <Box
        sx={{
          minHeight: "60vh", // Esto empuja el footer hacia abajo
          display: "flex",
          flexDirection: "column", // Apila los elementos verticalmente
          alignItems: "center",    // Centra horizontalmente
          justifyContent: "center",  // Centra verticalmente
          padding: 4, // Agregamos un poco de padding
        }}
      >
        
        
        <Box
          component="img"
          src={imageUrl}
          alt="Ilustración de un mercado de agricultores, representando el comercio local y comunitario."
          sx={{
            width: '100%',
            maxWidth: 400, // Máximo de 400px de ancho para que se vea bien
            height: 'auto',
            borderRadius: 2, // Bordes ligeramente redondeados
            mb: 4, // Margen inferior para separarlo del texto
            boxShadow: 3, // Sombra sutil para un efecto visual agradable
          }}
        />

       
        <Typography variant="h4" component="h1" align="center" sx={{ mb: 2 }}>
          ¡Queremos escucharte!
        </Typography>

        <Typography variant="subtitle1" align="center" sx={{ mb: 4, maxWidth: 600 }}>
          Si tienes dudas, sugerencias o quieres formar parte de nuestra comunidad de productores, por favor completa el siguiente formulario. ¡Estamos para ayudarte!
        </Typography>

        
        <Box sx={{ maxWidth: 500, width: '100%' }}>
          <FormularioContacto/>
        </Box>
        
      </Box>
    </>
  );
}
export default Contacto;