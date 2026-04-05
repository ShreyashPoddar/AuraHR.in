"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  GraduationCap, 
  Plus, 
  Monitor, 
  BarChart3, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  Code2,
  ListTodo,
  Video,
  FileText
} from "lucide-react"

export default function AcademiaPage() {
  const [activeTab, setActiveTab] = useState<"mcq" | "coding" | "video">("coding")
  const [showResults, setShowResults] = useState(false)

  const activeAssessments = [
    {
      id: 1,
      title: "Goldman Sachs Quant Round 1",
      candidates: 12,
      started: 8,
      avgScore: 82,
      violations: 1,
      remaining: "1H 45M",
      status: "Active"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-[0.3em]">
          // Academia · Test Control Center
        </div>
        <h1 className="text-3xl font-extrabold text-white">Deploy intelligence tests. Track performance.</h1>
        <p className="text-[var(--text-muted)] text-sm">
          Select candidates, configure test parameters, and monitor live proctoring feeds from a single terminal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Generator */}
        <div className="lg:col-span-4 glass p-6 rounded-2xl space-y-8 h-fit">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            <Plus className="w-4 h-4" />
            Generate New Assessment
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] text-[var(--text-muted)]">Step 1 — Select Candidates</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)] transition-all">
                <option>Select Pipeline Stage: Assessment Pending</option>
                <option>All Applied</option>
                <option>Custom Selection...</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] text-[var(--text-muted)]">Step 2 — Configure Test Modes</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "mcq", label: "MCQ", icon: <ListTodo className="w-3 h-3" /> },
                  { id: "coding", label: "Coding", icon: <Code2 className="w-3 h-3" /> },
                  { id: "video", label: "Video", icon: <Video className="w-3 h-3" /> },
                  { id: "text", label: "Short Answer", icon: <FileText className="w-3 h-3" /> },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveTab(mode.id as any)}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 transition-all border ${activeTab === mode.id ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-glow)]" : "bg-white/5 border-white/10 text-[var(--text-muted)] hover:border-white/30"}`}
                  >
                    {mode.icon}
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="glass p-4 rounded-xl border-white/5 bg-white/[0.02] min-h-[100px] flex items-center justify-center text-center">
                <AnimatePresence mode="wait">
                  {activeTab === "coding" && (
                    <motion.div 
                      key="coding"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 w-full"
                    >
                      <select className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs">
                        <option>Data Structures & Algorithms</option>
                        <option>System Design (Logic)</option>
                        <option>Frontend Challenges</option>
                      </select>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">⚡ AI will generate 3 Tier-1 problems</div>
                    </motion.div>
                  )}
                  {activeTab === "video" && (
                    <motion.div 
                      key="video"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full"
                    >
                      <input 
                        type="text" 
                        placeholder="Video Prompt (e.g. 'Describe a robust system you built')" 
                        className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button className="premium-btn w-full py-4 text-xs font-bold">
              ⚡ GENERATE & DEPLOY TEST
            </button>

            <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
              <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-2">
                <span className="text-green-500 font-bold tracking-widest">{">"}</span>
                System idle. Ready for deployment.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Monitor */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl flex-1 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[var(--accent-primary)]" />
                Active Assessments Monitor
              </h3>
              <div className="flex p-1 bg-white/5 rounded-full border border-white/10">
                <button className="px-4 py-1 rounded-full text-[10px] font-bold bg-[var(--accent-primary)] text-white">Active</button>
                <button className="px-4 py-1 rounded-full text-[10px] font-bold text-[var(--text-muted)] hover:text-white transition-all">Completed</button>
              </div>
            </div>

            <div className="space-y-4">
              {activeAssessments.map((test) => (
                <div key={test.id} className="glass p-6 rounded-2xl border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all relative group">
                  <div className="absolute top-6 right-6 flex items-center gap-2 text-[10px] font-mono font-bold text-red-500">
                    <Clock className="w-3 h-3" />
                    {test.remaining} REMAINING
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-lg font-bold text-white">{test.title}</div>
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">Deployed to {test.candidates} candidates</div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 items-center border-y border-white/5 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                          <svg className="w-12 h-12 -rotate-90">
                            <circle cx="24" cy="24" r="20" className="stroke-white/5 fill-none" strokeWidth="4" />
                            <circle cx="24" cy="24" r="20" className="stroke-[var(--accent-primary)] fill-none animate-pulse" strokeWidth="4" strokeDasharray="125" strokeDashoffset="40" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{test.started}</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white">{test.started}<span className="text-xs text-[var(--text-muted)] font-normal">/{test.candidates}</span></div>
                          <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Started</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xl font-bold text-white">{test.avgScore}%</div>
                        <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Avg Score</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-xl font-bold text-red-500">{test.violations}</div>
                        <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-tight">
                          Proctoring<br />Violations
                        </div>
                        {test.violations > 0 && <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button className="glass-btn px-4 py-2 text-[10px]">EXTEND DEADLINE</button>
                      <button 
                        onClick={() => setShowResults(true)}
                        className="glass-btn px-4 py-2 text-[10px] border-[var(--accent-secondary)] text-[var(--accent-secondary)] group-hover:bg-[var(--accent-secondary)]/10"
                      >
                        VIEW RESULTS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Slider Drawer (Modal) */}
      <AnimatePresence>
        {showResults && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResults(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#121212] glass rounded-3xl border border-white/10 z-[90] overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-white">Assessment Results</h2>
                    <div className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-[0.2em]">Goldman Sachs Quant Round 1</div>
                  </div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-right">
                    12 Candidates <br />
                    <span className="text-green-500">Completed</span>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Histogram Visualization Placeholder */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                    <span>Score Histogram</span>
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="h-48 flex items-end gap-2 border-b border-white/5 pb-2">
                    {[10, 25, 60, 15, 35].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className={`flex-1 rounded-t-lg relative group ${i === 2 ? "bg-[var(--accent-primary)]/40 border-t-2 border-[var(--accent-primary)]" : "bg-white/5 border-t border-white/10"}`}
                      >
                        {i === 2 && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[var(--accent-primary)] tracking-widest">MEDIAN</div>
                        )}
                        {i === 4 && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-green-500 tracking-widest">TOP 10%</div>
                        )}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-[var(--text-muted)] px-2">
                    <span>0%</span><span>20%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <button className="glass-btn px-6 py-3 text-xs w-full">EXPORT DETAILED CSV</button>
                  <button className="premium-btn px-6 py-3 text-xs w-full">ADVANCE TOP 4 CANDIDATES →</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
