import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import CategoriaCard from "./CategoriaCard";
import API from "../api";
// 🚨 Importar la utilidad aquí para procesar la data
import { getImageUrl } from "../utils/imageUtils";
 

function CategoriaList() {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await API.get("/categorias");
                
                const rawCategorias = res.data.data || res.data; // Asumiendo que la data está en .data o .data.data
                
                // 🚨 1. Normalizar la data antes de guardarla en el estado
                const processedCategorias = rawCategorias.map(categoria => ({
                    ...categoria,
                    // Usamos la utilidad para convertir el nombre del archivo (imagenUrl) en la URL completa
                    imagenUrl: getImageUrl(categoria.imagenUrl || categoria.imagen),
                }));
                
                // 2. Guardar la data procesada
                setCategorias(processedCategorias);
            } catch (error) {
                console.error("Error al cargar categorías:", error);
            }
        };

        fetchCategorias();
    }, []);

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            gap={3}
            p={3}
            sx={{
                backgroundColor: "background.default",
            }}
        >
            {categorias.map((categoria) => (
                <CategoriaCard
                    key={categoria.id}
                    id={categoria.id}
                    nombre={categoria.nombre}
                    // 3. Pasamos la URL ya resuelta a CategoriaCard
                    imagenUrl={categoria.imagenUrl} 
                />
            ))}
        </Box>
    );
}

export default CategoriaList;