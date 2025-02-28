const { chatSession } = require("../utils/geminiAiModel");

const structure = {
  name: "string",
  contact_info: {
    email: "string",
    phone: "string",
    location: "string",
    linkedin: "string",
    portfolio: "string",
  },
  summary: "string",
  skills: {
    programming_languages: ["string"],
    frameworks_libraries: ["string"],
    tools: ["string"],
    other: ["string"],
  },
  experience: [
    {
      job_title: "string",
      company: "string",
      location: "string",
      start_date: "string",
      end_date: "string",
      responsibilities: ["string"],
    },
  ],
  education: [
    {
      degree: "string",
      institution: "string",
      location: "string",
    },
  ],
  languages: {
    English: "string",
    French: "string",
    Arabic: "string",
  },
};

const generateCV = async (req, res) => {
  try {
    const { cv, jobDescription } = req.body;

    console.log("Received CV:", cv);
    console.log("Received Job Description:", jobDescription);
    const prompt = `You are an expert resume formatter. Here is my resume: ${JSON.stringify(
      cv
    )}. Here is the job description: ${jobDescription}. Generate a JSON-formatted resume tailored to this job. Adjust experiences and responsibilities to fit the job description without removing any experience. The output should be a valid JSON object following this structure: ${JSON.stringify(
      structure
    )}. Ensure it is a structured JSON, not a string. If a field is missing in the CV, leave it empty instead of removing it.`;

    let response = await chatSession.sendMessage(prompt);
    let responseText = response.response.text?.();
    responseText = responseText.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(responseText));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateCV,
};
