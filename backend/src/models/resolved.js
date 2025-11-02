import mongoose from "mongoose";

const resolvedSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
  },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resolved", resolvedSchema);
