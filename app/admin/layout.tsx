import Sidebar from "@/components/admin/Sidebar"
import TopHeader from "@/components/admin/TopHeader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#121212] overflow-hidden font-sans antialiased text-[#f5f5f7]">
      {/* Background Blobs (Specific to Admin for tighter focus) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent-glow)] blur-[150px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[var(--accent-blue-glow)] blur-[150px] translate-y-1/2 -translate-x-1/4" />
      </div>

      <Sidebar />
      
      <div className="flex-1 ml-72 flex flex-col relative z-10">
        <TopHeader />
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}
