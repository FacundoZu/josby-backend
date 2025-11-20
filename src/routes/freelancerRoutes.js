import express from "express";
import { FreelancerController } from "../controllers/freelancerController.js";

const router = express.Router();

router.get("/", FreelancerController.getFreelancers);

export default router;
