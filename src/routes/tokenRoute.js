import express from "express";
import { generateLivekitToken } from "../config/livekitConfig.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { identity } = req.body;
    if (!identity) {
      return res.status(400).json({ error: "Identity is required" });
    }

    const token = await generateLivekitToken(identity);
    res.json({ token });
  } catch (err) {
    console.error("Token generation failed:", err);
    res.status(500).json({ error: err.message || "Failed to generate token" });
  }
});

export default router;
