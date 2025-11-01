import Unresolved from "../models/unresolved.js";
import Knowledge from "../models/knowledge.js";

export const getUnresolved = async (req, res) => {
  try {
    const unresolved = await Unresolved.find().sort({ createdAt: -1 });
    res.json(unresolved);
  } catch (err) {
    console.error("Error fetching unresolved:", err);
    res.status(500).json({ error: "Failed to fetch unresolved questions" });
  }
};

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

    
    const entry = new Knowledge({
      question: unresolved.question.toLowerCase(),
      answer,
      resolvedBy: req.user.id, 
    });

    await entry.save();
    await Unresolved.findByIdAndDelete(id);

    res.json({
      message: "Question resolved and added to Knowledge Base",
      entry,
    });
  } catch (err) {
    console.error("Error resolving question:", err);
    res.status(500).json({ error: "Failed to resolve question" });
  }
};
