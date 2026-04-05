"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

/**
 * Analyzes a partial transcript from an interview in real-time.
 */
export async function analyzeLiveSpeech(transcript: string, role: string) {
  try {
    const prompt = `
      You are an AI Interview Co-pilot. Analyze this live transcript part for a ${role} position:
      "${transcript}"

      Return a short JSON object:
      {
        "insight": "1-sentence feedback on the answer so far",
        "score": number (0-10),
        "flag": "positive" | "warning" | "neutral",
        "followUp": "Suggested follow-up question if needed"
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error("Speech Analysis Error:", error)
    return { insight: "Analysis temporarily unavailable", score: 5, flag: "neutral" }
  }
}
