import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import livekitRoutes from "./routes/livekitRoutes.js";
import knowledgeRoutes from "./routes/knowledgeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import unresolvedRoutes from "./routes/unresolvedRoutes.js"
import { connectDB } from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/token", livekitRoutes);
app.use('/api/kb',knowledgeRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/unresolved',unresolvedRoutes)

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");
    console.log(`✅ Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
});
