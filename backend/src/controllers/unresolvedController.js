import Unresolved from "../models/unresolved.js";
import Knowledge from "../models/knowledge.js";
import Resolved from "../models/resolved.js";

// 🧠 Get all unresolved questions
export const getUnresolved = async (req, res) => {
  try {
    const unresolved = await Unresolved.find().sort({ createdAt: -1 });
    res.json(unresolved);
  } catch (err) {
    console.error("Error fetching unresolved:", err);
    res.status(500).json({ error: "Failed to fetch unresolved questions" });
  }
};

// ✅ Human AI resolves a question
export const resolveUnresolved = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ error: "Answer is required" });
    }

    const unresolved = await Unresolved.findById(id);
    if (!unresolved) {
      return res.status(404).json({ error: "Unresolved question not found" });
    }

    // 💾 Save in Knowledge Base
    const entry = new Knowledge({
      question: unresolved.question.toLowerCase(),
      answer,
      resolvedBy: req.user.id,
    });
    await entry.save();

    // 💾 Move to Resolved collection
    const resolvedEntry = new Resolved({
      question: unresolved.question,
      answer,
      user: unresolved.user,
      resolvedBy: req.user.id,
    });
    await resolvedEntry.save();

    // 🗑️ Remove from Unresolved
    await Unresolved.findByIdAndDelete(id);

    res.json({
      message: "✅ Question resolved and added to Knowledge + Resolved collection",
      resolvedEntry,
    });
  } catch (err) {
    console.error("Error resolving question:", err);
    res.status(500).json({ error: "Failed to resolve question" });
  }
};

export const getResolvedByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const resolved = await Resolved.find({ "user.id": userId })
      .sort({ createdAt: -1 })
      .populate("resolvedBy", "name email");

    res.json(resolved);
  } catch (err) {
    console.error("Error fetching resolved:", err);
    res.status(500).json({ error: "Failed to fetch resolved questions" });
  }
};
