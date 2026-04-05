import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import * as fs from "fs"
import * as path from "path"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  // Step 1: No code? Redirect to Google consent screen
  if (!code) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
    })
    return NextResponse.redirect(authUrl)
  }

  // Step 2: We have a code — exchange it for tokens
  try {
    const { tokens } = await oauth2Client.getToken(code)
    const refreshToken = tokens.refresh_token

    if (refreshToken) {
      // Append to .env file
      const envPath = path.resolve(process.cwd(), ".env")
      const envContent = fs.readFileSync(envPath, "utf-8")

      if (!envContent.includes("GOOGLE_REFRESH_TOKEN")) {
        fs.appendFileSync(envPath, `\nGOOGLE_REFRESH_TOKEN="${refreshToken}"\n`)
      }

      return new NextResponse(
        `<html><body style="background:#0a0a0f;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:20px">
          <h1 style="color:#6366f1">✅ Google Calendar Connected!</h1>
          <p>Refresh token has been saved to your <code>.env</code> file.</p>
          <p style="opacity:0.5;font-size:12px">You can close this tab and restart your dev server.</p>
        </body></html>`,
        { headers: { "Content-Type": "text/html" } }
      )
    } else {
      return new NextResponse(
        `<html><body style="background:#0a0a0f;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh">
          <h1 style="color:red">⚠️ No refresh token received. Try deleting AuraHR from your Google account permissions and retry.</h1>
        </body></html>`,
        { headers: { "Content-Type": "text/html" } }
      )
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
