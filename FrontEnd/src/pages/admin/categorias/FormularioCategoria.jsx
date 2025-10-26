// src/pages/admin/categorias/FormularioCategoria.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField, Button, Box, Typography, Paper, FormControlLabel, Checkbox, Avatar, IconButton, Input
} from "@mui/material";
import { AddAPhoto, Delete } from "@mui/icons-material";
import API from "../../../api";

export default function FormularioCategoria() {
  const [nombre, setNombre] = useState("");
  const [activo, setActivo] = useState(true);
  
  // 1. Estado NUEVO para la imagen actual (URL o nombre)
  const [currentImageUrl, setCurrentImageUrl] = useState(""); 
  // 2. Estado NUEVO para el archivo que el usuario selecciona (para Multer)
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Función de carga de datos (para edición)
  useEffect(() => {
    if (id) {
      API.get(`/categorias/${id}`)
        .then(res => {
          const cat = res.data.data;
          setNombre(cat.nombre || "");
          setActivo(cat.activo ?? true);
          
          // 3. Al cargar, guardamos la URL de la imagen existente
          setCurrentImageUrl(cat.imageUrl || (cat.imagenUrl ? `/images/${cat.imagenUrl}` : ""));
        })
        .catch(err => console.error(err));
    } else {
        // Limpiar al cambiar a modo creación
        setCurrentImageUrl("");
    }
  }, [id]);

  // 4. Manejador para el campo de tipo 'file'
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
        setImageFile(e.target.files[0]);
    } else {
        setImageFile(null);
    }
  };
  
  // 5. Manejador para eliminar la imagen (solo en el frontend por ahora)
  const handleRemoveImage = () => {
    setImageFile(null); // Borra el archivo seleccionado
    setCurrentImageUrl(""); // Borra la imagen actual (si ya existía)
    // NOTA: Para eliminar la imagen en la DB, necesitarías enviar un indicador especial
    // al backend y tener un endpoint que maneje esa lógica de eliminación.
  };
  
  // 6. Función principal de envío (Creación/Edición)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      setLoading(false);
      return;
    }
    
    // 🚨 Creamos FormData para manejar la posible imagen y los datos de texto
    const dataToSend = new FormData();
    dataToSend.append('nombre', nombre);
    dataToSend.append('activo', activo);

    // 7. Adjuntar la nueva imagen solo si fue seleccionada
    if (imageFile) {
        // 'image' debe coincidir con el campo Multer del backend (para Categoria)
        dataToSend.append('image', imageFile); 
    }
    
    // 8. Si es una edición y se eliminó la imagen, puedes enviar un flag
    // if (id && currentImageUrl === "" && !imageFile) {
    //     dataToSend.append('removeImage', true);
    // }
    
    try {
      if (id) {
        // PUT para edición. El backend actualizará la imagen si viene en FormData.
        console.log(dataToSend.get('nombre'), dataToSend.get('activo'))
        await API.put(`/categorias/${id}`, dataToSend);
      } else {
        // POST para creación.
        await API.post("/categorias", dataToSend);
      }
      navigate("/admin/categorias");
    } catch (error) {
      console.error(error.response?.data || error);
    } finally {
        setLoading(false);
    }
  };

  // 9. Determinar la URL de la imagen a mostrar (nueva o actual)
  const previewUrl = imageFile 
    ? URL.createObjectURL(imageFile) 
    : currentImageUrl || "";


  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        {id ? "Editar Categoría" : "Nueva Categoría"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        
        {/* 🚨 Zona de Subida de Imagen */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
            
            {/* 10. Avatar/Preview */}
            <Avatar 
                src={previewUrl} 
                sx={{ width: 80, height: 80, bgcolor: 'grey.300' }}
                variant="rounded"
            >
                {!previewUrl && <AddAPhoto />}
            </Avatar>

            {/* 11. Input y Botones */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Imagen de Categoría
                </Typography>
                
                {/* Input Oculto */}
                <Input
                    type="file"
                    id="categoria-image"
                    name="image"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    sx={{ display: 'none' }}
                />
                
                <label htmlFor="categoria-image">
                    <Button 
                        variant="outlined" 
                        component="span" 
                        size="small"
                        disabled={loading}
                    >
                        {previewUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                    </Button>
                </label>
                
                {(previewUrl || imageFile) && (
                    <Button 
                        variant="text" 
                        color="error" 
                        startIcon={<Delete />} 
                        onClick={handleRemoveImage}
                        sx={{ ml: 1 }}
                        disabled={loading}
                    >
                        Quitar
                    </Button>
                )}
                
                {imageFile && (
                    <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 0.5 }}>
                        **Archivo listo:** {imageFile.name}
                    </Typography>
                )}
            </Box>
        </Box>
        
        {/* Campos de Texto y Checkbox */}
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
          }
          label="Activo"
        />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/categorias")}
          disabled={loading}
        >
          Cancelar
        </Button>
      </Box>
    </Paper>
  );
}


{/*
  // src/pages/admin/categorias/FormularioCategoria.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField, Button, Box, Typography, Paper, FormControlLabel, Checkbox
} from "@mui/material";
import API from "../../../api";

export default function FormularioCategoria() {
  const [nombre, setNombre] = useState("");
  const [activo, setActivo] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      API.get(`/categorias/${id}`)
        .then(res => {
          const cat = res.data.data; // 👈 importante, tu controlador devuelve { data: categoria }
          setNombre(cat.nombre || "");
          setActivo(cat.activo ?? true);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    try {
      if (id) {
        await API.put(`/categorias/${id}`, { nombre, activo });
      } else {
        await API.post("/categorias", { nombre, activo });
      }
      navigate("/admin/categorias");
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        {id ? "Editar Categoría" : "Nueva Categoría"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
          }
          label="Activo"
        />
        <Button type="submit" variant="contained">
          Guardar
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/categorias")}
        >
          Cancelar
        </Button>
      </Box>
    </Paper>
  );
}*/}
