import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-card p-4 md:flex sticky top-0 h-screen">
       <div className="flex-1">
        <SidebarNav />
      </div>
    </aside>
  )
}
