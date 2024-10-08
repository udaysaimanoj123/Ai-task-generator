import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
//app
const app = express();
const genAI = new GoogleGenerativeAI("AIzaSyDGUFRJGLtCUs0A8xNlvfsm3uKuvdu02rQ"); // Make sure this is securely stored and handled.
//cross -origin
//Browsers enforce the same-origin policy, which restricts how resources on a web page can interact with resources from another origin. If your frontend is hosted on a different domain or port than your backend, the browser will block the requests unless CORS is properly configured on the server.
app.use(cors());
//he cors middleware allows your server to accept requests from different origins, ensuring smooth communication between your frontend and backend.
app.use(express.json());

app.post("/generate-tasks", async (req, res) => {
    const description = req.body.description;
    const prompt = `
Based on the following project description, generate a list of tasks. 
Each task should be a simple, concise point . 
Do not include any extra information, headings, or explanations. 
Only output the tasks as bullet points.

Project Description: ${description}
`;
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const tasks = response.text().split("\n").filter(Boolean);
    res.json({ tasks });
  } catch (error) {
    console.error("Error generating tasks:", error);
    res.status(500).send("Failed to generate tasks");
  }
});

app.listen(3000, () => {
  console.log("App started on port 3000...");
});
