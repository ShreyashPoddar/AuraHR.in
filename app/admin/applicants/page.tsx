"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Filter, 
  Settings, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal, 
  ChevronDown, 
  ExternalLink,
  Mail,
  ArrowRight
} from "lucide-react"

export default function ApplicantsPage() {
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const applicants = [
    {
      id: 928,
      name: "Riyan Kothari",
      linkedin: "/in/riyankothari",
      email: "riyan.kothari@gmail.com",
      phone: "+91 9876543210",
      university: "IIT Bombay",
      degree: "B.Tech",
      major: "Computer Science",
      cgpa: "9.4",
      gradYear: 2025,
      city: "Mumbai",
      prefCities: ["SF", "NYC"],
      workMode: "Hybrid",
      role: "Senior SDE",
      stage: "INTERVIEW",
      score: 98,
      skills: ["React", "Node"],
      ocrStatus: "412 ENTITIES",
      appliedDate: "Apr 4, 2026",
      lastActivity: "2h ago"
    },
    {
      id: 821,
      name: "Arjun Patel",
      linkedin: "/in/arjun-codes",
      email: "arjun@test.com",
      phone: "+91 9998887776",
      university: "BITS Pilani",
      degree: "M.Sc.",
      major: "Mathematics",
      cgpa: "7.8",
      gradYear: 2024,
      city: "Goa",
      prefCities: ["Remote"],
      workMode: "Remote",
      role: "Quant Research",
      stage: "ASSESSMENT",
      score: 82,
      skills: ["Python", "C++"],
      ocrStatus: "118 ENTITIES",
      appliedDate: "Apr 3, 2026",
      lastActivity: "5h ago"
    }
  ]

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white">Applicant Database</h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Synced 2 min ago · OCR Active
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="Search database..."
              className="bg-white/5 border border-white/10 rounded-xl px-10 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)] w-64"
            />
          </div>
          <button className="glass-btn px-4 py-2 text-xs flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass rounded-2xl flex-1 flex flex-col overflow-hidden border border-white/5">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            847 Candidates Matched
          </div>
          <button className="p-2 text-[var(--text-muted)] hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <table className="w-full text-left border-collapse min-w-[1500px]">
            <thead className="sticky top-0 bg-[#121212] z-20 border-b border-white/10">
              <tr className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                <th className="px-6 py-4 w-12"><input type="checkbox" className="accent-[var(--accent-primary)]" /></th>
                <th className="px-4 py-4 w-20">#</th>
                <th className="px-4 py-4 min-w-[200px]">Candidate</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">University</th>
                <th className="px-4 py-4">CGPA</th>
                <th className="px-4 py-4">Stage</th>
                <th className="px-4 py-4">AI Score</th>
                <th className="px-4 py-4">Skills</th>
                <th className="px-4 py-4">Resume</th>
                <th className="px-4 py-4">OCR Status</th>
                <th className="px-4 py-4">Applied</th>
                <th className="px-4 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {applicants.map((candidate) => (
                <AnimatePresence key={candidate.id}>
                  {/* Row */}
                  <tr 
                    onClick={() => toggleRow(candidate.id)}
                    className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer ${expandedRows.includes(candidate.id) ? "bg-white/[0.03]" : ""}`}
                  >
                    <td className="px-6 py-5"><input type="checkbox" className="accent-[var(--accent-primary)]" onClick={(e) => e.stopPropagation()} /></td>
                    <td className="px-4 py-5 font-mono text-[var(--accent-primary)]">#A{candidate.id}</td>
                    <td className="px-4 py-5">
                      <div className="font-bold text-white">{candidate.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{candidate.linkedin}</div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="flex items-center gap-1.5">
                        {candidate.email}
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                      </div>
                    </td>
                    <td className="px-4 py-5">{candidate.university}</td>
                    <td className="px-4 py-5 font-bold">{candidate.cgpa}</td>
                    <td className="px-4 py-5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${candidate.stage === "INTERVIEW" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"}`}>
                        {candidate.stage}
                      </span>
                    </td>
                    <td className="px-4 py-5 font-extrabold text-[var(--accent-primary)]">{candidate.score}%</td>
                    <td className="px-4 py-5">
                      <div className="flex gap-1">
                        {candidate.skills.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-medium">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <button className="glass-btn px-2 py-1 text-[9px] flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        VIEW PDF
                      </button>
                    </td>
                    <td className="px-4 py-5 text-[10px] font-mono text-green-500">{candidate.ocrStatus}</td>
                    <td className="px-4 py-5 text-[10px] text-[var(--text-muted)] truncate">{candidate.appliedDate}</td>
                    <td className="px-4 py-5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedApplicant(candidate); }}
                        className="p-1 hover:text-[var(--accent-primary)] transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Content */}
                  {expandedRows.includes(candidate.id) && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/[0.01]"
                    >
                      <td colSpan={13} className="px-12 py-8">
                        <div className="grid grid-cols-4 gap-8">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Resume & OCR Extraction</h4>
                            <div className="glass p-4 rounded-xl border-white/5 space-y-3">
                              <div className="text-xs font-bold text-green-500 flex items-center gap-2 uppercase tracking-tight">
                                <CheckCircle2 className="w-3 h-3" />
                                {candidate.ocrStatus} Handled
                              </div>
                              <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                                <strong>Education:</strong> {candidate.university}, {candidate.degree} {candidate.major}<br/>
                                <strong>Last Activity:</strong> {candidate.lastActivity}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">AI Ranking Breakdown - {candidate.score}%</h4>
                            <div className="space-y-4">
                              {[
                                { label: "Technical Match", p: 99, c: "bg-green-500" },
                                { label: "Experience Depth", p: 95, c: "bg-[var(--accent-primary)]" },
                                { label: "Cultural Indicators", p: 92, c: "bg-blue-500" },
                              ].map((bar, i) => (
                                <div key={i} className="space-y-1.5">
                                  <div className="flex justify-between text-[10px] font-medium">
                                    <span>{bar.label}</span>
                                    <span>{bar.p}%</span>
                                  </div>
                                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full ${bar.c}`} style={{ width: `${bar.p}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Recent Assessments</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border-l-2 border-[var(--accent-primary)]">
                                <div>
                                  <div className="text-[11px] font-bold">Coding Test</div>
                                  <div className="text-[9px] text-[var(--text-muted)]">HackerRank API</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xs font-bold text-green-500">98/100</div>
                                  <div className="text-[9px] text-[var(--text-muted)]">42 mins</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 justify-center">
                            <button 
                              onClick={() => setSelectedApplicant(candidate)}
                              className="premium-btn py-3 text-[11px]"
                            >
                              VIEW FULL PROFILE →
                            </button>
                            <button className="glass-btn py-3 text-[11px]">SCHEDULE INTERVIEW</button>
                            <button className="glass-btn py-3 text-[11px] border-red-500/20 text-red-500 hover:bg-red-500/5 hover:border-red-500/50">REJECT</button>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Slider (Right Drawer) */}
      <AnimatePresence>
        {selectedApplicant && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApplicant(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[500px] bg-[#121212] border-l border-white/5 z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">{selectedApplicant.name}</h2>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                    {selectedApplicant.role} · {selectedApplicant.university}
                  </div>
                </div>
                <button onClick={() => setSelectedApplicant(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <XCircle className="w-6 h-6 text-white/20" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Contact & Preferences</h4>
                  <div className="grid grid-cols-2 gap-6 text-sm text-[var(--text-main)]">
                    <div>
                      <div className="text-[10px] text-[var(--text-muted)] mb-1">EMAIL</div>
                      {selectedApplicant.email}
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--text-muted)] mb-1">PHONE</div>
                      {selectedApplicant.phone}
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--text-muted)] mb-1">LOCATION</div>
                      {selectedApplicant.city}
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--text-muted)] mb-1">RELOCATION</div>
                      <span className="text-green-500 font-bold uppercase text-[10px]">Yes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Aura AI Gap Analysis</h4>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed glass p-4 rounded-xl">
                    Candidate meets {selectedApplicant.score}% of required technical criteria. Minor gap detected in strictly statically typed languages (Java/C#), but vast experience in dynamic languages and modern frameworks completely overrides this for the current team composition.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">OCR Extracted Skills (Automated)</h4>
                  <div className="flex flex-wrap gap-2">
                    {["React", "NextJS", "NodeJS", "PostgreSQL", "Redis", "Docker", "AWS", "Kubernetes", "Python"].map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                <button className="glass-btn px-6 py-3 text-xs border-red-500/20 text-red-500">REJECT</button>
                <div className="flex items-center gap-3">
                  <button className="glass-btn px-6 py-3 text-xs flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    MESSAGE
                  </button>
                  <button className="premium-btn px-6 py-3 text-xs">MOVE TO NEXT STAGE</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
