import { useState, type ComponentType } from 'react'
import { format, subDays } from 'date-fns'
import { Building2, CalendarClock, PackageSearch } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DateRangePicker } from '@/components/common/DateRangePicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DepartmentConsumptionCard } from '@/features/reports/components/DepartmentConsumptionCard'
import { ProductConsumptionCard } from '@/features/reports/components/ProductConsumptionCard'
import { DailyConsumptionCard } from '@/features/reports/components/DailyConsumptionCard'
import type { DateRange } from '@/types/common'

function lastWeekRange(): DateRange {
  const today = new Date()
  return {
    from: format(subDays(today, 7), 'yyyy-MM-dd'),
    to: format(today, 'yyyy-MM-dd'),
  }
}

type ReportType = 'department' | 'product' | 'daily'

interface ReportOption {
  id: ReportType
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
}

const reportOptions: ReportOption[] = [
  {
    id: 'department',
    title: 'Department-wise Report',
    description: 'View consumption by department.',
    icon: Building2,
  },
  {
    id: 'product',
    title: 'Product-wise Report',
    description: 'View consumption by product.',
    icon: PackageSearch,
  },
  {
    id: 'daily',
    title: 'Daily/Monthly Consumption',
    description: 'View consumption over time.',
    icon: CalendarClock,
  },
]

export function ConsumptionReportsPage() {
  const [range, setRange] = useState<DateRange>(lastWeekRange)
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)

  const selectedReportTable = {
    department: <DepartmentConsumptionCard range={range} />,
    product: <ProductConsumptionCard range={range} />,
    daily: <DailyConsumptionCard range={range} />,
  }[selectedReport ?? 'department']

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consumption Reports"
        description="Review department, product, and time-based consumption for a selected date range."
        actions={<DateRangePicker value={range} onChange={setRange} />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {reportOptions.map((report) => {
          const Icon = report.icon
          const isSelected = selectedReport === report.id

          return (
            <Card
              key={report.id}
              className={isSelected ? 'border-primary ring-1 ring-primary' : undefined}
            >
              <button
                type="button"
                className="w-full text-left"
                aria-pressed={isSelected}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {report.title}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </CardHeader>
              </button>
            </Card>
          )
        })}
      </div>

      {selectedReport && <section>{selectedReportTable}</section>}
    </div>
  )
}
