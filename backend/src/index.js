import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tokenRoute from "./routes/tokenRoute.js";
import kbRoutes from "./routes/kbRoutes.js"
import { connectDB } from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/token", tokenRoute);
app.use('/api/kb',kbRoutes)

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");
    console.log(`✅ Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
});
