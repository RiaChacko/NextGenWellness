import React from "react";
import * as OpenAI from "openai"; // Import the entire module
import Navbar from "./Navbar";
import "../pages/RecommendedActivities.css";

function RecommendedActivities() {
  // Create a configuration object using the imported module's properties
  const configuration = new OpenAI.Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAI.OpenAIApi(configuration);

  const handleOpenAIPrompt = async () => {
    const userPrompt = prompt("Enter your question for ChatGPT:");
    if (!userPrompt) return;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: userPrompt,
        max_tokens: 100,
        temperature: 0.7,
      });
      alert(response.data.choices[0].text.trim());
    } catch (error) {
      console.error("Error interacting with OpenAI:", error);
      alert("An error occurred while interacting with ChatGPT.");
    }
  };

  return (
    <div className="recommended-container">
      <Navbar />
      <h1>Recommended Activities</h1>
      <button onClick={handleOpenAIPrompt}>Ask ChatGPT</button>
    </div>
  );
}

export default RecommendedActivities;
