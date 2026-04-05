import Link from "next/link"
import { LayoutDashboard, FileCheck, User, LogOut } from "lucide-react"

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#050505] font-sans antialiased text-[#f5f5f7]">
      {/* Background Blobs (Softer for candidates) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-purple-600/30 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600/20 blur-[200px] rounded-full" />
      </div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col fixed h-screen z-50 bg-black/40 backdrop-blur-3xl">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-baseline gap-1 text-2xl font-black tracking-tighter">
            <span className="text-white">AURA</span>
            <span className="text-[var(--accent-primary)]">HR</span>
          </div>
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Candidate Portal</div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/candidate/dashboard" className="flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold text-white bg-white/10 border border-white/10 group transition-all">
            <LayoutDashboard className="w-4 h-4 text-[var(--accent-primary)]" />
            Selection
          </Link>
          <Link href="/candidate/profile" className="flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <User className="w-4 h-4" />
            My Profile
          </Link>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="glass p-4 rounded-xl space-y-3">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest text-center">Identity Verified</div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Riyan Kothari</div>
                <div className="text-[9px] text-green-500 font-bold uppercase tracking-tighter">● Tier 1 Account</div>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-white/20 hover:text-red-500 transition-colors uppercase tracking-widest py-2">
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12 relative z-10">
        {children}
      </main>
    </div>
  )
}
