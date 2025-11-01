import express from "express";
import {
  getUnresolved,
  resolveUnresolved
} from "../controllers/unresolvedController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only humanai role can view or resolve unresolved questions
router.get("/", protect, allowRoles("humanai"), getUnresolved);
router.post("/resolve/:id", protect, allowRoles("humanai"), resolveUnresolved);

export default router;
