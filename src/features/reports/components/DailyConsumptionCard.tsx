import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { CalendarClock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import { useDailyConsumptionQuery } from '@/features/reports/hooks/useConsumptionReports'
import type { DateRange } from '@/types/common'

interface DailyConsumptionCardProps {
  range: DateRange
}

type Granularity = 'daily' | 'monthly'

export function DailyConsumptionCard({ range }: DailyConsumptionCardProps) {
  const { data, isLoading, isError, refetch } = useDailyConsumptionQuery(range)
  const [granularity, setGranularity] = useState<Granularity>('daily')

  const rows = useMemo(() => {
    if (!data) return []
    if (granularity === 'daily') {
      return data.map((row) => ({ key: row.date, label: format(parseISO(row.date), 'MMM d, yyyy'), totalQuantity: row.totalQuantity }))
    }
    const byMonth = new Map<string, number>()
    for (const row of data) {
      const monthKey = format(parseISO(row.date), 'yyyy-MM')
      byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + row.totalQuantity)
    }
    return Array.from(byMonth.entries()).map(([monthKey, totalQuantity]) => ({
      key: monthKey,
      label: format(parseISO(`${monthKey}-01`), 'MMMM yyyy'),
      totalQuantity,
    }))
  }, [data, granularity])

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold text-foreground">
            Daily/Monthly Consumption
          </CardTitle>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className={cn('h-7 px-2 text-xs', granularity === 'daily' && 'bg-accent text-accent-foreground')}
            onClick={() => setGranularity('daily')}
          >
            Daily
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className={cn('h-7 px-2 text-xs', granularity === 'monthly' && 'bg-accent text-accent-foreground')}
            onClick={() => setGranularity('monthly')}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <TableSkeleton columns={2} rows={4} />
        ) : isError ? (
          <ErrorState
            description="We could not load the consumption report."
            onRetry={() => refetch()}
          />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No consumption data"
            description="No consumption found for the selected range."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{granularity === 'daily' ? 'Date' : 'Month'}</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  <TableCell className="text-right">{row.totalQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
