import { Router } from "express";
// Importación nombrada del controlador, como lo definimos ahora
import { controladorConsultaIA } from "../../controllers/ai.controller.js"; 

const router = Router();

router.post("/consultaIA", controladorConsultaIA);

export default router;