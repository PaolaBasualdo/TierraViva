import express from "express";
import { enviarFormularioContacto } from "../../controllers/contacto.controller.js";

const router = express.Router();

router.post("/", enviarFormularioContacto);

export default router;
