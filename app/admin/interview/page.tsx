"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Video, 
  Calendar, 
  Clock, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  MessageSquare, 
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Zap,
  Calendar as CalendarIcon,
  Sparkles,
  Quote
} from "lucide-react"
import { io } from "socket.io-client"
import { useSearchParams } from "next/navigation"
import { getAvailableSlots, createInterviewSession } from "@/app/actions/scheduling-actions"
import { analyzeLiveSpeech } from "@/app/actions/interview-actions"

export default function InterviewRoomPage() {
  return (
    <Suspense fallback={<div>Loading Interview Room...</div>}>
      <InterviewRoomContent />
    </Suspense>
  )
}

function InterviewRoomContent() {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVidOn, setIsVidOn] = useState(true)
  const [activeRoom, setActiveRoom] = useState(false)

  const [anomalies, setAnomalies] = useState([
    { time: "10:04", msg: "Minor eye deviation detected (1.2s)", level: "yellow" },
    { time: "10:05", msg: "Continues tracking normal", level: "green" },
  ])

  const [transcript, setTranscript] = useState<string[]>([])
  const [aiInsight, setAiInsight] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [jitsiLink, setJitsiLink] = useState("")

  const searchParams = useSearchParams()
  const applicationId = searchParams.get("id") || "mock-app-id"
  const socketRef = useRef<any>(null)

  useEffect(() => {
    const fetchSlots = async () => {
      const slots = await getAvailableSlots()
      setAvailableSlots(slots)
    }
    fetchSlots()

    // Connect to Socket server
    socketRef.current = io("http://localhost:3001")
    socketRef.current.emit("join-room", applicationId)

    socketRef.current.on("admin-alert", (data: any) => {
      setAnomalies(prev => [
        ...prev,
        { 
          time: data.timestamp, 
          msg: data.reason, 
          level: data.reason.includes("Tab") ? "red" : "yellow" 
        }
      ])
    })

    socketRef.current.on("speech-update", async (data: any) => {
      setTranscript(prev => [...prev, data.text])
      
      // Trigger AI Analysis for every ~3 sentences or if final
      if (data.final) {
        setIsAnalyzing(true)
        const insight = await analyzeLiveSpeech(data.text, "Software Engineer")
        setAiInsight(insight)
        setIsAnalyzing(false)
      }
    })

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [applicationId])

  const handleLaunchRoom = async () => {
    try {
      const result = await createInterviewSession(applicationId, "s1")
      if (result.success) {
        setJitsiLink(result.jitsiLink!)
        setActiveRoom(true)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const interviews = [
    { name: "Riyan Kothari", role: "SDE-2", time: "10:00 AM", status: "In 15 mins", urgent: true },
    { name: "Alice Chen", role: "Quant", time: "Tomorrow · 2:00 PM", status: "Scheduled", urgent: false },
  ]

  return (
    <div className="space-y-8 h-full flex flex-col p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Setup */}
        <div className="lg:col-span-5 glass p-6 rounded-2xl space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            <CalendarIcon className="w-4 h-4" />
            AI Smart Scheduler
          </div>

          <div className="space-y-4">
            <div className="text-sm font-bold text-white mb-2">Available Slots (Next 48h)</div>
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map(slot => (
                <button 
                  key={slot.id} 
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white hover:border-[var(--accent-primary)] transition-all"
                >
                  {slot.date} · {slot.time}
                </button>
              ))}
            </div>
            
            <div className="flex flex-col gap-3 pt-4">
              <button 
                onClick={handleLaunchRoom}
                className="premium-btn w-full py-3.5 text-xs uppercase tracking-widest"
              >
                SCHEDULE & LAUNCH JITSI
              </button>
            </div>
          </div>
        </div>

        {/* Right: List */}
        <div className="lg:col-span-7 glass p-6 rounded-2xl flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--accent-primary)]" />
            Scheduled Interviews
          </h3>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {interviews.map((interview, i) => (
              <div key={i} className={`p-6 rounded-2xl border-l-4 transition-all hover:bg-white/[0.03] flex items-center justify-between ${interview.urgent ? "bg-white/[0.02] border-[var(--accent-primary)]" : "bg-transparent border-white/10 opacity-60"}`}>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-white">{interview.name} — {interview.role}</div>
                  <div className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-widest">{interview.time} · {interview.status}</div>
                </div>
                {interview.urgent && (
                  <button 
                    onClick={handleLaunchRoom}
                    className="px-6 py-2.5 rounded-full bg-green-600 text-white font-bold text-xs animate-pulse hover:animate-none transition-all"
                  >
                    LAUNCH ROOM
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeRoom && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 glass p-0 rounded-2xl overflow-hidden border border-[var(--accent-primary)]/30 bg-black/60 min-h-[700px] flex relative z-20"
          >
            <div className="flex-1 relative bg-black/40 flex items-center justify-center border-r border-white/5">
              {jitsiLink ? (
                <iframe 
                  src={jitsiLink} 
                  className="w-full h-full border-none"
                  allow="camera; microphone; fullscreen; display-capture"
                />
              ) : (
                <div className="text-[var(--text-muted)] flex flex-col items-center gap-4">
                  <VideoIcon className="w-12 h-12 opacity-20" />
                  <span className="text-xs font-mono tracking-widest opacity-40 uppercase italic">Initializing Secure Video...</span>
                </div>
              )}
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 glass rounded-full border border-white/10 z-30">
                <button onClick={() => setIsMicOn(!isMicOn)} className={`p-3 rounded-full ${isMicOn ? "bg-white/5" : "bg-red-500"}`}>
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsVidOn(!isVidOn)} className={`p-3 rounded-full ${isVidOn ? "bg-white/5" : "bg-red-500"}`}>
                  {isVidOn ? <VideoIcon className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
                </button>
                <button onClick={() => setActiveRoom(false)} className="px-6 py-2 rounded-full bg-red-600 text-white text-xs font-bold">END</button>
              </div>
            </div>

            {/* Sidebar: AI Co-pilot */}
            <div className="w-96 flex flex-col bg-white/[0.01]">
              <div className="p-6 border-b border-white/5 space-y-4">
                <div className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> AuraAI Co-pilot Insights
                </div>
                
                {aiInsight ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${aiInsight.flag === 'positive' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        {aiInsight.flag} response
                      </span>
                      <span className="text-xl font-black text-white">{aiInsight.score}/10</span>
                    </div>
                    <p className="text-xs text-white/60 italic leading-relaxed">"{aiInsight.insight}"</p>
                    {aiInsight.followUp && (
                      <div className="pt-2 border-t border-white/5">
                        <div className="text-[8px] font-bold text-white/40 uppercase mb-1">Suggested Follow-up</div>
                        <div className="text-[10px] font-medium text-[var(--accent-primary)]">{aiInsight.followUp}</div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="h-24 flex items-center justify-center text-center opacity-20 border border-white/5 border-dashed rounded-xl">
                    <div className="text-[10px] font-bold uppercase tracking-widest leading-loose">
                      {isAnalyzing ? "Analyzing speech..." : "Waiting for candidate to speak..."}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Transcript Feed */}
              <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Quote className="w-3 h-3" /> Live Transcript
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {transcript.length > 0 ? transcript.map((text, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] text-white/80 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5"
                    >
                      {text}
                    </motion.div>
                  )) : (
                    <div className="text-[10px] text-white/20 italic text-center pt-10">No speech detected yet</div>
                  )}
                </div>
              </div>

              {/* Anomaly Feed */}
              <div className="h-48 p-6 bg-black/40 border-t border-white/5 flex flex-col gap-4">
                <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" /> AI Anomaly Feed
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {anomalies.map((anom, i) => (
                    <div key={i} className="flex gap-3 text-[9px] font-mono leading-relaxed">
                      <span className="text-white/20">[{anom.time}]</span>
                      <span className={`${anom.level === "red" ? "text-red-500" : "text-yellow-500"} font-medium`}>{anom.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
