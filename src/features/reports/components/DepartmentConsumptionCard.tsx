import { Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { useDepartmentConsumptionQuery } from '@/features/reports/hooks/useConsumptionReports'
import type { DateRange } from '@/types/common'

interface DepartmentConsumptionCardProps {
  range: DateRange
}

export function DepartmentConsumptionCard({ range }: DepartmentConsumptionCardProps) {
  const { data, isLoading, isError, refetch } = useDepartmentConsumptionQuery(range)

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-base font-semibold text-foreground">
          Department-wise Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <TableSkeleton columns={2} rows={4} />
        ) : isError ? (
          <ErrorState
            description="We could not load the department-wise report."
            onRetry={() => refetch()}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            title="No consumption data"
            description="No department consumption found for the selected range."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.departmentId}>
                  <TableCell className="font-medium">{row.departmentName}</TableCell>
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
