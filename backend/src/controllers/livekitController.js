import { generateLivekitToken } from "../config/livekitConfig.js";

export const getLivekitToken = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Identity is required" });
    }

    const token = await generateLivekitToken(name);
    res.json({ token });
  } catch (err) {
    console.error("Token generation failed:", err);
    res.status(500).json({ error: err.message || "Failed to generate token" });
  }
};
