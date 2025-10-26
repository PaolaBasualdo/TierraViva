// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext"; // tu contexto actual de auth

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth(); // donde guardás el token y datos del usuario
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.accessToken) {
      const newSocket = io("http://localhost:3000", {
        auth: { token: user.accessToken }, // enviamos JWT al back
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket conectado:", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket desconectado");
      });

      return () => newSocket.disconnect();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);