"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Zap, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { loginAction, signupAction } from "@/app/actions/auth"
import { useActionState } from "react"

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [userType, setUserType] = useState<"candidate" | "company">("candidate")
  const [showPassword, setShowPassword] = useState(false)

  const [loginError, loginFormAction, isLoginPending] = useActionState(loginAction, undefined)
  const [signupError, signupFormAction, isSignupPending] = useActionState(signupAction, undefined)

  const error = authMode === "login" ? loginError : signupError
  const action = authMode === "login" ? loginFormAction : signupFormAction
  const isPending = authMode === "login" ? isLoginPending : isSignupPending

  const reviews = [
    {
      name: "Priya R.",
      role: "Head of Talent · GlobalTech",
      quote: "AuraAI reduced our executive screening time by 80%. The Agentic AI is frighteningly precise.",
      monogram: "PR",
    },
    {
      name: "James T.",
      role: "Senior Recruiter · FinCorp",
      quote: "We went from 2,000 applicants to a verified shortlist of 12 in 48 hours. Unreal efficiency.",
      monogram: "JT",
    },
  ]

  const [activeReview, setActiveReview] = useState(0)

  return (
    <div className="flex min-h-screen bg-[#121212] overflow-hidden">
      {/* Left Panel: Brand & Social Proof */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--accent-glow),transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,var(--accent-blue-glow),transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        
        <div className="relative z-10 max-w-xl w-full flex flex-col gap-12">
          {/* Logo */}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tighter text-white">AURA</span>
            <span className="text-3xl font-extrabold tracking-tighter text-[var(--accent-primary)]">HR</span>
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-extrabold leading-[1.1] tracking-tight"
            >
              The future of <br />
              <span className="text-white">enterprise hiring</span> <br />
              <span className="italic text-[var(--accent-primary)]">is already here.</span>
            </motion.h1>
            <p className="text-lg text-[var(--text-muted)] max-w-md">
              Thousands of organizations trust AuraAI to find, verify, and onboard elite talent using secure agentic intelligence.
            </p>
          </div>

          {/* Stat Pills */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <Zap className="w-4 h-4 text-yellow-400" />, text: "72hr avg. shortlist" },
              { icon: <Shield className="w-4 h-4 text-blue-400" />, text: "SOC 2 Compliant" },
              { icon: <CheckCircle2 className="w-4 h-4 text-green-400" />, text: "10,000+ hires made" },
            ].map((pill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
              >
                {pill.icon}
                <span>{pill.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Review Carousel */}
          <div className="glass p-6 rounded-2xl space-y-4 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-bold text-sm">
                {reviews[activeReview].monogram}
              </div>
              <div>
                <div className="font-bold text-white">{reviews[activeReview].name}</div>
                <div className="text-xs text-[var(--text-muted)]">{reviews[activeReview].role}</div>
              </div>
              <div className="ml-auto text-yellow-500 text-sm">★★★★★</div>
            </div>
            <p className="text-[var(--text-main)] italic">
              "{reviews[activeReview].quote}"
            </p>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mt-12">
            🔒 SOC 2 · 256-bit encryption · GDPR compliant
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-blue-glow)] blur-[120px] opacity-30" />
        
        <div className="w-full max-w-md space-y-8 relative z-10 py-8">
          {/* Auth Toggles */}
          <div className="space-y-6">
            <div className="flex p-1 bg-white/5 rounded-full border border-white/10 w-fit mx-auto lg:mx-0">
              <button 
                onClick={() => setAuthMode("login")}
                className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${authMode === "login" ? "bg-[var(--accent-primary)] text-white" : "text-[var(--text-muted)] hover:text-white"}`}
              >
                Log In
              </button>
              <button 
                onClick={() => setAuthMode("signup")}
                className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${authMode === "signup" ? "bg-[var(--accent-primary)] text-white" : "text-[var(--text-muted)] hover:text-white"}`}
              >
                Sign Up
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] text-center lg:text-left">
                {authMode === "login" ? "SIGN IN AS" : "SIGN UP AS"}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setUserType("candidate")}
                  className={`flex-1 py-3 rounded-xl border transition-all text-sm font-bold ${userType === "candidate" ? "bg-white/10 border-[var(--accent-primary)] text-white" : "bg-transparent border-white/10 text-[var(--text-muted)] hover:border-white/20"}`}
                >
                  Candidate
                </button>
                <button 
                  onClick={() => setUserType("company")}
                  className={`flex-1 py-3 rounded-xl border transition-all text-sm font-bold ${userType === "company" ? "bg-white/10 border-[var(--accent-primary)] text-white" : "bg-transparent border-white/10 text-[var(--text-muted)] hover:border-white/20"}`}
                >
                  Company
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-white">
                {authMode === "login" ? "Welcome back." : "Get started."}
              </h2>
              <p className="text-[var(--text-muted)]">
                {authMode === "login" ? "Sign in to your AuraHR account" : "Create your AuraHR credentials"}
              </p>
            </div>

            <form action={action} className="space-y-4">
              <input type="hidden" name="role" value={userType === "candidate" ? "CANDIDATE" : "ADMIN"} />
              
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Full Name — signup only */}
              {authMode === "signup" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={userType === "candidate" ? "Your full name" : "Your name"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                    required
                  />
                </div>
              )}

              {/* Company Name — signup + company only */}
              {authMode === "signup" && userType === "company" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Acme Corp"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                  {userType === "candidate" ? "University Email" : "Work Email"}
                </label>
                <input 
                  type="email" 
                  name="email"
                  placeholder={userType === "candidate" ? "name@university.edu" : "name@company.com"}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-primary)] transition-all"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {authMode === "signup" && (
                  <p className="text-[10px] text-[var(--text-muted)]">Must be at least 6 characters.</p>
                )}
              </div>

              {authMode === "login" && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs text-[var(--accent-primary)] font-bold hover:brightness-110 transition-all">
                    Forgot password?
                  </a>
                </div>
              )}

              <button type="submit" disabled={isPending} className="premium-btn w-full py-4 mt-2 disabled:opacity-50">
                {isPending
                  ? authMode === "login" ? "SIGNING IN..." : "CREATING ACCOUNT..."
                  : authMode === "login" ? "SIGN IN" : "CREATE ACCOUNT"
                }
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-[#121212] px-4 text-[var(--text-muted)]">— or continue with —</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button className="glass-btn flex items-center justify-center gap-3 py-3.5">
                <img src="/google-icon.svg" className="w-4 h-4" alt="" />
                <span>Google {userType === "company" ? "Workspace" : ""}</span>
              </button>
            </div>

            <p className="text-center text-sm text-[var(--text-muted)]">
              {authMode === "login" ? (
                <>Don't have an account? <button onClick={() => setAuthMode("signup")} className="text-[var(--accent-primary)] font-bold hover:underline">Get started free →</button></>
              ) : (
                <>Already have an account? <button onClick={() => setAuthMode("login")} className="text-[var(--accent-primary)] font-bold hover:underline">Sign in instead</button></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
