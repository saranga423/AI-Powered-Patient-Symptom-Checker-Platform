import { Router } from "express";
import {
  registerCustomer,
  customerLogin,
  adminLogin,
  refresh,
  logout,
  me
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/customer/register", registerCustomer);
router.post("/customer/login", customerLogin);
router.post("/admin/login", adminLogin);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;