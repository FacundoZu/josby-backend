import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/authController.js";
import { handleInputErrors } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";
import passport from "passport";

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/login',
    body('email').isEmail().withMessage('Email no valido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.login
)

router.get("/authUser",
    authenticateToken,
    AuthController.authUser
)

router.post('/logout',
    authenticateToken,
    AuthController.logout
)

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
    AuthController.sessionCallBack
);


export default router;
