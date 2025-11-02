import express from "express";
import { body } from "express-validator";
import { UserController } from "../controllers/userController.js";
import { handleInputErrors } from "../middleware/validation.js";

const router = express.Router();

router.post("/register", [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("surname").notEmpty().withMessage("El apellido es obligatorio"),
    body("email").isEmail().withMessage("El correo es obligatorio"),
    body("password").notEmpty().withMessage("La contraseña es obligatoria"),
    body("birthdate").notEmpty().withMessage("La fecha de nacimiento es obligatoria"),
], handleInputErrors, UserController.registerUser);

export default router;
