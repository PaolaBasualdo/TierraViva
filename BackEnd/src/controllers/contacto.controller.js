import { enviarEmail } from "../config/emailConfig.js";

export const enviarFormularioContacto = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios",
      });
    }

    // Armamos el contenido del correo
    const mensajeHtml = `
      <h3>Nuevo mensaje de contacto</h3>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje}</p>
    `;

    // Enviamos el correo al mail de destino configurado
    const enviado = await enviarEmail({
      para: process.env.EMAIL_USER, // ej: contacto@tierraviva.com
      asunto: `Nuevo mensaje de contacto de ${nombre}`,
      mensajeHtml,
    });

    if (!enviado) {
      return res.status(500).json({
        success: false,
        message: "No se pudo enviar el mensaje, inténtelo más tarde",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tu mensaje fue enviado correctamente. Gracias por contactarnos.",
    });
  } catch (error) {
    console.error("Error en enviarFormularioContacto:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
