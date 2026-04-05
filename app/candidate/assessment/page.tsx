"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShieldAlert, 
  Clock, 
  Terminal, 
  Code2, 
  Maximize, 
  Minimize, 
  Mic, 
  Video as VideoIcon, 
  AlertCircle,
  CheckCircle2,
  Lock
} from "lucide-react"
import { recordViolation } from "@/app/actions/proctoring-actions"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import Script from "next/script"
import { io } from "socket.io-client"
import { generateAcademiaTest, evaluateAcademiaAnswer } from "@/app/actions/academia-actions"

const FaceMeshTracker = dynamic(() => import("@/components/FaceMeshTracker"), { ssr: false })
const TranscriptionBridge = dynamic(() => import("@/components/TranscriptionBridge"), { ssr: false })

export default function AssessmentRoom() {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [activeLang, setActiveLang] = useState("Python")
  const [timer, setTimer] = useState(3600) // 1 hour
  const searchParams = useSearchParams()
  const applicationId = searchParams.get("id") || "mock-app-id"
  const socketRef = useRef<any>(null)

  const [questions, setQuestions] = useState<any[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 1. Fetch Job ID from Application
    const initTest = async () => {
      const qs = await generateAcademiaTest("mock-job-id")
      if (Array.isArray(qs)) {
        setQuestions(qs)
      }
      setIsLoading(false)
    }
    
    initTest()

    // Proctoring Logic
    socketRef.current = io("http://localhost:3001")
    socketRef.current.emit("join-room", applicationId)

    const handleViolation = async (reason: string) => {
      console.warn(`Violation detected: ${reason}`)
      await recordViolation(applicationId, reason)
      if (socketRef.current) {
        socketRef.current.emit("violation-alert", {
          applicationId,
          reason,
          timestamp: new Date().toLocaleTimeString()
        })
      }
    }

    (window as any).handleAuraViolation = handleViolation

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        await handleViolation("Tab switch detected")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000)
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(interval)
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [applicationId])

  const handleAnswerChange = (val: string) => {
    setUserAnswers(prev => ({ ...prev, [questions[currentQIndex].id]: val }))
  }

  const handleNext = async () => {
    const q = questions[currentQIndex]
    const ans = userAnswers[q.id] || ""
    
    if (q.type === "short") {
      evaluateAcademiaAnswer(applicationId, q.question, ans, q.idealAnswer)
    } else {
      if (ans === q.correctAnswer) {
        evaluateAcademiaAnswer(applicationId, q.question, ans, "MCQ Correct")
      }
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1)
    }
  }

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60)
    const rs = s % 60
    return `${m}:${rs < 10 ? "0" : ""}${rs}`
  }

  const currentQ = questions[currentQIndex]

  if (isLoading) return (
    <div className="fixed inset-0 bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-t-[var(--accent-primary)] border-white/5 rounded-full animate-spin" />
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">AuraAI is generating your technical assessment...</div>
      </div>
    </div>
  )

  return (
    <Suspense fallback={<div>Loading Assessment...</div>}>
      <AssessmentRoomContent />
    </Suspense>
  )
}

function AssessmentRoomContent() {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [activeLang, setActiveLang] = useState("Python")
  const [timer, setTimer] = useState(3600) // 1 hour
  const searchParams = useSearchParams()
  const applicationId = searchParams.get("id") || "mock-app-id"
  const socketRef = useRef<any>(null)

  const [questions, setQuestions] = useState<any[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 1. Fetch Job ID from Application
    const initTest = async () => {
      const qs = await generateAcademiaTest("mock-job-id")
      if (Array.isArray(qs)) {
        setQuestions(qs)
      }
      setIsLoading(false)
    }
    
    initTest()

    // Proctoring Logic
    socketRef.current = io("http://localhost:3001")
    socketRef.current.emit("join-room", applicationId)

    const handleViolation = async (reason: string) => {
      console.warn(`Violation detected: ${reason}`)
      await recordViolation(applicationId, reason)
      if (socketRef.current) {
        socketRef.current.emit("violation-alert", {
          applicationId,
          reason,
          timestamp: new Date().toLocaleTimeString()
        })
      }
    }

    (window as any).handleAuraViolation = handleViolation

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        await handleViolation("Tab switch detected")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000)
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      clearInterval(interval)
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [applicationId])

  const handleAnswerChange = (val: string) => {
    setUserAnswers(prev => ({ ...prev, [questions[currentQIndex].id]: val }))
  }

  const handleNext = async () => {
    const q = questions[currentQIndex]
    const ans = userAnswers[q.id] || ""
    
    if (q.type === "short") {
      evaluateAcademiaAnswer(applicationId, q.question, ans, q.idealAnswer)
    } else {
      if (ans === q.correctAnswer) {
        evaluateAcademiaAnswer(applicationId, q.question, ans, "MCQ Correct")
      }
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1)
    }
  }

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60)
    const rs = s % 60
    return `${m}:${rs < 10 ? "0" : ""}${rs}`
  }

  const currentQ = questions[currentQIndex]

  if (isLoading) return (
    <div className="fixed inset-0 bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-4 border-t-[var(--accent-primary)] border-white/5 rounded-full animate-spin" />
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">AuraAI is generating your technical assessment...</div>
      </div>
    </div>
  )

  return (
    <div className={`fixed inset-0 z-[100] bg-[#050505] flex flex-col font-mono text-[#f5f5f7] ${isFullScreen ? "" : "p-4"}`}>
      <Script 
        src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" 
        strategy="beforeInteractive"
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" 
        strategy="beforeInteractive"
      />
      <div className="h-14 bg-black/40 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-1 text-xl font-black tracking-tighter">
            <span className="text-white">AURA</span>
            <span className="text-[var(--accent-primary)]">HR</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-[10px] font-bold text-green-500 flex items-center gap-2 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            SECURE SESSION · ENCRYPTED
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
            Question {currentQIndex + 1} / {questions.length}
          </div>
          <div className="flex items-center gap-3">
            <Clock className={`w-4 h-4 ${timer < 300 ? "text-red-500 animate-bounce" : "text-white/40"}`} />
            <span className={`text-xl font-black ${timer < 300 ? "text-red-500" : "text-white"}`}>{fmtTime(timer)}</span>
          </div>
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-all"
          >
            {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button className="premium-btn px-6 py-2 text-[10px] font-black">SUBMIT SESSION</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r border-white/10 flex flex-col bg-white/[0.01]">
          <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <span className="px-2 py-1 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-black tracking-widest uppercase">
                Problem 0{currentQIndex + 1} · {currentQ?.type === 'mcq' ? 'MCQ' : 'ANALYSIS'}
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{currentQ?.question}</h2>
              
              {currentQ?.type === 'mcq' ? (
                <div className="space-y-3 pt-6">
                  {currentQ.options.map((opt: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswerChange(opt)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-bold ${userAnswers[currentQ.id] === opt ? "bg-[var(--accent-primary)]/20 border-[var(--accent-primary)] text-white" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-[var(--text-muted)] leading-relaxed pt-6">
                  Provide a detailed technical explanation in the terminal. Your answer will be evaluated by AuraAI.
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-white/5">
              <button 
                onClick={handleNext}
                className="glass-btn w-full py-4 text-xs font-black uppercase tracking-widest bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/20 shadow-lg shadow-[var(--accent-primary)]/5"
              >
                {currentQIndex === questions.length - 1 ? "FINISH TEST" : "NEXT QUESTION"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          <div className="h-12 bg-black/20 border-b border-white/10 flex items-center justify-between px-4">
            <div className="flex gap-2">
              <span className="px-4 py-1.5 rounded-t-lg bg-white/10 text-white border-t border-x border-white/10 text-[10px] font-bold">
                AuraTerminal
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Auto-save active</span>
              <span className="text-green-500/60">● Connected</span>
            </div>
          </div>
          
          <div className="flex-1 p-6 font-mono text-sm overflow-hidden bg-black/40">
            {currentQ?.type === 'short' ? (
              <textarea 
                value={userAnswers[currentQ.id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full h-full bg-transparent border-none text-[var(--accent-primary)] focus:outline-none resize-none custom-scrollbar text-lg"
                placeholder="Enter technical response..."
              />
            ) : (
              <div className="h-full flex items-center justify-center text-center opacity-20">
                <div className="space-y-4">
                  <Lock className="w-12 h-12 mx-auto" />
                  <div className="text-xs font-bold uppercase tracking-widest">Compiler Locked for MCQ</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-80 border-l border-white/10 flex flex-col bg-black">
          <div className="aspect-video relative overflow-hidden group p-4">
            <FaceMeshTracker 
              applicationId={applicationId} 
              onViolation={async (reason) => {
                if ((window as any).handleAuraViolation) {
                  (window as any).handleAuraViolation(reason)
                }
              }} 
            />
          </div>

            <div className="pt-6 border-t border-white/10">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest text-center">Identity Anchor</div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-0.5">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-black text-lg">RK</div>
                  </div>
                  <div className="text-[10px] font-black text-white uppercase">Riyan Kothari</div>
                </div>
              </div>
            </div>
            
            <TranscriptionBridge 
              applicationId={applicationId} 
              socket={socketRef.current} 
              isActive={!!socketRef.current} 
            />
          </div>
      </div>
    </div>
  )
}
