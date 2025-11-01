import Knowledge from "../models/knowledge.js";
import Unresolved from "../models/unresolved.js";

export const addKnowledge = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Both question and answer required" });
    }

    const entry = new Knowledge({
      question: question.toLowerCase(),
      answer,
    });

    await entry.save();
    res.json({ message: "Knowledge added successfully", entry });
  } catch (error) {
    console.error("Error adding knowledge:", error);
    res.status(500).json({ error: "Failed to add knowledge" });
  }
};

export const queryKnowledge = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Text required" });

    const lower = question.toLowerCase();
    const entries = await Knowledge.find();
    let bestMatch = null;
    let highestScore = 0;

    for (const item of entries) {
      const qWords = item.question.split(" ");
      let matchCount = 0;

      for (const word of qWords) {
        if (lower.includes(word)) matchCount++;
      }

      const score = matchCount / qWords.length;

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    let reply = "I'm sorry, I didn't understand that.";
    if (bestMatch && highestScore >= 0.4) {
      reply = bestMatch.answer;
    }
    else {
      await Unresolved.create({
        question,
        user:req.user 
        ?{id:req.user.id,name:req.user.name}
        :{name:"Guest"}
      });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error fetching KB response:", error);
    res.status(500).json({ error: "Server error" });
  }
};
