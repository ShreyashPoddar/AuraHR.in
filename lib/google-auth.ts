import { google } from "googleapis"

/**
 * Returns a configured Google OAuth2 client.
 * Uses environment variables for Client ID and Secret.
 */
export function getGoogleAuthClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )

  // Use a refresh token if available in .env to maintain persistent access
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  if (refreshToken) {
    oauth2Client.setCredentials({ refresh_token: refreshToken })
  }

  return oauth2Client
}

/**
 * Returns the Google Calendar API instance.
 */
export function getGoogleCalendarService() {
  const auth = getGoogleAuthClient()
  return google.calendar({ version: "v3", auth })
}
