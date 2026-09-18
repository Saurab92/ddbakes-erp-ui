import {
  Award,
  Banknote,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  Cake,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  FileText,
  Landmark,
  LayoutDashboard,
  PackageSearch,
  PieChart,
  Receipt,
  Ruler,
  Tags,
  TrendingDown,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react'

export type ManagementModuleId = 'bakery' | 'hr' | 'finance'

export interface NavItem {
  label: string
  to?: string
  icon: LucideIcon
  disabled?: boolean
  badge?: string
  hrOnly?: boolean
}

export interface NavSection {
  heading: string
  items: NavItem[]
}

export interface ManagementModuleConfig {
  id: ManagementModuleId
  label: string
  shortLabel: string
  defaultPath: string
  pathPrefix: string
  description: string
  navSections: NavSection[]
}

export const MANAGEMENT_MODULES: Record<ManagementModuleId, ManagementModuleConfig> = {
  bakery: {
    id: 'bakery',
    label: 'DD BAKES MANAGEMENT SYSTEM',
    shortLabel: 'Bakery & Inventory',
    defaultPath: '/',
    pathPrefix: '/inventory',
    description: 'Bakery operations, inventory, supplies and master data management',
    navSections: [
      {
        heading: 'Overview',
        items: [
          { label: 'Dashboard', to: '/', icon: LayoutDashboard },
        ],
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
    ],
  },
  hr: {
    id: 'hr',
    label: 'HR MANAGEMENT',
    shortLabel: 'Human Resources',
    defaultPath: '/hr/dashboard',
    pathPrefix: '/hr',
    description: 'Human resources, attendance, leave management, payroll and performance',
    navSections: [
      {
        heading: 'Overview',
        items: [
          { label: 'Dashboard', to: '/hr/dashboard', icon: LayoutDashboard },
        ],
      },
      {
        heading: 'Staff & Attendance',
        items: [
          { label: 'Employees', to: '/hr/employees', icon: Users },
          { label: 'Attendance', to: '/hr/attendance', icon: CalendarClock, hrOnly: true },
          { label: 'Leave Management', to: '/hr/leave', icon: CalendarDays, hrOnly: true },
        ],
      },
      {
        heading: 'Compensation & Talent',
        items: [
          { label: 'Payroll', to: '/hr/payroll', icon: Banknote },
          { label: 'Recruitment', to: '/hr/recruitment', icon: Briefcase },
          { label: 'Performance', to: '/hr/performance', icon: Award },
        ],
      },
      {
        heading: 'Reports',
        items: [
          { label: 'HR Reports', to: '/hr/reports', icon: FileText },
        ],
      },
    ],
  },
  finance: {
    id: 'finance',
    label: 'FINANCE MANAGEMENT',
    shortLabel: 'Finance & Accounts',
    defaultPath: '/finance/dashboard',
    pathPrefix: '/finance',
    description: 'Financial ledger, invoicing, expense tracking and cash flow',
    navSections: [
      {
        heading: 'Overview',
        items: [
          { label: 'Dashboard', to: '/finance/dashboard', icon: LayoutDashboard },
        ],
      },
      {
        heading: 'Accounting & Ledger',
        items: [
          { label: 'Accounts', to: '/finance/accounts', icon: Landmark },
          { label: 'General Ledger', to: '/finance/ledger', icon: BookOpen },
          { label: 'Invoices', to: '/finance/invoices', icon: Receipt },
          { label: 'Payments', to: '/finance/payments', icon: CreditCard },
        ],
      },
      {
        heading: 'Cash Flow',
        items: [
          { label: 'Expenses', to: '/finance/expenses', icon: TrendingDown },
          { label: 'Income', to: '/finance/income', icon: TrendingUp },
        ],
      },
      {
        heading: 'Reports',
        items: [
          { label: 'Financial Reports', to: '/finance/reports', icon: FileSpreadsheet },
        ],
      },
    ],
  },
}

export const MODULE_LIST = [
  MANAGEMENT_MODULES.bakery,
  MANAGEMENT_MODULES.hr,
  MANAGEMENT_MODULES.finance,
]

export function getModuleFromPath(pathname: string): ManagementModuleConfig {
  if (pathname.startsWith('/hr')) {
    return MANAGEMENT_MODULES.hr
  }
  if (pathname.startsWith('/finance')) {
    return MANAGEMENT_MODULES.finance
  }
  return MANAGEMENT_MODULES.bakery
}
