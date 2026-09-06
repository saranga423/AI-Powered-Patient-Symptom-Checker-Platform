import { Router } from "express";
import { createAdmin } from "../controllers/adminController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.post("/create", authenticate, authorize("ADMIN"), createAdmin);

export default router;