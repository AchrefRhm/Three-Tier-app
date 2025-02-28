require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const InterviewRouter = require("./routes/Interview");
const AuthRoute = require("./routes/user");
const recommendationsRouter = require("./routes/Recommendation");
const QuizRoute = require("./routes/Quiz");
const CvRoute = require("./routes/Cv");
const AnalyseRoute = require("./routes/SoftSkillAnalyse");
const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api/interview", InterviewRouter);
app.use("/api/auth", AuthRoute);
app.use("/api", recommendationsRouter);
app.use("/api/quiz", QuizRoute);
app.use("/api/cv", CvRoute);
app.use("/api/analyse", AnalyseRoute);
// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Express API!");
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
