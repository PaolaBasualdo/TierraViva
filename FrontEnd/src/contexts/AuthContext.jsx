{/*// src/context/AuthContext.jsx (Corregido)
import { createContext, useState, useContext, useEffect } from "react";
import API from "../api";
import { getImageUrl } from "../utils/imageUtils"; 

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    // 💡 NUEVO: Estado para saber si ya se revisó localStorage
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedAccess = localStorage.getItem("accessToken");
        const storedRefresh = localStorage.getItem("refreshToken");

        if (storedUser && storedAccess && storedRefresh) {
            try {
                const parsedUser = JSON.parse(storedUser);
                
                let finalFotoPerfil = parsedUser.fotoPerfil;
                
                if (parsedUser.imagen && !parsedUser.fotoPerfil?.startsWith('http')) {
                    finalFotoPerfil = getImageUrl(parsedUser.imagen);
                } else if (parsedUser.fotoPerfil && parsedUser.fotoPerfil.startsWith('/images/')) {
                    const fileName = parsedUser.fotoPerfil.replace('/images/', '');
                    finalFotoPerfil = getImageUrl(fileName);
                }
                
                setUser({ ...parsedUser, fotoPerfil: finalFotoPerfil });
                setAccessToken(storedAccess);
                setRefreshToken(storedRefresh);
                
                // 💡 CORRECCIÓN CLAVE: Restablecer el token en el header global de Axios
                API.defaults.headers.common['Authorization'] = `Bearer ${storedAccess}`;

            } catch (err) {
                console.error("Error parsing stored user:", err);
                logout(); 
            }
        }
        
        // Finalizamos la verificación, incluso si falló el login
        setLoading(false); 
        
    }, []); 

    // Login: guarda usuario y tokens en estado y localStorage
    const login = (userData, tokens) => {
        // ... (Tu lógica de fotoPerfil es correcta aquí)
        const userWithFoto = { /* ... */ }; // omitido por brevedad
        
        // ... (Tu lógica para guardar en estado y localStorage)
        {/*setUser(userWithFoto);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        localStorage.setItem("user", JSON.stringify(userWithFoto));
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        
        // 💡 AÑADIDO: Establecer el token en el header de Axios inmediatamente después del login
        API.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
    };

    // ... (Tu lógica para updateUserData es correcta)

    // Logout: limpia estado y localStorage
    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.clear();
        // 💡 AÑADIDO: Eliminar el token de Axios al hacer logout
        delete API.defaults.headers.common['Authorization']; 
    };

    // ... (refreshAccessToken se mantiene igual)

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                loading, // 💡 EXPORTAR NUEVO ESTADO DE CARGA
                login,
                logout,
                refreshAccessToken,
                isAuthenticated,
                updateUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};*/}

import { createContext, useState, useContext, useEffect } from "react";
import API from "../api";
// Importar la utilidad de imagen
import { getImageUrl } from "../utils/imageUtils"; 

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

 useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const storedAccess = localStorage.getItem("accessToken");
  const storedRefresh = localStorage.getItem("refreshToken");

  if (storedUser && storedAccess && storedRefresh) {
    try {
      const parsedUser = JSON.parse(storedUser);
     
      // Si la fotoPerfil no es una URL completa, la re-resolvemos usando el nombre del archivo.
      let finalFotoPerfil = parsedUser.fotoPerfil;
      
      // La lógica en el backend guarda el nombre de archivo en 'imagen'
      if (parsedUser.imagen && !parsedUser.fotoPerfil?.startsWith('http')) {
          finalFotoPerfil = getImageUrl(parsedUser.imagen);
      } else if (parsedUser.fotoPerfil && parsedUser.fotoPerfil.startsWith('/images/')) {
          // Si por alguna razón guardamos la ruta relativa, la re-resolvemos.
          // Extraemos solo el nombre de archivo del string '/images/nombre.jpg'
          const fileName = parsedUser.fotoPerfil.replace('/images/', '');
          finalFotoPerfil = getImageUrl(fileName);
      }
      
      setUser({ ...parsedUser, fotoPerfil: finalFotoPerfil });
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
    } catch (err) {
      console.error("Error parsing stored user:", err);
      logout(); // limpia por seguridad si hay un valor corrupto
    }
  }
}, []); 

  // Login: guarda usuario y tokens en estado y localStorage
  const login = (userData, tokens) => {
    //  Lógica la fotoPerfil
    const userWithFoto = {
      ...userData,
      fotoPerfil: userData.imageUrl // Para perfiles de Google/otros (URL completa)
                      ? userData.imageUrl 
                      : userData.imagen // Campo con el nombre de archivo de Multer
                        ? getImageUrl(userData.imagen) // Transforma a URL ABSOLUTA
                        : null,
    };

    setUser(userWithFoto);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);

    localStorage.setItem("user", JSON.stringify(userWithFoto));
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  };

  const updateUserData = (newData) => {
    //  Lógica corregida para resolver la fotoPerfil en la actualización
    let newFotoPerfil = user?.fotoPerfil || null; // Valor por defecto

    if (newData.imageUrl) {
        newFotoPerfil = newData.imageUrl; // URL completa de proveedor externo
    } else if (newData.imagen) {
        newFotoPerfil = getImageUrl(newData.imagen); // Transforma a URL ABSOLUTA
    } else if (user?.fotoPerfil && !newData.imagen && !newData.imageUrl) {
        // Mantiene la foto actual si no se provee una nueva
        newFotoPerfil = user.fotoPerfil;
    }

    const updatedUser = {
      ...user,
      ...newData,
      fotoPerfil: newFotoPerfil, // Usar la URL resuelta
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };
  
  // Logout: limpia estado y localStorage
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clear();
  };

  // Refrescar token de acceso usando refresh token
  const refreshAccessToken = async () => {
    try {
      const res = await API.post("/auth/refresh", { token: refreshToken });
      const newAccess = res.data.data.accessToken;
      setAccessToken(newAccess);
      localStorage.setItem("accessToken", newAccess);
      return newAccess;
    } catch (err) {
      logout();
      throw new Error("No se pudo refrescar el token");
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
        isAuthenticated,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};













{/*import { createContext, useState, useContext, useEffect } from "react";
import API from "../api";
//Importar la utilidad de imagen (Asegura la ruta correcta)
import { getImageUrl } from "../utils/imageUtils"; 

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Recupera la sesión guardada en localStorage al montar la app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");

    if (storedUser && storedAccess && storedRefresh) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // CORRECCIÓN: Re-resolver la URL al cargar del localStorage para asegurar la URL absoluta
        let finalFotoPerfil = parsedUser.fotoPerfil;
        
        // Si el valor guardado no es una URL completa (no empieza con http), usamos getImageUrl.
        // Nos apoyamos en el campo 'imagen' (nombre del archivo) o 'fotoPerfil' si es una ruta relativa.
        if (parsedUser.imagen && !finalFotoPerfil?.startsWith('http')) {
            finalFotoPerfil = getImageUrl(parsedUser.imagen);
        } else if (finalFotoPerfil && finalFotoPerfil.startsWith('/images/')) {
            // Caso de que se haya guardado la ruta relativa, extraemos el nombre del archivo.
            const fileName = finalFotoPerfil.split('/').pop();
            finalFotoPerfil = getImageUrl(fileName);
        }
        
        setUser({ ...parsedUser, fotoPerfil: finalFotoPerfil });
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        logout(); // limpia por seguridad si hay un valor corrupto
      }
    }
  }, []);

  // Login: guarda usuario y tokens en estado y localStorage
  const login = (userData, tokens) => {
    // Lógica corregida para resolver la fotoPerfil: Usamos el nombre de archivo ('imagen') para generar la URL ABSOLUTA
    const imageUrlFromMulter = userData.imagen 
                                ? getImageUrl(userData.imagen) 
                                : null;
                                
    const userWithFoto = {
      ...userData,
      // Prioridad 1: URL de proveedor externo (imageUrl)
      // Prioridad 2: URL resuelta por Multer/getImageUrl
      fotoPerfil: userData.imageUrl 
                    ? userData.imageUrl 
                    : imageUrlFromMulter, 
    };

    setUser(userWithFoto);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);

    // Guardar la URL absoluta en Local Storage
    localStorage.setItem("user", JSON.stringify(userWithFoto));
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  };

  const updateUserData = (newData) => {
    // Lógica corregida para resolver la fotoPerfil en la actualización
    let newFotoPerfil = user?.fotoPerfil || null; // Valor por defecto

    if (newData.imageUrl) {
        newFotoPerfil = newData.imageUrl; // URL completa de proveedor externo
    } else if (newData.imagen) {
        // Si hay una nueva imagen (nombre de archivo), la resolvemos a URL absoluta
        newFotoPerfil = getImageUrl(newData.imagen); 
    } else if (user?.fotoPerfil && !newData.imagen && !newData.imageUrl) {
        // Mantiene la foto actual si no se provee una nueva
        newFotoPerfil = user.fotoPerfil;
    }

    const updatedUser = {
      ...user,
      ...newData,
      fotoPerfil: newFotoPerfil, // Usar la URL resuelta
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };
  
  // Logout: limpia estado y localStorage
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clear();
  };

  // Refrescar token de acceso usando refresh token
  const refreshAccessToken = async () => {
    try {
      const res = await API.post("/auth/refresh", { token: refreshToken });
      const newAccess = res.data.data.accessToken;
      setAccessToken(newAccess);
      localStorage.setItem("accessToken", newAccess);
      return newAccess;
    } catch (err) {
      logout();
      throw new Error("No se pudo refrescar el token");
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
        isAuthenticated,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};*/}


{
  /*// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Recupera la sesión guardada en localStorage al montar la app
  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const storedAccess = localStorage.getItem("accessToken");
  const storedRefresh = localStorage.getItem("refreshToken");

  if (storedUser && storedAccess && storedRefresh) {
    try {
      const parsedUser = JSON.parse(storedUser); // solo parsear si existe
      setUser(parsedUser);
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
    } catch (err) {
      console.error("Error parsing stored user:", err);
      logout(); // limpia por seguridad si hay un valor corrupto
    }
  }
}, []);

  // Login: guarda usuario y tokens en estado y localStorage
  const login = (userData, tokens) => {
    setUser(userData);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  };

  // Logout: limpia estado y localStorage
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.clear();
  };

  // Refrescar token de acceso usando refresh token
  const refreshAccessToken = async () => {
    try {
      const res = await API.post("/auth/refresh", { token: refreshToken });
      const newAccess = res.data.data.accessToken;
      setAccessToken(newAccess);
      localStorage.setItem("accessToken", newAccess);
      return newAccess;
    } catch (err) {
      logout();
      throw new Error("No se pudo refrescar el token");
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        refreshAccessToken,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};*/
}
