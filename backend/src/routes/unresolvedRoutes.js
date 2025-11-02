import express from "express";
import {
    getResolvedByUser,
  getUnresolved,
  resolveUnresolved
} from "../controllers/unresolvedController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getUnresolved);
router.post("/resolve/:id", protect, allowRoles("humanai"), resolveUnresolved);
router.get("/resolved/:userId", getResolvedByUser);
export default router;
