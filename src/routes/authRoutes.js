import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/authController.js";
import { handleInputErrors } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post('/login',
    body('email').isEmail().withMessage('Email no valido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.login
)

router.post('/logout',
    authenticateToken,
    AuthController.logout
)


export default router;
