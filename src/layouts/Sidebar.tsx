import { NavLink } from 'react-router-dom'
import {
  Boxes,
  Building2,
  ClipboardList,
  LayoutDashboard,
  PackageSearch,
  Ruler,
  Tags,
  Users,
  Warehouse,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import { getAuthSession } from '@/api/auth'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  label: string
  to?: string
  icon: LucideIcon
  disabled?: boolean
}

interface NavSection {
  heading: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    heading: 'Overview',
    items: [{ label: 'Dashboard', to: '/', icon: LayoutDashboard }],
  },
  {
    heading: 'Master Data',
    items: [
      { label: 'Products', to: '/products', icon: PackageSearch },
      { label: 'Categories', to: '/categories', icon: Tags },
      { label: 'Units', to: '/units', icon: Ruler },
      { label: 'Departments', to: '/departments', icon: Building2 },
      { label: 'Suppliers', to: '/suppliers', icon: Truck },
      { label: 'Persons', to: '/persons', icon: Users },
    ],
  },
  {
    heading: 'Inventory',
    items: [
      { label: 'Purchases', to: '/purchases', icon: Boxes },
      { label: 'Issue Inventory', to: '/issues', icon: ClipboardList },
      { label: 'Stock', to: '/stocks', icon: Warehouse },
    ],
  },
  {
    heading: 'Reports',
    items: [
      { label: 'Consumption Report', to: '/reports/consumption', icon: ClipboardList },
      { label: 'Stock Report', icon: Warehouse, disabled: true },
    ],
  },
  {
    heading: 'User Management',
    items: [
      { label: 'Users', to: '/users', icon: Users },
      { label: 'Roles', to: '/roles', icon: Users },
    ],
  },
]

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const session = getAuthSession()
  const visibleSections = session?.role.toUpperCase() === 'OP_MANAGER'
    ? navSections.filter((section) => section.heading === 'Overview' || section.heading === 'Inventory')
    : navSections

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-4">
      {visibleSections.map((section) => (
        <div key={section.heading}>
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {section.heading}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => (
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
                      Soon
                    </Badge>
                  </div>
                ) : (
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                        isActive
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground/80',
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
