"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  SearchCode, 
  Zap, 
  FileText, 
  ChevronRight, 
  Check, 
  X, 
  Shield, 
  Sparkles, 
  Target, 
  TrendingUp, 
  AlertTriangle 
} from "lucide-react"
import { parseJD, rankCandidates } from "@/app/actions/ai-actions"

export default function JDParserRanking() {
  const [isRanking, setIsRanking] = useState(false)
  const [jdText, setJdText] = useState("")
  const [parsedData, setParsedData] = useState<any>(null)
  const [rankings, setRankings] = useState<any[]>([])
  
  const handleRank = async () => {
    if (!jdText) return
    setIsRanking(true)
    
    try {
      // 1. Parse JD
      const jdResult = await parseJD(jdText, "mock-company-id")
      if (jdResult.error) {
        console.error(jdResult.error)
        setIsRanking(false)
        return
      }
      setParsedData(jdResult)

      // 2. Rank Candidates
      const rankingResult = await rankCandidates(jdResult)
      if (Array.isArray(rankingResult)) {
        setRankings(rankingResult)
      }
    } catch (error) {
      console.error("Analysis Failed:", error)
    } finally {
      setIsRanking(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-[0.3em]">
          // JD Parser · AI Ranking Engine
        </div>
        <h1 className="text-4xl font-extrabold text-white">Find the right fit, instantly.</h1>
        <p className="text-[var(--text-muted)]">
          Paste a job description and AuraHR's AI will rank every applicant by fit score in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input */}
        <div className="lg:col-span-5 glass p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            <FileText className="w-4 h-4" />
            Job Description Input
          </div>
          
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="w-full h-80 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-primary)] transition-all resize-none custom-scrollbar"
            placeholder="Paste the full job description here — requirements, responsibilities, qualifications..."
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Role Title</label>
              <input 
                type="text" 
                placeholder="e.g. SDE-2" 
                defaultValue={parsedData?.role || ""}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-primary)]" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Category</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-primary)]">
                <option selected={parsedData?.category === "Engineering"}>Engineering</option>
                <option selected={parsedData?.category === "Product"}>Product</option>
                <option selected={parsedData?.category === "Design"}>Design</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleRank}
            disabled={isRanking}
            className="premium-btn w-full py-4 relative group"
          >
            <span className={isRanking ? "opacity-0" : "opacity-100"}>⚡ PARSE & RANK CANDIDATES</span>
            {isRanking && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </button>
          
          <div className="text-center text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            🔍 AI WILL ANALYZE {rankings.length || "ALL"} PROFILES
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          <div className="glass p-6 rounded-2xl flex-1 flex flex-col gap-6 overflow-hidden min-h-[600px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                Ranked Results {rankings.length > 0 && `· ${rankings.length} Matches`}
              </div>
              <div className="flex gap-2">
                <button className="glass-btn px-4 py-2 text-[10px]">90%+ MATCH</button>
                <button className="glass-btn px-4 py-2 text-[10px]">EXPORT CSV</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {parsedData && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4 mb-6"
                >
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-[9px] font-black text-white/40 uppercase tracking-widest"><Target className="w-3 h-3 text-[var(--accent-primary)]" /> Must-Have</div>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.mustHave.map((s: string) => (
                        <span key={s} className="text-[10px] font-bold text-white/80 bg-white/5 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-[9px] font-black text-white/40 uppercase tracking-widest"><TrendingUp className="w-3 h-3 text-green-500" /> Future-Proof</div>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.futureProof.map((s: string) => (
                        <span key={s} className="text-[10px] font-bold text-green-500 bg-green-500/5 px-2 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {rankings.length > 0 ? (
                rankings.map((candidate: any, idx: number) => (
                  <motion.div 
                    key={candidate.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`glass p-6 rounded-2xl flex items-center gap-6 group hover:bg-white/[0.04] transition-all border-l-4 ${idx === 0 ? "border-[var(--accent-primary)]" : "border-white/5"}`}
                  >
                    <div className="text-3xl font-extrabold font-mono text-white/20 group-hover:text-[var(--accent-primary)] transition-colors">
                      #{(idx + 1).toString().padStart(2, '0')}
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[var(--text-muted)]">
                      {candidate.name?.split(" ").map((n: string) => n[0]).join("") || "CN"}
                    </div>
  
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-white truncate">{candidate.name}</div>
                      <div className="text-xs text-[var(--text-muted)] truncate mb-3">{candidate.institutionName || "External Candidate"}</div>
                      
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills?.slice(0, 3).map((skill: string, i: number) => (
                          <span key={i} className={`text-[10px] font-bold px-2 py-1 rounded border ${candidate.missingMustHave?.includes(skill) ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]"}`}>
                            {skill}
                          </span>
                        ))}
                        {candidate.skills?.length > 3 && <span className="text-[10px] text-white/20">+{candidate.skills.length - 3} more</span>}
                      </div>
                    </div>
  
                    <div className="text-center">
                      <div className={`text-3xl font-extrabold ${candidate.score > 80 ? "text-green-500" : "text-yellow-500"}`}>
                        {candidate.score}%
                      </div>
                      <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                        AI Fit Score
                      </div>
                    </div>
                    
                    <button className="p-2 text-white/20 hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4 pt-20">
                  <Sparkles className="w-12 h-12" />
                  <div className="text-xs font-bold uppercase tracking-widest">AuraAI is waiting for input...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
