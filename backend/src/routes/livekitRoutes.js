import express from "express";
import { getLivekitToken } from "../controllers/livekitController.js";

const router = express.Router();

router.post("/", getLivekitToken);

export default router;
