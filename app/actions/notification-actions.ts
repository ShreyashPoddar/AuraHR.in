"use server"

import { Resend } from "resend"
import { prisma } from "@/lib/prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Sends an email notification to a candidate.
 */
export async function sendCandidateNotification(
  applicationId: string, 
  type: "OFFER" | "REJECTION"
) {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        candidate: true,
        job: true
      }
    })

    if (!application) throw new Error("Application not found")

    const candidateEmail = application.candidate.email
    const roleTitle = application.job.roleTitle
    const candidateName = application.candidate.name || "Candidate"

    let subject = ""
    let html = ""

    if (type === "OFFER") {
      subject = `Congratulations! Employment Offer from AuraHR for ${roleTitle}`
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h1 style="color: #6366f1;">AuraHR</h1>
          <p>Hi ${candidateName},</p>
          <p>We are thrilled to offer you the position of <strong>${roleTitle}</strong>!</p>
          <p>After a rigorous AI-driven evaluation, your profile stood out as the top fit for our team.</p>
          <p>Please log in to your dashboard to view the full offer details and sign the agreement.</p>
          <br/>
          <p>Best Regards,</p>
          <p>The AuraHR Recruiting Team</p>
        </div>
      `
    } else {
      subject = `Update regarding your application for ${roleTitle}`
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h1 style="color: #666;">AuraHR</h1>
          <p>Hi ${candidateName},</p>
          <p>Thank you for your interest in the <strong>${roleTitle}</strong> position.</p>
          <p>After careful consideration, we have decided to move forward with other candidates at this time.</p>
          <p>We appreciate the time you invested in our AI assessment process and wish you the best in your career.</p>
          <br/>
          <p>Best Regards,</p>
          <p>The AuraHR Recruiting Team</p>
        </div>
      `
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "AuraHR <onboarding@resend.dev>", // Using Resend's default test domain
      to: [candidateEmail],
      subject,
      html,
    })

    if (error) throw error

    // Update application status in DB
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status: type === "OFFER" ? "OFFER_GIVEN" : "REJECTED"
      }
    })

    return { success: true, data }
  } catch (error) {
    console.error("Email Notification Error:", error)
    return { error: "Failed to send notification." }
  }
}
