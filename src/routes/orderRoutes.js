import { Router } from "express";
import { OrderController } from "../controllers/orderController";

const router = Router();

router.get("/:id", OrderController.getOrderById);
router.get("/", OrderController.getOrderByUser);
router.post("/", OrderController.createOrder);



export default router;