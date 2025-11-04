// src/middleware/upload.js

//  1. Cambiar require() por import (Sintaxis ESM)
import multer from 'multer';
import path from 'path'; // path es un módulo nativo, se importa igual

// -----------------------------------------------------------
// 1. Configuración de Almacenamiento (Storage)
// -----------------------------------------------------------
const storage = multer.diskStorage({
  // **destination:** Define dónde se guardarán los archivos
  destination: (req, file, cb) => {
    // Usamos path.join para construir la ruta absoluta a public/images
    cb(null, path.join(path.resolve(), 'public', 'images')); 
  },
  
  // **filename:** Define cómo se nombrará el archivo dentro de la carpeta
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); 
    const baseName = path.basename(file.originalname, fileExtension); 
    
    // El formato será: nombreOriginal-timestamp.ext
    cb(null, `${baseName}-${Date.now()}${fileExtension}`);
  }
});

// -----------------------------------------------------------
// 2. Filtro de Archivos (File Filter)
// -----------------------------------------------------------
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || 
      file.mimetype === 'image/jpg' || 
      file.mimetype === 'image/png') {
    cb(null, true); 
  } else {
    // Rechazar el archivo
    cb(null, false);
  }
};

// -----------------------------------------------------------
// 3. Inicialización de Multer
// -----------------------------------------------------------
const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter, 
  limits: {
    fileSize: 1024 * 1024 * 5 // 5 MB
  }
});

//  4. Cambiar module.exports por export default (Sintaxis ESM)
// Exportamos el método `single` para subir una sola imagen en el campo 'image'
export default upload.single('image');