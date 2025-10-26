import jwt from "jsonwebtoken";

export const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Token no proporcionado"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // guardamos datos del usuario en el socket
    next();
  } catch (error) {
    console.error("❌ Error de autenticación en socket:", error.message);
    next(new Error("Autenticación inválida"));
  }
};
