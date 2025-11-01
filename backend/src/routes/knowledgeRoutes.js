import express from "express"
import {addKnowledge,queryKnowledge}from "../controllers/knowledgeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", addKnowledge);
router.post("/query", protect,queryKnowledge);

export default router;