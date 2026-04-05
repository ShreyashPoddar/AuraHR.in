"use client"

import { Search, Bell, Plus, User } from "lucide-react"

export default function TopHeader({ title = "Dashboard" }: { title?: string }) {
  return (
    <header className="h-20 bg-[#121212]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest">
        <span>Admin</span>
        <span className="text-white/20">/</span>
        <span className="text-white">{title}</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl px-12">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[var(--accent-primary)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search candidates, roles, assessments..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent-primary)] transition-all bg-[var(--bg-card)] backdrop-blur-md"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="premium-btn py-2.5 px-6 text-[11px]">
          <Plus className="w-4 h-4 mr-2 inline" />
          NEW JOB POSTING
        </button>
        
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60 hover:text-white relative">
          <Bell className="w-5 h-5" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[var(--accent-primary)] ring-2 ring-[#121212]" />
        </button>

        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[10px] text-[var(--text-muted)] hover:text-white transition-all">
          AK
        </button>
      </div>
    </header>
  )
}
