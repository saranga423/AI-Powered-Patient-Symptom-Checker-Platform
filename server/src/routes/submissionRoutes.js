import { Router } from "express";
import {
  createSubmission,
  getSubmissions,
  getSubmission,
  updateSubmission,
  deleteSubmission
} from "../controllers/submissionController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, authorize("CUSTOMER"), createSubmission);
router.get("/", authenticate, authorize("ADMIN"), getSubmissions);
router.get("/:id", authenticate, authorize("ADMIN"), getSubmission);
router.put("/:id", authenticate, authorize("ADMIN"), updateSubmission);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteSubmission);

export default router;