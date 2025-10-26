// index.js
import express from "express";
import sequelize from "./src/config/database.js";
import indexRoutes from "./src/routes/v1/index.routes.js";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

// Crear app de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); 
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

// Rutas
app.get("/", (req, res) => res.send("¡Backend funcionando correctamente!"));
app.use("/api/v1", indexRoutes);

// Crear servidor HTTP
const server = http.createServer(app);

// Inicializar Socket.IO
export const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

// Inicializar lógica de sockets (archivo separado)
import { initSockets } from "./src/sockets/index.js";
initSockets(io); // pasamos io para que registre eventos

// Función para iniciar DB y servidor
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
    console.log("Modelos listos, sin sincronización automática.");

    server.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`API v1: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
}

startServer();

