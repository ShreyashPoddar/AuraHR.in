"use client"

import { motion } from "framer-motion"
import { 
  Zap, 
  Clock, 
  Terminal, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  LayoutDashboard,
  Video,
  RefreshCw,
  Share2 as Github,
  Globe as Linkedin
} from "lucide-react"
import { useState } from "react"
import { enrichCandidateProfile } from "@/app/actions/sourcing-actions"

export default function CandidateDashboard() {
  const invitations = [
    { id: 1, title: "SDE-2 Coding Assessment", company: "AuraHR Core", duration: "60 mins", type: "CODING + PROCTORING", urgent: true },
    { id: 2, title: "Cultural Fit Video Round", company: "AuraHR Core", duration: "15 mins", type: "VIDEO AI", urgent: false },
  ]

  const stages = [
    { name: "Applied", date: "Apr 2", status: "complete" },
    { name: "JD Match", date: "Apr 3", status: "complete" },
    { name: "Assessment", date: "Pending", status: "active" },
    { name: "Interview", date: "-", status: "pending" },
    { name: "Offer", date: "-", status: "pending" },
  ]

  const [isSyncing, setIsSyncing] = useState(false)
  const [skills, setSkills] = useState(["Python", "React", "Node.js", "Docker"]) // Initial/Mock skills
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  const handleSync = async () => {
    setIsSyncing(true)
    setSyncStatus("AuraAI is connecting to your social profiles...")
    
    // In a real scenario, we'd get the current user's profile ID
    // For this mockup, we'll use a placeholder
    const result = await enrichCandidateProfile("current-candidate-id")
    
    if (result.success) {
      setSkills(result.enrichedData.skills)
      setSyncStatus("Profile enrichment complete!")
    } else {
      setSyncStatus("Enrichment failed. Please check your URLs.")
    }
    
    setIsSyncing(false)
    setTimeout(() => setSyncStatus(null), 5000)
  }

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Welcome, Riyan.</h1>
          <p className="text-[var(--text-muted)] text-sm uppercase tracking-widest font-bold">
            Systems Status: <span className="text-green-500 underline decoration-green-500/30">Candidate Online</span> · 2 Pending Actions
          </p>
        </div>
        <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4 border-white/10">
          <div className="text-right">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Global Rank</div>
            <div className="text-lg font-black text-white">#412 <span className="text-[10px] text-green-500">↑ 12</span></div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Aura Score</div>
            <div className="text-lg font-black text-[var(--accent-primary)]">94.8</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Active Invites */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tight">
              <Terminal className="w-5 h-5 text-[var(--accent-primary)]" />
              Active Invitations
            </h3>
          </div>

          <div className="space-y-4">
            {invitations.map((invite, idx) => (
              <motion.div 
                key={invite.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass p-8 rounded-3xl group border-l-4 transition-all hover:bg-white/[0.04] flex items-center gap-8 ${invite.urgent ? "border-[var(--accent-primary)]" : "border-white/5"}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Zap className={`w-8 h-8 ${invite.urgent ? "text-[var(--accent-primary)] animate-pulse" : "text-white/20"}`} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-2xl font-black text-white group-hover:text-[var(--accent-primary)] transition-colors">{invite.title}</div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                    <span>{invite.company}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {invite.duration}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-[var(--accent-primary)] font-black">{invite.type}</span>
                  </div>
                </div>

                <button className="premium-btn px-8 py-4 text-xs font-black rounded-2xl group flex items-center gap-2">
                  START NOW
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Progress Timeline */}
          <div className="glass p-8 rounded-3xl space-y-8 bg-white/[0.01]">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Application Pipeline</h3>
            <div className="relative flex justify-between items-start">
              {/* Connector Line */}
              <div className="absolute top-5 left-8 right-8 h-[2px] bg-white/5 z-0" />
              <div className="absolute top-5 left-8 w-1/2 h-[2px] bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] z-0" />

              {stages.map((stage, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center gap-4 text-center group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    stage.status === "complete" ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]" :
                    stage.status === "active" ? "bg-black border-[var(--accent-primary)] text-[var(--accent-primary)] animate-pulse" :
                    "bg-black border-white/10 text-white/20 hover:border-white/40"
                  }`}>
                    {stage.status === "complete" ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <div className="space-y-1">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${stage.status === "pending" ? "text-white/20" : "text-white"}`}>{stage.name}</div>
                    <div className="text-[9px] font-bold text-[var(--text-muted)] group-hover:text-white/40 transition-colors uppercase">{stage.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Intel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-3xl space-y-6 border-white/5">
            <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Proctoring Compliance
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-xs font-bold text-white uppercase italic">Session Ready</div>
                <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                  Your current environment meets all technical requirements. Microphone, Camera, and Network Latency verified.
                </p>
              </div>
              <div className="flex gap-2">
                {["MIC", "CAM", "SSL", "P2P"].map((tech) => (
                  <span key={tech} className="flex-1 px-3 py-1.5 rounded-lg bg-green-500/5 border border-green-500/20 text-[9px] font-black text-green-500 text-center uppercase tracking-tight">{tech} OK</span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl space-y-6 bg-gradient-to-br from-[var(--bg-card)] to-black/80">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-[var(--accent-secondary)] uppercase tracking-[0.2em]">Profile Enrichment</h4>
              {isSyncing && <RefreshCw className="w-3 h-3 text-[var(--accent-secondary)] animate-spin" />}
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
                  <Github className="w-5 h-5 text-white/40" />
                  <div className="text-[9px] font-bold text-white/60">GitHub</div>
                </div>
                <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
                  <Linkedin className="w-5 h-5 text-white/40" />
                  <div className="text-[9px] font-bold text-white/60">LinkedIn</div>
                </div>
              </div>
              
              {syncStatus && (
                <div className="text-[10px] font-bold text-center animate-pulse text-[var(--accent-secondary)] uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
                  {syncStatus}
                </div>
              )}

              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className={`w-full py-4 rounded-2xl border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${isSyncing ? "bg-white/5 border-white/10 text-white/20" : "bg-[var(--accent-secondary)]/10 border-[var(--accent-secondary)]/50 text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)]/20 shadow-lg shadow-[var(--accent-secondary)]/5"}`}
              >
                {isSyncing ? "ANALYZING..." : "SYNC SOCIAL PROFILES"}
                {!isSyncing && <RefreshCw className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Professional Skills Card */}
          <div className="glass p-8 rounded-3xl space-y-6 border-white/5 bg-white/[0.01]">
            <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Verified Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-white/80 uppercase tracking-tight">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="text-[9px] font-bold text-white/10 uppercase tracking-[0.3em]">
              AES-256 ENCRYPTED SESSION · SOC2 TYPE II
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
