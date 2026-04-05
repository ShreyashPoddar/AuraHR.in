"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract"
import { prisma } from "@/lib/prisma"

const textractClient = new TextractClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

/**
 * Parses a Job Description into structured data using Gemini.
 * Identifies must-have, good-to-have, future-proof, and employee-gap skills.
 */
export async function parseJD(jdText: string, companyId?: string) {
  try {
    // 1. Fetch current employee skills to identify gaps (if companyId provided)
    let employeeSkills: string[] = []
    if (companyId) {
      const employees = await prisma.employeeData.findMany({
        where: { companyId },
        select: { skills: true }
      })
      employeeSkills = Array.from(new Set(employees.flatMap((e: any) => e.skills)))
    }

    const prompt = `
      Analyze the following Job Description and current employee skills:
      
      JOB DESCRIPTION:
      "${jdText}"

      CURRENT EMPLOYEE SKILLS:
      "${employeeSkills.join(", ")}"

      Return ONLY a JSON object with this shape:
      {
        "role": "Job Title",
        "category": "Engineering | Data | Product | Design",
        "skills": {
          "mustHave": ["Skill 1", "Skill 2"],
          "goodToHave": ["Skill 3", "Skill 4"],
          "futureProof": ["Emerging Tech 1"],
          "employeeGap": ["Skills present in JD but missing from current employees"]
        },
        "experience": "Years of experience required",
        "summary": "1-sentence summary of the role"
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error("JD Parsing Error:", error)
    return { error: "Failed to parse Job Description" }
  }
}

/**
 * Ranks candidates against a parsed JD based on a weighted scoring system.
 * Weighted Scoring:
 * - Must-have: 60%
 * - Good-to-have: 20%
 * - Future-proof/Gap-filling (Bonus): 20%
 */
export async function rankCandidates(jdData: any) {
  try {
    const candidates = await prisma.candidateProfile.findMany({
      include: {
        user: true,
      },
    })

    if (candidates.length === 0) return []

    const prompt = `
      Job Description:
      Role: ${jdData.role}
      Must-Have Skills: ${jdData.skills.mustHave.join(", ")}
      Good-To-Have Skills: ${jdData.skills.goodToHave.join(", ")}
      Future-Proof/Gap Skills: ${[...jdData.skills.futureProof, ...jdData.skills.employeeGap].join(", ")}

      Rank the candidates (0-100%). Weigh Must-have heavily (60%). 
      Return ONLY a JSON array of objects.
      
      Candidate Data:
      ${candidates.map((c: any) => `ID: ${c.id}, Name: ${c.name}, Skills: ${c.skills?.join(", ") || "None"}`).join("\n")}

      Return Shape:
      [
        { "candidateId": "string", "score": number, "matchAnalysis": "Short analysis highlighting why they fit.", "missingMustHave": ["Skill 1"] }
      ]
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonStr = text.match(/\[[\s\S]*\]/)?.[0] || text
    const rankings = JSON.parse(jsonStr)

    const rankedResults = rankings.map((r: any) => {
      const candidate = candidates.find((c: any) => c.id === r.candidateId)
      return {
        ...candidate,
        score: r.score,
        matchAnalysis: r.matchAnalysis,
        missingMustHave: r.missingMustHave || []
      }
    })

    return rankedResults.sort((a: any, b: any) => b.score - a.score)
  } catch (error) {
    console.error("Ranking Error:", error)
    return { error: "Failed to rank candidates" }
  }
}

/**
 * Processes a resume using AWS Textract (OCR) and Gemini (Structuring).
 */
export async function processResume(fileBuffer: Buffer) {
  try {
    // 1. OCR with Textract
    const command = new DetectDocumentTextCommand({
      Document: { Bytes: fileBuffer },
    })
    const { Blocks } = await textractClient.send(command)
    const rawText = Blocks?.filter(b => b.BlockType === "LINE").map(b => b.Text).join("\n") || ""

    // 2. Structuring with Gemini
    const prompt = `
      Extract candidate details from the following OCR text:
      "${rawText}"

      Return ONLY a JSON object with this shape:
      {
        "name": "Full Name",
        "email": "Email",
        "phone": "Phone",
        "university": "University Name",
        "degree": "Degree",
        "major": "Major",
        "graduationYear": number,
        "cgpa": "CGPA",
        "skills": ["Skill 1", "Skill 2"],
        "experienceDetails": "Summary of work experience",
        "projects": ["Project 1", "Project 2"],
        "city": "Current City"
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text
    return JSON.parse(jsonStr)
  } catch (error) {
    console.error("OCR/Structuring Error:", error)
    return { error: "Failed to process resume" }
  }
}
