// src/utils/imageUtils.js

// Asumiendo que tu servidor Express corre en http://localhost:3000
const BASE_URL = 'http://localhost:3000'; 

/**
 * Construye la URL completa para un archivo de imagen estático.
 * @param {string | null | undefined} fileName - El nombre del archivo (ej: 'abc-123.jpg').
 * @returns {string} La URL completa o una URL de imagen por defecto.
 */
export const getImageUrl = (fileName) => {
    // Si el backend ya nos devuelve una URL completa (como en Perfil.jsx), la usamos.
    // Esto es un control extra por si en algún controlador decidiste enviar la URL completa (p.imageUrl).
    if (fileName && fileName.startsWith('http')) {
        return fileName;
    }
    
    if (fileName && typeof fileName === 'string') {
        // Construye la URL estática: http://localhost:3000/images/nombre.jpg
        return `${BASE_URL}/images/${fileName}`;
    }
    
    // Fallback: usar una imagen por defecto
    // Asegúrate de que 'default.png' exista en tu carpeta /public/images/
    return '/images/default.png'; 
};