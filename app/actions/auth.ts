"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { prisma } from "@/lib/prisma"

export async function loginAction(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: formData.get("role") === "ADMIN" ? "/admin/dashboard" : "/candidate/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials."
        default:
          return "Something went wrong."
      }
    }
    throw error // Important: Re-throw error so Next.js redirect works
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as "ADMIN" | "CANDIDATE"
  const companyName = formData.get("companyName") as string | null

  // Basic validation
  if (!email || !password || !name) {
    return "Please fill in all required fields."
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters."
  }
  if (role === "ADMIN" && !companyName) {
    return "Company name is required for company accounts."
  }

  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return "An account with this email already exists."
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password, // plain text for now (same as current auth.ts)
        name,
        role,
      },
    })

    // If company (admin), also create an AdminProfile
    if (role === "ADMIN" && companyName) {
      await prisma.adminProfile.create({
        data: {
          userId: user.id,
          companyName,
        },
      })
    }

    // If candidate, also create a CandidateProfile
    if (role === "CANDIDATE") {
      await prisma.candidateProfile.create({
        data: {
          userId: user.id,
          email,
          name,
        },
      })
    }

    // Auto sign-in after signup
    await signIn("credentials", {
      email,
      password,
      redirectTo: role === "ADMIN" ? "/admin/dashboard" : "/candidate/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return "Account created but sign-in failed. Please log in."
    }
    // Re-throw redirect errors
    throw error
  }
}

