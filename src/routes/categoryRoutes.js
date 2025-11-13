import express from "express";
import { body } from "express-validator";
import { CategoryController } from "../controllers/categoryController.js";
import { handleInputErrors } from "../middleware/validation.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", CategoryController.getCategories);

router.post("/",
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    authenticateToken,
    authorizeRoles('admin'),
    handleInputErrors,
    CategoryController.createCategory
)

router.put("/:id",
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    authenticateToken,
    authorizeRoles('admin'),
    handleInputErrors,
    CategoryController.updateCategory
)

router.delete("/:id",
    authenticateToken,
    authorizeRoles('admin'),
    CategoryController.deleteCategory
)

export default router;
