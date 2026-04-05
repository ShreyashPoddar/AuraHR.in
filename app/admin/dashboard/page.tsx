"use client"

import { motion } from "framer-motion"
import { 
  Users, 
  LayoutPanelLeft, 
  Clock, 
  Video, 
  FileCheck, 
  Search, 
  Filter, 
  Expand, 
  CheckCircle, 
  XCircle, 
  Send 
} from "lucide-react"
import { useState } from "react"
import { sendCandidateNotification } from "@/app/actions/notification-actions"

export default function AdminDashboard() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const kpis = [
    { label: "Total Applicants", value: "2,847", trend: "+12%", color: "text-green-500" },
    { label: "Active Pipeline", value: "423", trend: "+8%", color: "text-green-500" },
    { label: "Assessments Pending", value: "89", trend: "-4%", color: "text-yellow-500" },
    { label: "Interviews This Week", value: "34", trend: "+22%", color: "text-green-500" },
    { label: "Offers Extended", value: "12", trend: "+50%", color: "text-green-500" },
  ]

  const kanban = [
    { title: "Applied", count: "2.8k", items: [
      { id: "app-1", name: "John Doe", role: "SDE-1", time: "2h ago", avatar: "JD" },
      { id: "app-2", name: "Alice Chen", role: "Quant", time: "5h ago", avatar: "AC" },
    ]},
    { title: "Assessment", count: "89", items: [
      { id: "app-3", name: "Bob Smith", role: "Data Sci", time: "Due in 2h", avatar: "BS", border: "border-l-2 border-yellow-500" },
    ]},
    { title: "Interview", count: "34", items: [
      { id: "app-4", name: "Riyan Kothari", role: "SDE-2", time: "Tomorrow", avatar: "RK", border: "border-l-2 border-blue-500" },
    ]},
  ]

  const handleDecision = async (id: string, type: "OFFER" | "REJECTION") => {
    setIsProcessing(id)
    try {
      const result = await sendCandidateNotification(id, type)
      if (result.success) {
        alert(`${type} sent successfully via Resend!`)
      } else {
        alert(`Simulation: ${type} processed for ${id}`)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(null)
    }
  }

  return (
    <div className="space-y-8 p-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-2xl flex flex-col justify-between group hover:scale-[1.02] transition-transform"
          >
            <div className="text-3xl font-extrabold text-white group-hover:text-[var(--accent-primary)] transition-colors">
              {kpi.value}
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{kpi.label}</div>
              <div className={`text-[10px] font-bold ${kpi.color}`}>{kpi.trend} vs last month</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 glass p-6 rounded-2xl space-y-6 min-h-[600px]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <LayoutPanelLeft className="w-5 h-5 text-[var(--accent-primary)]" />
              Live Application Pipeline
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-6 h-full">
            {kanban.map((col, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{col.title}</span>
                  <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{col.count}</span>
                </div>
                <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-2xl p-3 space-y-3 overflow-y-auto custom-scrollbar">
                  {col.items.map((item, i) => (
                    <div key={i} className={`glass p-4 rounded-xl group/item transition-all hover:bg-white/[0.04] ${item.border || ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[var(--accent-primary)]">
                          {item.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-white truncate">{item.name}</div>
                          <div className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-widest">{item.role}</div>
                        </div>
                      </div>
                      
                      {col.title === "Interview" && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                          <button 
                            disabled={isProcessing === item.id}
                            onClick={() => handleDecision(item.id, "OFFER")}
                            className="flex-1 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-black text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> {isProcessing === item.id ? "SENDING..." : "OFFER"}
                          </button>
                          <button 
                            disabled={isProcessing === item.id}
                            onClick={() => handleDecision(item.id, "REJECTION")}
                            className="flex-1 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-3.5 h-3.5" /> {isProcessing === item.id ? "SENDING..." : "REJECT"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
