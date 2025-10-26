// src/components/RutaProtegida.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function RutaProtegida({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RutaProtegida;
