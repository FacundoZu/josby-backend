import { Router } from "express";
import { OrderController } from "../controllers/orderController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.get("/:id",authenticateToken, OrderController.getOrderById);
router.get("/",authenticateToken, OrderController.getOrderByUser);
router.post("/", authenticateToken, authorizeRoles("user"), OrderController.createOrder);



export default router;