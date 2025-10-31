import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/pending-requests", protect, allowRoles("human"), (req, res) => {
  res.json({ message: `Hello ${req.user.name}, here are the pending requests.` });
});

export default router;

