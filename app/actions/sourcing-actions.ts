"use server"

import puppeteer from "puppeteer"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { prisma } from "@/lib/prisma"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

/**
 * Enriches a candidate's profile by scraping their social media URLs.
 */
export async function enrichCandidateProfile(candidateId: string) {
  let browser;
  try {
    const candidate = await prisma.candidateProfile.findUnique({
      where: { id: candidateId },
    })

    if (!candidate) throw new Error("Candidate not found")

    const { githubUrl, linkedinUrl } = candidate
    let scrapedData = ""

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    // 1. Scrape GitHub if available
    if (githubUrl) {
      console.log(`Scraping GitHub: ${githubUrl}`)
      await page.goto(githubUrl, { waitUntil: "networkidle2", timeout: 30000 })
      // Extract main bio, pinned repositories, and contribution summary
      const githubContent = await page.evaluate(() => {
        const bio = document.querySelector('.p-note.user-profile-bio')?.textContent || ""
        const repos = Array.from(document.querySelectorAll('.pinned-item-list-item-content'))
          .map(el => el.textContent?.trim())
          .join("\n")
        return `GitHub Bio: ${bio}\nRepositories:\n${repos}`
      })
      scrapedData += `--- GITHUB DATA ---\n${githubContent}\n\n`
    }

    // 2. Scrape LinkedIn (Simple text extraction of public profile)
    if (linkedinUrl) {
      console.log(`Scraping LinkedIn: ${linkedinUrl}`)
      // Note: LinkedIn has aggressive anti-scraping. This is a best-effort public extraction.
      await page.goto(linkedinUrl, { waitUntil: "networkidle2", timeout: 30000 })
      const linkedinContent = await page.evaluate(() => {
        return document.body.innerText.substring(0, 5000) // Get top 5000 chars of visible text
      })
      scrapedData += `--- LINKEDIN DATA ---\n${linkedinContent}\n\n`
    }

    if (!scrapedData) return { error: "No social URLs provided to sync." }

    // 3. AI Analysis with Gemini
    const prompt = `
      You are a specialized HR Data Agent. Analyze the following raw scraped data from a candidate's social profiles (GitHub/LinkedIn):
      
      "${scrapedData}"

      Extract the following information and return ONLY a JSON object:
      {
        "skills": ["Skill 1", "Skill 2"],
        "projects": [
          { "name": "Project Name", "description": "Short description", "technologies": ["Tech 1"] }
        ],
        "summary": "Professional summary based on profiles",
        "institutionName": "Extracted university if found",
        "email": "Extracted email if found"
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from potential AI markdown
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text
    const enrichedData = JSON.parse(jsonStr)

    // 4. Update Database
    const updatedCandidate = await prisma.candidateProfile.update({
      where: { id: candidateId },
      data: {
        skills: [...new Set([...(candidate.skills || []), ...(enrichedData.skills || [])])],
        institutionName: enrichedData.institutionName || candidate.institutionName,
        // We can add more fields if we update the schema later, 
        // for now we'll stick to the existing schema.
      }
    })

    return { 
      success: true, 
      enrichedData,
      updatedCandidate 
    }
  } catch (error) {
    console.error("Enrichment Error:", error)
    return { error: "Failed to sync profiles. Please check your URLs." }
  } finally {
    if (browser) await browser.close()
  }
}
