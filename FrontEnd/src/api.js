import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api/v1", //  Base URL Correcta
});

// Interceptor para agregar token y manejar Content-Type para archivos
API.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // MODIFICACIÓN CRUCIAL PARA MULTER/FormData 
    // Cuando el cuerpo de la solicitud es un objeto FormData, 
    // AXIOS debe OMITIR establecer el Content-Type,
    // ya que el navegador lo hará automáticamente, incluyendo el 'boundary' necesario.
    if (config.data instanceof FormData) {
        // Al borrar esta cabecera, permitimos que el navegador la configure correctamente.
        delete config.headers['Content-Type']; 
    }
    
    return config;
});

export default API;
{/*import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1", // ajusta
});

// Interceptor para agregar token
API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default API;*/}
