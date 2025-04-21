
import { GoogleGenAI } from "@google/genai";



const ai = new GoogleGenAI({ apiKey: "AIzaSyBMcUZ4XEdRtXId7Quj-YMRDXd2HcwOg5U" });

async function runChat(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt+`write in short and not too lengthy
`,
  });
  console.log(response.text);
  return response.text;
}

export default runChat;