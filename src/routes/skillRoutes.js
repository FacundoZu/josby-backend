import express from "express";
import { body } from "express-validator";
import { SkillController } from "../controllers/skillController.js";
import { handleInputErrors } from "../middleware/validation.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/", SkillController.getSkills);

router.post("/",
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    authenticateToken,
    authorizeRoles('admin'),
    handleInputErrors,
    SkillController.createSkill
)

router.put("/:id",
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    authenticateToken,
    authorizeRoles('admin'),
    handleInputErrors,
    SkillController.updateSkill
)

router.delete("/:id",
    authenticateToken,
    authorizeRoles('admin'),
    SkillController.deleteSkill
)

export default router;
