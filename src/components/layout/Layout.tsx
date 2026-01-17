import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export function Layout() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main
          className={cn(
            'flex-1 overflow-y-auto p-6 transition-all duration-300',
            sidebarOpen ? 'ml-64' : 'ml-0'
          )}
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
