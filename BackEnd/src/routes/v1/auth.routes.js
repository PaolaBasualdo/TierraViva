import { Router } from "express";
import { register, login } from "../../controllers/auth.controller.js";
import { loginWithGoogle } from "../../controllers/authGoogle.controller.js";
import { validateRegister, validateLogin, validateGoogleLogin, checkValidation } from "../../middleware/validation.js";

const router = Router();

// Registro y login normales
router.post("/register", validateRegister, checkValidation, register);
router.post("/login", validateLogin, checkValidation, login);

// Login con Google
router.post("/google", validateGoogleLogin, checkValidation, loginWithGoogle);

export default router;
