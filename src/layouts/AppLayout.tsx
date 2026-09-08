import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clearAuthSession, getAuthSession, logout } from '@/api/auth'
import { Sidebar } from '@/layouts/Sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [session, setSession] = useState(getAuthSession)
  const navigate = useNavigate()

  async function handleLogout() {
    if (session) {
      try {
        await logout(session.accessToken)
      } catch {
      } finally {
        clearAuthSession()
      }
    }

    setSession(null)
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h1 className="text-base font-semibold tracking-tight">
          DD BAKES MANAGEMENT SYSTEM
        </h1>
        <div className="ml-auto flex items-center gap-3">
          {session && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.firstName || session.username}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
          <Sidebar />
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-30 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative z-40 w-64 border-r border-border bg-card">
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        <main
          className={cn(
            'flex-1 overflow-x-hidden p-4 sm:p-6',
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
