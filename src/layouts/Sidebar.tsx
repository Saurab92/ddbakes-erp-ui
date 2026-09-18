import { NavLink } from 'react-router-dom'
import { getAuthSession } from '@/api/auth'
import { useModule } from '@/context/ModuleContext'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const session = getAuthSession()
  const { currentModule } = useModule()

  const rawSections = currentModule.navSections

  const visibleSections = rawSections
    .map((section) => {
      // OP_MANAGER restriction for Bakery/Inventory module
      if (session?.role.toUpperCase() === 'OP_MANAGER' && currentModule.id === 'bakery') {
        if (section.heading !== 'Overview' && section.heading !== 'Inventory') {
          return null
        }
      }
      return section
    })
    .filter((section): section is NonNullable<typeof section> => section !== null)

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-4">
      {visibleSections.map((section) => (
        <div key={section.heading}>
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.heading}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isDashboard =
                item.to === '/' ||
                item.to === '/hr/dashboard' ||
                item.to === '/finance/dashboard' ||
                item.to === '/inventory/dashboard'

              return (
                <li key={item.label}>
                  {item.disabled || !item.to ? (
                    <div
                      className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground/60"
                      aria-disabled="true"
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {item.badge || 'Soon'}
                      </Badge>
                    </div>
                  ) : (
                    <NavLink
                      to={item.to}
                      end={isDashboard}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-foreground/80',
                        )
                      }
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </span>
                      {item.hrOnly && (
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                          HR Only
                        </span>
                      )}
                    </NavLink>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
