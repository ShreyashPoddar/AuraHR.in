"use server"

import { prisma } from "@/lib/prisma"
import { ApplicationStatus } from "@prisma/client"

/**
 * Records a proctoring violation for a specific job application.
 * If violations exceed 10, the candidate is automatically disqualified.
 */
export async function recordViolation(applicationId: string, reason: string) {
  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      select: { proctoringViolations: true, status: true }
    })

    if (!application) return { error: "Application not found" }

    const newViolationsCount = application.proctoringViolations + 1
    let newStatus = application.status

    if (newViolationsCount > 10) {
      newStatus = ApplicationStatus.DISQUALIFIED_CHEATING
    }

    const updatedApplication = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        proctoringViolations: newViolationsCount,
        status: newStatus
      }
    })

    console.log(`Violation recorded for ${applicationId}: ${reason} (Total: ${newViolationsCount})`)
    
    return { 
      success: true, 
      violations: newViolationsCount, 
      status: newStatus 
    }
  } catch (error) {
    console.error("Failed to record violation:", error)
    return { error: "Database error" }
  }
}
