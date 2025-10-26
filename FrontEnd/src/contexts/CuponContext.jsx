import { createContext, useContext, useState } from 'react';
import axios from 'axios';

// 1. Crear el contexto
const CuponContext = createContext();

// 2. Provider del contexto
export function CuponContextProvider({ children }) {
  const [cuponActivo, setCuponActivo] = useState(null);//fijar un estado

  // 3. Validar y aplicar el cupón
  async function validarYAplicarCupon(codigoCupon) {
    try {
      const response = await axios.get(`http://localhost:3000/api/cupones/validar/${codigoCupon}`);
      
      // Si es válido, se guarda el cupón completo en el estado global
      setCuponActivo(response.data);
      console.log("Cupón válido aplicado:", response.data);
      
      //  retornar el cupón para que el componente lo use
      return { exito: true, cupon: response.data };

    } catch (error) {
      // Si hay error (cupón inválido o inactivo), limpiamos el contexto
      setCuponActivo(null);
      console.error("Cupón inválido o inactivo:", error.response?.data?.message || error.message);

      return { exito: false, mensaje: "Cupón inválido o inactivo" };
    }
  }
  
  // 4. Quitar cupón manualmente
  function quitarCupon() {
    setCuponActivo(null);
    console.log("Cupón eliminado.");
  }

  // 5. Exponer funciones y estado a toda la app
  return (
    <CuponContext.Provider value={{
      cuponActivo,
      validarYAplicarCupon,
      quitarCupon
    }}>
      {children}
    </CuponContext.Provider>
  );
}

// 6. Hook personalizado para usar el contexto
export function useCuponContexto() {
  return useContext(CuponContext);
}
