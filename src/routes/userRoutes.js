import express from "express";
import { body } from "express-validator";
import { UserController } from "../controllers/userController.js";
import { handleInputErrors } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", [
    body("firstname").notEmpty().withMessage("El nombre es obligatorio"),
    body("lastname").notEmpty().withMessage("El apellido es obligatorio"),
    body("email").isEmail().withMessage("El correo es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
    body("birthdate").notEmpty().withMessage("La fecha de nacimiento es obligatoria"),
], handleInputErrors, UserController.registerUser);

router.get("/profile", authenticateToken, UserController.getProfile);

router.put("/profile", authenticateToken, UserController.updateProfile);

router.get("/profile/services", authenticateToken, UserController.getUserServices);

export default router;
