import express from "express";
import { generateLivekitToken } from "../config/livekitConfig.js";


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Identity is required" });
    }

    const token = await generateLivekitToken(name);
    res.json({ token });
    console.log(res)
  } catch (err) {
    console.error("Token generation failed:", err);
    res.status(500).json({ error: err.message || "Failed to generate token" });
  }
});



export default router;
