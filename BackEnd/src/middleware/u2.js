// src/middleware/upload.js

const multer = require('multer');
const path = require('path');

// -----------------------------------------------------------
// 1. Configuración de Almacenamiento (Storage)
// -----------------------------------------------------------
// Indicamos a Multer que use el disco duro (diskStorage) para guardar los archivos.
const storage = multer.diskStorage({
  // **destination (Destino):** Función que define dónde se guardará el archivo.
  destination: (req, file, cb) => {
    // Usamos `path.join` para crear una ruta segura y que funcione en cualquier sistema operativo.
    // Buscamos la carpeta 'public/images' desde la ubicación de este middleware.
    const uploadPath = path.join(__dirname, '../../public/images');
    
    // El primer argumento (null) es para errores, el segundo es la ruta final.
    cb(null, uploadPath);
  },
  
  // **filename (Nombre del archivo):** Función que define cómo se nombrará el archivo.
  filename: (req, file, cb) => {
    // Para evitar conflictos (dos personas suben "logo.png"), creamos un nombre único.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // Obtenemos la extensión original (ej: '.jpg')
    const fileExtension = path.extname(file.originalname); 
    
    // El nombre final será: ID_ÚNICO + EXTENSIÓN
    cb(null, `${uniqueSuffix}${fileExtension}`);
  }
});

// -----------------------------------------------------------
// ¡DETENTE AQUÍ!
// -----------------------------------------------------------
// En el siguiente paso configuraremos el filtro y la exportación.

// -----------------------------------------------------------
// 2. Filtro de Archivos (File Filter)
// -----------------------------------------------------------
const fileFilter = (req, file, cb) => {
  // Verificamos si la extensión del archivo es una imagen
  // Aceptamos solo JPG, JPEG y PNG. ¡Crucial para la seguridad!
  if (file.mimetype === 'image/jpeg' || 
      file.mimetype === 'image/jpg' || 
      file.mimetype === 'image/png') {
    
    // Si el tipo MIME es aceptable, llamamos al callback con 'true'
    cb(null, true); 
  } else {
    // Si el tipo MIME NO es aceptable, llamamos al callback con 'false'
    // Multer simplemente ignora este archivo y no lo sube.
    // Opcionalmente, podrías pasar un error aquí: cb(new Error('Solo se permiten imágenes JPEG, JPG o PNG'));
    cb(null, false);
  }
};

// -----------------------------------------------------------
// 3. Inicialización y Exportación de Multer
// -----------------------------------------------------------
const upload = multer({ 
  storage: storage,           // Usamos el almacenamiento que ya definimos
  fileFilter: fileFilter,     // ¡Usamos el filtro de seguridad!
  limits: {
    // Límite opcional: tamaño máximo del archivo en bytes (Ej: 5MB)
    // 1024 bytes * 1024 * 5 = 5,242,880 bytes (5 Megabytes)
    fileSize: 1024 * 1024 * 5 
  }
});

// Exportamos Multer para subir un *único* archivo en un campo llamado 'image'.
// Esto significa que en tu formulario (FormData) el campo debe llamarse 'image'.
module.exports = upload.single('image');