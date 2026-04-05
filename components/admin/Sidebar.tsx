"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Users, 
  SearchCode, 
  GraduationCap, 
  Video, 
  Mail, 
  Ban, 
  FileSignature, 
  LineChart, 
  Settings, 
  ShieldCheck 
} from "lucide-react"

const NAV_ITEMS = [
  { label: "CORE RECRUITMENT", items: [
    { name: "Dashboard", icon: <Home className="w-4 h-4" />, href: "/admin/dashboard" },
    { name: "All Applicants", icon: <Users className="w-4 h-4" />, href: "/admin/applicants" },
    { name: "JD Parser & Ranking", icon: <SearchCode className="w-4 h-4" />, href: "/admin/jd-parser" },
    { name: "Academia", icon: <GraduationCap className="w-4 h-4" />, href: "/admin/academia" },
    { name: "Interview Room", icon: <Video className="w-4 h-4" />, href: "/admin/interview" },
  ]},
  { label: "ACTIONS", items: [
    { name: "Communications Hub", icon: <Mail className="w-4 h-4" />, href: "/admin/communications" },
    { name: "Rejection Manager", icon: <Ban className="w-4 h-4" />, href: "/admin/rejections" },
    { name: "Offer Management", icon: <FileSignature className="w-4 h-4" />, href: "/admin/offers" },
  ]},
  { label: "INTELLIGENCE & OPS", items: [
    { name: "Analytics & Reports", icon: <LineChart className="w-4 h-4" />, href: "/admin/analytics" },
    { name: "Settings & Team", icon: <Settings className="w-4 h-4" />, href: "/admin/settings" },
  ]}
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-[#121212] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-extrabold tracking-tighter text-white">AURA</span>
          <span className="text-xl font-extrabold tracking-tighter text-[var(--accent-primary)]">HR</span>
        </div>
        <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-[var(--accent-primary)] uppercase">
          Admin
        </div>
      </div>

      {/* User Identity */}
      <div className="p-6 flex items-center gap-4 bg-white/[0.02] border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-bold text-sm">
          AK
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate">Alisha Khanna</div>
          <div className="text-[10px] text-[var(--text-muted)] truncate uppercase tracking-wider">Lead Talent Ops</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {NAV_ITEMS.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-4 text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase">
              {section.label}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive 
                        ? "bg-white/10 text-white border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]" 
                        : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={`transition-colors ${isActive ? "text-[var(--accent-primary)]" : "group-hover:text-[var(--accent-primary)]"}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Compliance Footer */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <div className="text-[9px] text-[var(--text-muted)] flex items-center gap-2 uppercase tracking-tight">
          <ShieldCheck className="w-3 h-3 text-[var(--accent-primary)]" />
          SOC 2 · GDPR · AES-256
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          847 ACTIVE SESSIONS
        </div>
      </div>
    </aside>
  )
}
