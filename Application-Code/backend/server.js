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

// Add this variable to track connection state
let isDatabaseConnected = false;

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB Connected");
    isDatabaseConnected = true; // Update on successful connection
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    isDatabaseConnected = false;
  });

// Listen for MongoDB connection events
mongoose.connection.on("connected", () => {
  isDatabaseConnected = true;
});

mongoose.connection.on("disconnected", () => {
  isDatabaseConnected = false;
});
// Add these routes to your backend server
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.get('/ready', (req, res) => {
  // Add readiness checks (e.g., database connection)
  if (isDatabaseConnected) {
    res.status(200).send('OK');
  } else {
    res.status(500).send('Not Ready');
  }
});

app.get('/started', (req, res) => {
  res.status(200).send('OK');
});
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
