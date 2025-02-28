const Interview = require("../models/interviews");
const { chatSession } = require("../utils/geminiAiModel");
const User = require("../models/User");
const UserAnswer = require("../models/userAnswers");
const postToGemini = async (req, res) => {
  try {
    const { job, description, yearsOfExperience, user } = req.body;

    if (!job || !description || !yearsOfExperience) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const InputPrompt = `Job position: ${job}, Job Description: ${description}, Years of experience: ${yearsOfExperience}. Based on this, provide 5 interview questions with answers in JSON format. Ensure the response contains 'question' and 'answer' fields.`;

    const result = await chatSession.sendMessage(InputPrompt);

    // Parse the JSON response correctly
    const MockJsonResp = JSON.parse(
      result.response
        .text()
        .replace(/```json|```/g, "")
        .trim()
    );

    // Save interview in the database
    const newInterview = new Interview({
      job,
      description,
      yearsOfExperience,
      user,
      createdBy: foundUser.email, // Store email instead of ObjectId
      questions: MockJsonResp, // Ensure this is stored as JSON
    });

    await newInterview.save();

    res.status(201).json({
      message: "Interview saved successfully",
      interview: newInterview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error posting to Gemini API",
      error: error.message,
    });
  }
};

// New function to save feedback using req_text
const saveFeedback = async (req, res) => {
  try {
    // For this example, we expect the following fields.
    // Adjust as needed for your application.
    const {
      interviewId, // the prompt for Gemini AI
      question, // (optional) the interview question
      correctAns, // (optional) the correct answer (if applicable)
      userAns, // (optional) the user's answer
      userEmail, // (optional) email of the user giving the answer
    } = req.body;

    if (!interviewId || !question || !correctAns) {
      return res
        .status(400)
        .json({ message: "interviewId ,question, correctAns are required" });
    }

    // (Optional) Validate that the referenced Interview exists.
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    const InputPrompt = `{
      "question": "${question || ""}",
      "userAnswer": "${userAns || ""}",
      "instruction": "Provide a JSON response with two fields: 'rating' (number from 1-10) and 'feedback' (string with 3-5 lines of suggestions)."
    }`;

    // Send the feedback prompt to Gemini AI to get rating and feedback in JSON
    const result = await chatSession.sendMessage(InputPrompt);
    const rawText = result.response.text();

    // Parse the response, expecting JSON with "rating" and "feedback" fields.
    const parsedResponse = JSON.parse(
      rawText.replace(/```json|```/g, "").trim()
    );
    const { rating, feedback } = parsedResponse;

    // Create a new UserAnswer document with the provided and parsed information.
    const newUserAnswer = new UserAnswer({
      interviewId,
      question: question,
      correctAns: correctAns,
      userAns: userAns,
      rating,
      feedback,
      userEmail: userEmail,
    });

    await newUserAnswer.save();

    res.status(200).json({
      message: "Feedback saved successfully",
      userAnswer: newUserAnswer,
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({
      message: "Error saving feedback",
      error: error.message,
    });
  }
};
const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving interview",
      error: error.message,
    });
  }
};

const getUserAnswersByInterviewId = async (req, res) => {
  try {
    // Assume the interviewId is passed as a URL parameter, e.g., /api/answers/:interviewId
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({ message: "interviewId is required" });
    }
    // Retrieve all user answers for the specified interview.
    const userAnswers = await UserAnswer.find({ interviewId });

    res.status(200).json({
      message: "User answers fetched successfully",
      userAnswers,
    });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    res.status(500).json({
      message: "Error fetching user answers",
      error: error.message,
    });
  }
};

const getInterviewsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const interviews = await Interview.find({ user: userId });

    res.status(200).json({
      message: "Interviews fetched successfully",
      interviews,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({
      message: "Error fetching interviews",
      error: error.message,
    });
  }
};

module.exports = {
  postToGemini,
  getInterviewById,
  saveFeedback,
  getUserAnswersByInterviewId,
  getInterviewsByUserId,
};
