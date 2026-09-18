import { DollarSign, FileSpreadsheet, Receipt, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const financeCards = [
  {
    label: 'Total Revenue (MTD)',
    value: '$48,920.00',
    change: '+12.4% from last month',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    label: 'Total Expenses (MTD)',
    value: '$19,450.00',
    change: '-3.1% from budget target',
    trend: 'down',
    icon: TrendingDown,
  },
  {
    label: 'Net Margin',
    value: '$29,470.00',
    change: '60.2% operating margin',
    trend: 'up',
    icon: DollarSign,
  },
  {
    label: 'Pending Invoices',
    value: '5 ($6,350)',
    change: '2 overdue for follow-up',
    trend: 'down',
    icon: Receipt,
  },
]

const recentInvoices = [
  {
    id: 'INV-2026-001',
    entity: 'Grand Flour Mills Ltd.',
    type: 'Supplier Payment',
    amount: '$3,400.00',
    dueDate: '2026-09-18',
    status: 'Pending',
  },
  {
    id: 'INV-2026-002',
    entity: 'Sweet Delights Cafe (Bulk Order)',
    type: 'Customer Invoice',
    amount: '$1,850.00',
    dueDate: '2026-09-14',
    status: 'Paid',
  },
  {
    id: 'INV-2026-003',
    entity: 'City Packaging Solutions',
    type: 'Supplier Payment',
    amount: '$920.00',
    dueDate: '2026-09-20',
    status: 'Pending',
  },
  {
    id: 'INV-2026-004',
    entity: 'Downtown Catering Co.',
    type: 'Customer Invoice',
    amount: '$4,200.00',
    dueDate: '2026-09-10',
    status: 'Overdue',
  },
]

export function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Finance Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Financial ledger, invoicing, expense tracking and cash flow overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financeCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Invoices & Transactions</CardTitle>
              <CardDescription className="mt-1">
                Overview of latest payables and receivables
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              Live Ledger
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Entity / Party</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs font-medium">{inv.id}</TableCell>
                  <TableCell className="font-medium">{inv.entity}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.type}</TableCell>
                  <TableCell className="text-xs">{inv.dueDate}</TableCell>
                  <TableCell className="text-right font-medium">{inv.amount}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        inv.status === 'Paid'
                          ? 'default'
                          : inv.status === 'Overdue'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="text-[11px]"
                    >
                      {inv.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
