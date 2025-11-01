import mongoose from "mongoose";

const unresolvedSchema = new mongoose.Schema({
  question: { type: String, required: true },
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Unresolved", unresolvedSchema);