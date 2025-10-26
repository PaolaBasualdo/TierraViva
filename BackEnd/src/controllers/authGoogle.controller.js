// src/controllers/authGoogle.controller.js
import axios from "axios";
import Usuario from "../models/Usuario.js"; // ✅ si el archivo está en src/controllers
import { generateTokens } from "./auth.controller.js";

export const loginWithGoogle = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionó el token de Google",
      });
    }

    // Obtener perfil desde Google
    const { data: googleProfile } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log("Perfil recibido de Google:", googleProfile);

    // Buscar usuario por email
    let usuario = await Usuario.findOne({
      where: { email: googleProfile.email },
    });

    if (!usuario) {
      // Crear usuario si no existe
      usuario = await Usuario.create({
        nombre: googleProfile.name,
        email: googleProfile.email,
        proveedor: "google",
        proveedorId: googleProfile.id,
      });
    } else if (usuario.proveedor !== "google") {
      // Actualizar proveedor si era otro
      usuario.proveedor = "google";
      usuario.proveedorId = googleProfile.id;
      await usuario.save();
    }

    // Generar tokens JWT
    const { accessToken, refreshToken } = generateTokens(usuario);

    res.json({
      success: true,
      message: "Login con Google exitoso",
      data: { accessToken, refreshToken, usuario },
    });
  } catch (err) {
    console.error("❌ Error en login con Google:", err);
    res.status(500).json({
      success: false,
      error:
        "Error interno del servidor. Por favor, intente de nuevo más tarde.",
    });
  }
};
