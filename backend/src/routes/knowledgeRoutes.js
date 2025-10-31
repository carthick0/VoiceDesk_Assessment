import express from "express"
import { addKnowledge,queryKnowledge } from "../controllers/knowledgeController"

const router = express.Router();

router.post("/add", addKnowledge);
router.post("/query", queryKnowledge);

export default router;