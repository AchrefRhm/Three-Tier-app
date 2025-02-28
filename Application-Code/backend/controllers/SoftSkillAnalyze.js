const { chatSession } = require("../utils/geminiAiModel");

const analyzeData = async (req, res) => {
  try {
    const { transcription, poseData } = req.body;

    const prompt = `
      You are an expert in speech and body language analysis.
      Analyze the following speech transcription and body posture data:
      
      **Speech Transcription:**
      "${transcription}"
      
      **Body Posture Data:**
      ${JSON.stringify(poseData, null, 2)}
      
      Provide an analysis of the speaker's emotions, confidence level, and any inconsistencies between speech and body language.
      Suggest improvements if needed ,give me in json format.
    `;
    let response = await chatSession.sendMessage(prompt);
    let responseText = response.response.text?.();
    responseText = responseText.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Error sending data to Gemini API:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = {
  analyzeData,
};
