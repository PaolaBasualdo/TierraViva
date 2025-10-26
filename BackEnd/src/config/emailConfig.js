// src/config/emailConfig.js
import nodemailer from "nodemailer";

// Transporter: define cómo se envían los correos
const transporter = nodemailer.createTransport({
  service: "gmail", // también podrías usar otro: outlook, yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // tu correo de envío
    pass: process.env.EMAIL_PASS, // contraseña o app password
  },
});

// Función genérica para enviar un email
export const enviarEmail = async ({ para, asunto, mensajeHtml }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Tierra Viva" <${process.env.EMAIL_USER}>`,
      to: para,
      subject: asunto,
      html: mensajeHtml,
    });

    console.log("Correo enviado:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return false;
  }
};
