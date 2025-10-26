// server/sockets/index.js - CÓDIGO CORREGIDO

import { socketAuth } from "../middleware/socketAuth.js";

export const initSockets = (io) => {
  // Middleware de autenticación
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log(
      `✅ Usuario conectado vía Socket: ${socket.id}, userId: ${socket.user.id}`
    );

    // 1. UNIR A SALA PERSONAL
    // Esto permite enviar mensajes directamente a este usuario.
    socket.join(`user_${socket.user.id}`);

    // 2. UNIR A SALA DE ADMINS
    // Usamos el dato `is_admin` que esta en el token (y que el middleware guarda en socket.user)
    if (socket.user.esAdmin) {
      socket.join("admins");
      console.log(
        `🔑 Admin conectado: ${socket.user.nombre} se unió a la sala 'admins'`
      );
    }

    socket.on("disconnect", () => {
      console.log(`Usuario desconectado: ${socket.user.id}`);
    });
  });
};
