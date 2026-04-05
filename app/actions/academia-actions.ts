"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { prisma } from "@/lib/prisma"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

/**
 * Generates 20 AI questions based on the Job Posting requirements.
 */
export async function generateAcademiaTest(jobId: string) {
  try {
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobId },
    })

    if (!job) throw new Error("Job not found")

    const prompt = `
      Create a technical assessment for the role: ${job.roleTitle}.
      Required Skills: ${job.requiredSkills.join(", ")}
      Must-have Skills: ${job.mustHaveSkills.join(", ")}

      Generate 20 unique technical questions. 
      Mix 10 Multiple Choice Questions (with 4 options) and 10 Short Answer Questions.
      
      Return ONLY a JSON array:
      [
        { 
          "id": "q1", 
          "type": "mcq", 
          "question": "...", 
          "options": ["A", "B", "C", "D"], 
          "correctAnswer": "A" 
        },
        { 
          "id": "q11", 
          "type": "short", 
          "question": "...", 
          "idealAnswer": "..." 
        }
      ]
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonStr = text.match(/\[[\s\S]*\]/)?.[0] || text
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error("Test Generation Error:", error)
    return { error: "Failed to generate test. Please try again." }
  }
}

/**
 * Evaluates a candidate's answer using Gemini.
 */
export async function evaluateAcademiaAnswer(
  applicationId: string, 
  question: string, 
  userAnswer: string, 
  idealAnswer: string
) {
  try {
    const prompt = `
      Evaluate the candidate's answer for accuracy and technical depth.
      Question: "${question}"
      Ideal Answer: "${idealAnswer}"
      Candidate Answer: "${userAnswer}"

      Provide a score from 0.0 to 5.0 and a brief justification.
      Return ONLY JSON: { "score": number, "justification": "string" }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text
    const evaluation = JSON.parse(jsonStr)

    // Update cumulative score in DB (this is a simplified additive logic)
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId }
    })

    if (application) {
      await prisma.jobApplication.update({
        where: { id: applicationId },
        data: {
          testScore: (application.testScore || 0) + evaluation.score
        }
      })
    }

    return evaluation
  } catch (error) {
    console.error("Evaluation Error:", error)
    return { error: "Failed to evaluate answer." }
  }
}
