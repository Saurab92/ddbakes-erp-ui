import { useState } from 'react'
import { CalendarClock, CalendarDays, CheckCircle2, Clock, ShieldAlert, UserCheck, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const hrSummaryCards = [
  {
    label: 'Total Employees',
    value: '48',
    subtext: 'Active personnel across all branches',
    icon: Users,
  },
  {
    label: "Today's Present",
    value: '44',
    subtext: '91.6% attendance recorded today',
    icon: UserCheck,
  },
  {
    label: 'On Leave Today',
    value: '4',
    subtext: 'Approved leaves in system',
    icon: CalendarDays,
  },
  {
    label: 'Pending Leave Requests',
    value: '3',
    subtext: 'Requires HR review & approval',
    icon: Clock,
  },
]

const recentLeaveRequests = [
  {
    id: 'LV-1092',
    employee: 'Eleanor Vance',
    department: 'Baking Operations',
    type: 'Sick Leave',
    dates: 'Today - Tomorrow (2 days)',
    status: 'Pending',
  },
  {
    id: 'LV-1091',
    employee: 'Marcus Brody',
    department: 'Logistics & Delivery',
    type: 'Casual Leave',
    dates: 'Next Monday (1 day)',
    status: 'Pending',
  },
  {
    id: 'LV-1090',
    employee: 'Sophia Martinez',
    department: 'Quality Control',
    type: 'Annual Leave',
    dates: 'Oct 01 - Oct 05 (5 days)',
    status: 'Approved',
  },
  {
    id: 'LV-1089',
    employee: 'David Chen',
    department: 'Inventory Management',
    type: 'Emergency Leave',
    dates: 'Yesterday (1 day)',
    status: 'Approved',
  },
]

const departmentStats = [
  { name: 'Baking & Production', count: 22, present: 20 },
  { name: 'Logistics & Supply', count: 10, present: 9 },
  { name: 'Storefront & Sales', count: 9, present: 8 },
  { name: 'Quality Assurance', count: 4, present: 4 },
  { name: 'Administration & HR', count: 3, present: 3 },
]

export function HRDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">HR Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Workforce overview, attendance, and centralized HR management.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>HR Portal: Attendance & Leave managed by HR Only</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hrSummaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{card.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Leave Applications</CardTitle>
                <CardDescription className="mt-1">
                  Leave requests submitted for HR authorization
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                HR Admin Action Required
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeaveRequests.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell className="font-medium">{item.employee}</TableCell>
                    <TableCell className="text-muted-foreground">{item.department}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell className="text-xs">{item.dates}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={item.status === 'Approved' ? 'default' : 'secondary'}
                        className="text-[11px]"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Headcount</CardTitle>
            <CardDescription>Attendance distribution by branch team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{dept.name}</span>
                    <span className="text-muted-foreground">
                      {dept.present}/{dept.count} Present
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${(dept.present / dept.count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
