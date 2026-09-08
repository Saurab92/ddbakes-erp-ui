import { PackageSearch } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TableSkeleton } from '@/components/common/TableSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { useProductConsumptionQuery } from '@/features/reports/hooks/useConsumptionReports'
import type { DateRange } from '@/types/common'

interface ProductConsumptionCardProps {
  range: DateRange
}

export function ProductConsumptionCard({ range }: ProductConsumptionCardProps) {
  const { data, isLoading, isError, refetch } = useProductConsumptionQuery(range)

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <PackageSearch className="h-4 w-4 text-muted-foreground" />
        <CardTitle className="text-base font-semibold text-foreground">
          Product-wise Report
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <TableSkeleton columns={2} rows={4} />
        ) : isError ? (
          <ErrorState
            description="We could not load the product-wise report."
            onRetry={() => refetch()}
          />
        ) : !data || data.length === 0 ? (
          <EmptyState
            title="No consumption data"
            description="No product consumption found for the selected range."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.productId}>
                  <TableCell className="font-medium">{row.productName}</TableCell>
                  <TableCell className="text-right">
                    {row.totalQuantity}
                    {row.unitName ? ` ${row.unitName}` : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
