"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Sends an assessment invite to a candidate.
 */
export async function sendAssessmentInvite(email: string, candidateName: string, testTitle: string, link: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "AuraHR <onboarding@resend.dev>", // Replace with verified domain in production
      to: [email],
      subject: `Action Required: Assessment for ${testTitle} on AuraHR`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #7c3aed; border-radius: 10px;">
          <h2 style="color: #7c3aed;">AuraHR Portal</h2>
          <p>Hi ${candidateName},</p>
          <p>You have been invited to complete a <strong>${testTitle}</strong> assessment for your recent application.</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Test Details:</strong><br/>
            Duration: 60 mins<br/>
            Type: AI Proctored Assessment
          </div>
          <a href="${link}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">START ASSESSMENT</a>
          <p style="margin-top: 20px; color: #6b7280; font-size: 12px;">This session will be proctored using eye-tracking and audio monitoring.</p>
        </div>
      `,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Email Error:", error)
    return { error: "Failed to send invite email" }
  }
}

/**
 * Sends an interview scheduling confirmation.
 */
export async function sendInterviewConfirmation(email: string, candidateName: string, time: string, link: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "AuraHR <recruitment@resend.dev>",
      to: [email],
      subject: `Interview Scheduled: AuraHR Technical Round`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #3b82f6; border-radius: 10px;">
          <h2 style="color: #3b82f6;">AuraHR Interview Room</h2>
          <p>Hi ${candidateName},</p>
          <p>Your technical interview has been scheduled for <strong>${time}</strong>.</p>
          <p>Please use the link below to join the room at the scheduled time:</p>
          <a href="${link}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">JOIN INTERVIEW ROOM</a>
        </div>
      `,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Email Error:", error)
    return { error: "Failed to send interview email" }
  }
}
